'use strict';

let d3 = require('d3');
let angular = require('angular');

module.exports = angular.module('sanya.home.directives')
    .directive('jcTouristRegister', jcTouristRegister);

/* @ngInject */
function jcTouristRegister($q) {
    return {
        template: '<div id="jc-tourist-register"></div>',
        link: link
    };

    function link() {
        fetchData().then(function (data) {
            draw(data);
        }).catch(function (err) {
            console.log(err);
        });
    }

    function draw(data) {
        d3.select('#jc-tourist-register')
            .append('svg')
            .data(data)
            .enter()
            .append('rect')
            .attr(function (d) {
                return {
                    x: function (d, i) {
                        return i * 20;
                    },
                    y: 0,
                    width: 20,
                    height: d.value
                }
            })
            .style(function (d) {

            });
    }

    function fetchData() {
        return $q(function (resolve, reject) {
            // resolve(true);
            let data = [
                {
                    month: 1,
                    count: 100
                }, {
                    month: 2,
                    count: 34
                }, {
                    month: 3,
                    count: 67
                }, {
                    month: 4,
                    count: 12
                }, {
                    month: 5,
                    count: 87
                }
            ];
            resolve(data);
        });
    }
}
