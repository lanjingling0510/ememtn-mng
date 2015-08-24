let map;
let ctx;
let isScale = false;
const pointList = [];
let currentPoint;
let isBuildComplete = false;
let scope;
let vm;

module.exports.init = function (container, sp) {
    map = container;
    ctx = map[0].getContext('2d');
    scope = sp;
    vm = scope.vm;
    vm.clearPolygons = clearPolygons;
    background();
    map.on('mousedown', mousedown);
    map.on('mousemove', mousemove);
    map.on('mouseup', mouseup);
    $(document).on('contextmenu', function () {
        return false;
    });
};

function background() {
    ctx.clearRect(0, 0, 3948, 3000);  //  擦除画面
}

function mousedown(e) {
    const x = e.pageX - map.offset().left;
    const y = e.pageY - map.offset().top;
    if (isBuildComplete) {      // 构建编辑框完成
        pointList.some(function (value) {
            if (value.isPointInPoint({x: x, y: y})) {
                currentPoint = value;
                isScale = true;
                return true;
            }
        });
    } else {        //  正在构建编辑框
        background();
        if (e.which === 3) {     //    右击鼠标事件(结束编辑)
            if (pointList.length < 3) {
                pointList.length = 0;
            } else {
                isBuildComplete = true;
                getpositionList();
                polygons(ctx, pointList);
                buildAddPoints(pointList);
                pointList.forEach(function (value) {
                    value.draw();
                });
            }
        } else {
            const point = new Point(ctx);
            point.draw(x, y);
            pointList.push(point);
        }
    }
}

function mousemove(e) {
    if (pointList.length === 0) return;
    e.preventDefault();
    let tmpPointList;
    const x = e.pageX - map.offset().left;
    const y = e.pageY - map.offset().top;


    if (isBuildComplete) {      //  构建编辑框完成
        if (isScale) {       // 拖动点
            e.stopPropagation();
            background();
            currentPoint.x = x;
            currentPoint.y = y;
            polygons(ctx, pointList);
            pointList.forEach(function (value) {
                value.draw();
            });
            getpositionList();
        }
    } else {        //  正在构建编辑框
        e.stopPropagation();
        background();
        const tmpPoint = new Point(ctx);
        tmpPoint.draw(x, y);
        if (pointList.length === 1) {
            pointList[0].draw();
            line(ctx, pointList[0].x, pointList[0].y, x, y);
        } else if (pointList.length >= 2) {
            tmpPointList = pointList.map(function (value) {
                value.draw();
                return {
                    x: value.x,
                    y: value.y,
                };
            });
            tmpPointList.push({x: x, y: y});
            polygons(ctx, tmpPointList);
        }
    }
}

function mouseup() {
    let index;
    let point;
    let x;
    let y;
    let current;
    let next;
    if (isScale && currentPoint && currentPoint.isAddPoint) {       //   松开添加点
        currentPoint.isAddPoint = false;
        currentPoint.draw();
        index = pointList.indexOf(currentPoint);
        current = currentPoint;
        next = index === pointList.length - 1 ? pointList[0] : pointList[index + 1];
        pointList.splice(index + 1, 0, point = new Point(ctx, true));
        x = (current.x + next.x) / 2;
        y = (current.y + next.y) / 2;
        point.draw(x, y);

        next = index === 0 ? pointList[pointList.length - 1] : pointList[index - 1];
        pointList.splice(index, 0, point = new Point(ctx, true));
        x = (current.x + next.x) / 2;
        y = (current.y + next.y) / 2;
        point.draw(x, y);
    }

    isScale = false;
}

function buildAddPoints(list) {
    let point;
    let x;
    let y;
    let current;
    let next;
    for (let i = list.length; i--;) {
        current = list[i];
        next = i === list.length - 1 ? list[0] : list[i + 1];
        x = (current.x + next.x) / 2;
        y = (current.y + next.y) / 2;
        list.splice(i + 1, 0, point = new Point(ctx, true));
        point.draw(x, y);
    }
}

function clearPolygons() {
    background();
    pointList.length = 0;
    isBuildComplete = false;
}

function getpositionList() {
    const positionList = [];
    pointList.forEach(function (value) {
        if (!value.isAddPoint) {
            positionList.push(value.x, value.y);
        }
    });
    vm.positionStr = positionList.join(',');
    scope.$apply();
}


/**
 *
 * @param CTX
 * @constructor  Point
 */

function Point(CTX, isAddPoint) {
    this.ctx = CTX;
    this.isAddPoint = isAddPoint || false;
}

Point.prototype.draw = function (x, y) {
    const self = this;
    const CTX = self.ctx;
    x = x || self.x;
    y = y || self.y;
    CTX.beginPath();
    if (self.isAddPoint) {
        CTX.strokeStyle = 'rgba(0,0,0,0.5)';
        CTX.fillStyle = 'rgba(255, 255, 255, 0.5)';
        CTX.lineWidth = 3;
        self.width = 3;
        self.radius = 4;
    } else {
        CTX.strokeStyle = 'rgba(0,0,0,1)';
        CTX.fillStyle = 'rgba(255, 255, 255, 1)';
        CTX.lineWidth = 4;
        self.width = 4;
        self.radius = 5;
    }
    CTX.arc(x, y, self.radius, 0, 2 * Math.PI, true);
    CTX.stroke();
    CTX.fill();
    self.x = x;
    self.y = y;
};


Point.prototype.getBound = function () {
    const self = this;
    return {
        x: self.x - self.radius - self.width,
        y: self.y - self.radius - self.width,
        width: 2 * self.radius + self.width,
        height: 2 * self.radius + self.width,
    };
};

Point.prototype.isPointInPoint = function (point) {
    const self = this;
    const bound = self.getBound();
    if (bound.x <= point.x && point.x <= bound.x + bound.width && bound.y <= point.y && point.y <= bound.y + bound.height) {
        return true;
    }
    return false;
};

/**
 * @name  line
 * @param CTX
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @function
 */
function line(CTX, x1, y1, x2, y2) {
    CTX.strokeStyle = '#ff32ea';
    CTX.strokeWidth = 1;
    CTX.lineCap = 'round';
    CTX.beginPath();
    CTX.moveTo(x1, y1);
    CTX.lineTo(x2, y2);
    CTX.stroke();
    CTX.closePath();
}

/**
 * @name  polygons
 * @param CTX
 * @param list
 * @function
 */
function polygons(CTX, list) {
    CTX.strokeStyle = '#ff32ea';
    CTX.fillStyle = 'rgba(88, 195, 255, 0.56)';
    CTX.strokeWidth = 1;
    CTX.lineCap = 'round';
    CTX.beginPath();
    CTX.moveTo(list[0].x, list[0].y);
    for (let i = 1, len = list.length, point; i < len; i++) {
        point = list[i];
        CTX.lineTo(point.x, point.y);
    }
    CTX.lineTo(list[0].x, list[0].y);
    CTX.stroke();
    CTX.fill();
    CTX.closePath();
}


