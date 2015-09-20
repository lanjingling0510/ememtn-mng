const angular = require('angular');
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
function HomeController(Restangular) {
    const vm = this;
    const HeatMap = Restangular.all('heat-maps');
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];

    fetchData(vm.floor);

    function paintHeat(data) {
        // for (let i = 0, max = 18 * 14; i < max; i += 1) {
        //     data.push(Math.random());
        // }
        const columnWidth = 50;
        const columnCount = 14;
        const radius = Math.sqrt(Math.pow(columnWidth, 2) * 2);
        const dataPoints = data.map((d, i) => {
            return {
                x: i % columnCount * columnWidth,
                y: Math.floor(i / columnCount) * columnWidth,
                value: d,
            };
        });

        const hm = h337.create({
            container: document.getElementById('heatmapContainer'),
            radius: radius,
            // maxOpacity: 0.5,
            // minOpacity: 0,
            // blur: 0.75,
            // gradient: {
            //     '.5': 'blue',
            //     '.8': 'red',
            //     '.95': 'white',
            // },
        });
        hm.setData({
            min: Math.min(...data),
            max: Math.max(...data),
            data: dataPoints,
        });
        hm.repaint();
    }

    function fetchData(floor) {
        HeatMap.getList({
            JCObjId: floor.JCObjId,
            JCObjMask: floor.JCObjMask,
        }).then((heats) => {
            vm.heats = heats;
            paintHeat(heats);
        });
    }
}
