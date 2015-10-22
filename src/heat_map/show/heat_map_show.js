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
    const MapProfile = Restangular.all('map-profiles');
    const PavilionMap = Restangular.all('pavilion_maps.app');

    const BLOCK_WIDTH = config.heatmap.block_width;
    const COL_WIDTH = BLOCK_WIDTH;
    const COL_HEIGHT = BLOCK_WIDTH;
    const DATA_FETCH_INTERVAL = config.heatmap.fetch_interval; // 秒

    vm.containerStyle = {};
    vm.onFloorChange = onFloorChange;
    vm.showHistoryData = showHistoryData;
    vm.showCurrentData = showCurrentData;
    vm.stopDateSettingTimer = stopDateSettingTimer;
    vm.changeYear = changeYear;
    vm.changeMonth = changeMonth;
    vm.changeDate = changeDate;
    vm.changeHour = changeHour;
    vm.changeMinute = changeMinute;

    vm.clock = new Date();
    startDateSettingTimer();

    function stopDateSettingTimer() {
        $interval.cancel(vm.dateSettingTimer);
        vm.dateSettingTimer = undefined;
    }

    function startDateSettingTimer() {
        stopDateSettingTimer();
        vm.dateSettingTimer = $interval(() => {
            vm.clock.setSeconds(vm.clock.getSeconds() + 1);
            setTime(vm.clock);
        }, 1000 * 1, 0, false);
    }

    function onFloorChange(floor) {
        vm.floor = floor;
        fetchPavilionByFloor(floor);
        // startDateSettingTimer();
        startDataFetchTimer(floor);
    }

    function fetchPavilionByFloor(floor) {
        MapProfile.get(`${floor.JCObjId}:${floor.JCObjMask}`).then((profile) => {
            vm.containerStyle.width = `100%`;
            vm.pixelWidth = document.getElementById('heatmapContainer').clientWidth;
            vm.pixelHeight = profile.JCBottom * (vm.pixelWidth / profile.JCRight);
            vm.containerStyle.height = `${vm.pixelHeight}px`;

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

            return PavilionMap.doGET('', {
                JCObjId: floor.JCObjId,
                JCObjMask: floor.JCObjMask,
            });
        }).then((resp) => {
            vm.pavilionMap = resp.data;
            if (vm.pavilionMap.mapFile) {
                vm.containerStyle['background-image'] = `url(${vm.pavilionMap.mapFile})`;
                vm.containerStyle['background-repeat'] = 'no-repeat';
                vm.containerStyle['background-size'] = 'contain';
            }
        });
    }

    function stopDataFetchTimer() {
        $interval.cancel(vm.dataFetchTimer); // cancel timer when state change
        vm.dataFetchTimer = undefined;
    }

    function startDataFetchTimer(floor) {
        stopDataFetchTimer();
        vm.dataFetchTimer = $interval(() => {
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
            time: vm.clock.valueOf(),
        }).then((heats) => {
            vm.heats = heats;
            paintHeat(heats, colWidth, colHeight);
        });
    }

    function setTime(clock) {
        vm.time = vm.time || {};
        vm.time.year = clock.getFullYear();
        vm.time.month = clock.getMonth() + 1;
        vm.time.day = clock.getDate();
        vm.time.hour = clock.getHours();
        vm.time.minute = clock.getMinutes();
        vm.time.second = clock.getSeconds();
    }

    function showHistoryData() {
        stopDateSettingTimer();
    }

    function showCurrentData() {
        vm.clock = new Date();
        setTime(vm.clock);
        startDateSettingTimer();
    }

    function changeYear(year) {
        vm.clock.setFullYear(year);
    }

    function changeMonth(month) {
        vm.clock.setMonth(month);
    }

    function changeDate(day) {
        vm.clock.setDate(day);
    }

    function changeHour(hour) {
        vm.clock.setHours(hour);
    }

    function changeMinute(minute) {
        vm.clock.setMinutes(minute);
    }

    $rootScope.$on('$stateChangeStart', () => {
        stopDateSettingTimer();
        stopDataFetchTimer();
    });
}
