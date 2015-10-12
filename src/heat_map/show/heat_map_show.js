const angular = require('angular');
const config = require('../../config.json');
const h337 = require('../../../node_modules/heatmap.js/heatmap.js');
require('../../pavilion/map_test/jcmap.profile.directive.js');
require('../../pavilion/map_test/jcmap.layer.tile.directive.js');
require('../../pavilion/map_test/jcmap.feature.base.directive.js');
require('../../_directives/jc_emei_floors_button_group');

module.exports = angular.module('ememtn.heat-map.show', [
    'ui.router',
    'ememtn.common.services',
    'jcmap.profile.directive',
    'jcmap.layer.tile.directive',
    'jcmap.feature.base.directive',
    'jc.emei.floors.button_group.directive',
]).config(moduleConfig)
    .controller('HeatMapController', HeatMapController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('heat-map-show', {
        url: '/heat-map',
        template: require('./heat_map_show.html'),
        controller: 'HeatMapController as vm',
    }).state('home', {
        url: '/',
        template: require('./heat_map_show.html'),
        controller: 'HeatMapController as vm',
    });
}

/* @ngInject */
function HeatMapController($rootScope, $timeout, $interval, $q, Restangular) {
    const vm = this;
    const HeatMap = Restangular.all('heat-maps');
    const Pavilion = Restangular.all('pavilions');
    const MapProfile = Restangular.all('map-profiles');

    const BLOCK_WIDTH = config.heatmap.block_width;
    const COL_WIDTH = BLOCK_WIDTH;
    const COL_HEIGHT = BLOCK_WIDTH;
    const DATA_FETCH_INTERVAL = config.heatmap.fetch_interval; // 秒

    vm.containerStyle = {};
    vm.onFloorChange = onFloorChange;
    vm.showHistoryData = showHistoryData;
    vm.showCurrentData = showCurrentData;
    vm.stopDateSettingTimer = stopDateSettingTimer;

    let dateSettingTimer;
    function stopDateSettingTimer() {
        $interval.cancel(dateSettingTimer);
    }

    function startDateSettingTimer() {
        stopDateSettingTimer();
        dateSettingTimer = $interval(() => {
            setTime(new Date());
        }, 1000 * 1);
    }

    function onFloorChange(floor) {
        vm.floor = floor;
        fetchPavilionByFloor(floor);
        startDateSettingTimer();
        startDataFetchTimer(floor);
    }

    function fetchPavilionByFloor(floor) {
        MapProfile.get(`${floor.JCObjId}:${floor.JCObjMask}`).then((profile) => {
            vm.containerStyle.width = `100%`;
            vm.container = document.getElementById('heatmapContainer');
            vm.pixelWidth = vm.container.clientWidth;

            const widthScaleTo = profile.JCBottom * (vm.pixelWidth / profile.JCRight);
            vm.containerStyle.height = `${widthScaleTo}px`;

            $timeout(() => {
                vm.container = document.getElementById('heatmapContainer');
                vm.pixelHeight = vm.container.clientHeight;
            }, 500);

            $timeout(() => {
                vm.paintBoard = vm.paintBoard || h337.create({
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
            }, 1000);

            vm.realWidth = profile.JCRight * profile.JCScaleX;
            vm.realHeight = profile.JCBottom * profile.JCScaleY;
            vm.pixelRatioX = vm.pixelWidth / vm.realWidth;
            vm.pixelRatioY = vm.pixelHeight / vm.realHeight;

            return Pavilion.doGET('', {
                JCObjId: floor.JCObjId,
                JCObjMask: floor.JCObjMask,
            });
        }).then((pavilion) => {
            vm.pavilion = pavilion;
            if (vm.pavilion.pictures[0]) {
                vm.containerStyle['background-image'] = `url(${vm.pavilion.pictures[0].fileUrl})`;
                vm.containerStyle['background-repeat'] = 'no-repeat';
                vm.containerStyle['background-size'] = 'contain';
            }
        });
    }

    let dataFetchTimer;
    function stopDataFetchTimer() {
        $interval.cancel(dataFetchTimer); // cancel timer when state change
    }

    function startDataFetchTimer(floor) {
        stopDataFetchTimer();
        dataFetchTimer = $interval(() => {
            fetchData(floor, COL_WIDTH, COL_HEIGHT);
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
                    x: colWidth * (col + 0.5) * vm.pixelRatioX,
                    y: colHeight * (row + 0.5) * vm.pixelRatioY,
                    value: colValue || 0,
                };
            });
            dataPoints.push(...formated);
        });
        dataPoints = dataPoints.filter(d => d);
        return dataPoints;
    }

    function paintHeat(data, colWidth, colHeight) {
        const dataPoints = formatData(data, colWidth, colHeight);
        const values = dataPoints.map(d => d.value);
        vm.paintBoard.setData({
            min: 0,
            max: Math.max(...values),
            data: dataPoints,
        });
        vm.paintBoard.repaint();
    }

    function fetchData(floor, colWidth, colHeight) {
        HeatMap.getList({
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
            time: vm.time.value,
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

    function setTime(time) {
        time = new Date(time); // eslint-disable-line no-param-reassign
        vm.time = {
            value: time.valueOf(),
            year: time.getFullYear(),
            month: time.getMonth(),
            day: time.getDate(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
        };
    }

    function showHistoryData() {
        stopDateSettingTimer();
    }

    function showCurrentData() {
        startDateSettingTimer();
    }

    $rootScope.$on('$stateChangeStart', () => {
        stopDateSettingTimer();
        stopDataFetchTimer();
    });
}
