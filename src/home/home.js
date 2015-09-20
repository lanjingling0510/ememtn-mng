const angular = require('angular');
const config = require('../config.json');
const h337 = require('../../node_modules/heatmap.js/heatmap.js');
require('./home.directive.js');

module.exports = angular.module('ememtn.home', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.home.directives',
]).config(moduleConfig)
    .controller('HomeController', HomeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        template: require('./home.html'),
        controller: 'HomeController as vm',
    });
}

/* @ngInject */
function HomeController($timeout, $q, Restangular) {
    const vm = this;
    const HeatMap = Restangular.all('heat-maps');
    const BLOCK_WIDTH = config.heatmap.block_width;
    const COL_WIDTH = BLOCK_WIDTH;
    const COL_HEIGHT = BLOCK_WIDTH;
    const pixelRatio = config.heatmap.pixel_ratio;
    const DATA_FETCH_INTERVAL = config.heatmap.fetch_interval; // 秒
    vm.setCurrentFloor = setCurrentFloor;
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[1];
    const paintBoard = h337.create({
        container: document.getElementById('heatmapContainer'),
        // radius: radius,
        // maxOpacity: 0.3,
        // minOpacity: 0,
        // blur: 0.9,
        // gradient: {
        //     '.5': 'blue',
        //     '.8': 'red',
        //     '.95': 'white',
        // },
    });

    fetchData(vm.floor, COL_WIDTH, COL_HEIGHT);
    fetchDataTimer();

    function fetchDataTimer() {
        $timeout(() => {
            fetchData(vm.floor, COL_WIDTH, COL_HEIGHT);
            fetchDataTimer();
        }, 1000 * DATA_FETCH_INTERVAL);
    }

    function formatData(data, colWidth, colHeight) {
        const dataMatrix = [];
        data.map((d) => {
            return {
                x: Math.floor(d.JCX / colWidth),
                y: Math.floor(d.JCY / colHeight),
            };
        }).forEach((d) => {
            dataMatrix[d.x] = dataMatrix[d.x] || [];
            dataMatrix[d.x][d.y] = dataMatrix[d.x][d.y] || 0;
            dataMatrix[d.x][d.y] += 1;
        });
        let dataPoints = [];
        dataMatrix.forEach((rowValue, row) => {
            const formated = rowValue.map((colValue, col) => {
                return {
                    x: colWidth * (col + 0.5) * pixelRatio,
                    y: colHeight * (row + 0.5) * pixelRatio,
                    value: colValue || 0,
                };
            });
            dataPoints.push(...formated);
        });
        dataPoints = dataPoints.filter(d => d);
        return dataPoints;
    }

    function paintHeat(data, colWidth, colHeight) {
        // const min = Math.min(colWidth, colHeight);
        // const radius = Math.sqrt(Math.pow(min, 2) * 2) * pixelRatio;

        const dataPoints = formatData(data, colWidth, colHeight);
        const values = dataPoints.map(d => d.value);
        paintBoard.setData({
            min: 0,
            max: Math.max(...values),
            data: dataPoints,
        });
        paintBoard.repaint();
    }

    function fetchData(floor, colWidth, colHeight) {
        HeatMap.getList({
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).then((heats) => {
            // for (let i = 0, max = 100000; i < max; i += 1) {
            //     heats.push({
            //         JCX: Math.random() * 1000,
            //         JCY: Math.random() * 1000,
            //     });
            // }
            vm.heats = heats;
            paintHeat(heats, colWidth, colHeight);
        });
    }

    function cleanActivation($event) {
        const nodes = Array.from($event.target.parentNode.childNodes).filter((d) => {
            return d.type === 'button';
        });
        nodes.forEach((node) => {
            const classList = node.className.split(' ').filter((c) => {
                return c !== 'active';
            });
            node.className = classList.join(' ');
        });
    }

    function setCurrentFloor($event, floor) {
        // console.log($event);
        cleanActivation($event);

        const classList = $event.target.className.split(' ');
        if (!~classList.indexOf('active')) {
            classList.push('active');
        }
        $event.target.className = classList.join(' ');
        vm.floor = floor;
    }
}
