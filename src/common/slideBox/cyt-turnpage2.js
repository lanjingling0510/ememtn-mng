(function ($) {
    //==========================
    //
    //插件扩展函数
    // cyt_turnpage.changePage;//指定页面转换
    // cyt_turnpage.nextPage;//下一个页面
    // cyt_turnpage.prePage;//上一个页面
    //==========================


    //单例类
    function TurnPage() {
        this._default = {
            subClass: 'slide',
            nowSubClass: 'active'
        };
        this._aniList = [
            {inClass: 'tp-page-moveToLeftEasing', outClass: 'tp-page-moveFromRight'},
            {inClass: 'tp-page-moveToRight', outClass: 'tp-page-moveFromLeft'},
            {inClass: 'tp-page-moveToTop', outClass: 'tp-page-moveFromBottom'},
            {inClass: 'tp-page-moveToBottom', outClass: 'tp-page-moveFromTop'},
            {inClass: 'tp-page-flipOutLeft', outClass: 'tp-page-moveFromRight tp-page-ontop'}
        ];
        this._markerClassName = 'TurnPage';
        this._properName = 'TurnPage';
    }

    TurnPage.prototype = {
        _attachPlugin: function (target, options) {
            target = $(target);
            options = $.extend({}, this._default, options);
            if (target.hasClass(this._markerClassName)) {
                return false;
            }
            target.addClass(this._markerClassName);
            var $pages = target.children('.' + options.subClass);
            var data = {
                currPage: 0,
                currAni: 0,
                currPageLen: $pages.length,
                isAnimating: false,
                endCurrPage: false,
                endNextPage: false
            };
            $.extend(data, options);
            target.data(this._properName, data);
            $pages.eq(data.currPage).addClass(options.nowSubClass);

        },
        _changePagePlugin: function (target, ani, current, next) {
            console.log(ani, current, next);
            var obj = $(target),
                data = obj.data(this._properName),
                inClass = this._aniList[data.currAni].outClass,
                outClass = this._aniList[data.currAni].inClass,
                $pages = obj.children('.' + data.subClass),
                $curPage = $pages.eq(current),
                $nextPage = $pages.eq(next);


            $nextPage.addClass(data.nowSubClass);
            data.isAnimating = true;


            $curPage.addClass(outClass).one('webkitAnimationEnd', function () {
                data.endCurrPage = true;
                if (data.endNextPage) {
                    onEndAnimation();
                }
            });
            $nextPage.addClass(inClass).one('webkitAnimationEnd', function () {
                data.endNextPage = true;
                if (data.endCurrPage) {
                    onEndAnimation();
                }
            });


            var onEndAnimation = function () {
                console.log('ani-end....');
                data.endNextPage = false;
                data.endCurrPage = false;
                data.isAnimating = false;
                $curPage.removeClass(data.nowSubClass).removeClass(outClass);
                $nextPage.removeClass(inClass);
            };


        },
        _nextPagePlugin: function (target) {
            var obj = $(target);
            var data = obj.data(this._properName);
            var current = data.currPage;
            if (data.isAnimating) {
                return;
            }
            data.currAni++;
            if (data.currAni >= this._aniList.length) {
                data.currAni = 0;
            }
            data.currPage++;
            (data.currPage === data.currPageLen) && (data.currPage = 0);
            this._changePagePlugin(target, data.currAni, current, data.currPage);
        },
        _prePagePlugin: function (target) {
            var obj = $(target);
            var data = obj.data(this._properName);
            var current = data.currPage;
            if (data.isAnimating) {
                return;
            }
            data.currAni--;
            if (data.currAni < 0) {
                data.currAni = this._aniList.length - 1;
            }
            data.currPage--;
            (data.currPage === -1) && (data.currPage = data.currPageLen - 1);
            this._changePagePlugin(target, data.currAni, current, data.currPage);
        }

    };


    $.extend($.fn, {
        cyt_turnpage: function (options) {

            var otherArgs = Array.prototype.slice.call(arguments, 1);

            return this.each(function () {
                if (typeof options == "string") {
                    plugin["_" + options + "Plugin"].apply(plugin, [this].concat(otherArgs));
                } else {
                    plugin._attachPlugin(this, options || {});
                }

            })

        }
    })


    var plugin = new TurnPage();


}(jQuery))