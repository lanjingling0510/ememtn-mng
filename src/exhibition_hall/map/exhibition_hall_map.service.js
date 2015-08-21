const angular = require('angular');
const API_URL = '/apis/v1';


module.exports = angular.module('ememtn.exhibition_hall.map.service', [
    'ngResource',
]).factory('MapService', MapService)
    .factory('MapPreviewService', MapPreviewService);

/* @ngInject */
function MapService($resource) {
    const mapProfileURL = API_URL + '/map-profiles/:profileId';
    const mapLayerURL = API_URL + '/map-layers/:layerName';
    const mapFeatureURL = API_URL + '/map-features/:featureId';

    return {
        MapProfile: $resource(mapProfileURL, null, {
            update: {
                method: 'PUT',
                params: {
                    profileId: '@profileId',
                },
            },
        }),
        MapLayer: $resource(mapLayerURL, null, {}),
        MapFeature: $resource(mapFeatureURL, null, {
            update: {
                method: 'PUT',
                params: {
                    featureId: '@featureId',
                },
            },
        }),
    };
}

/* @ngInject */
function MapPreviewService() {
    const MapCanvas = {
        init: function init(map, token) {
            if (!map) { return false; }
            d3.select('.map-container').select('svg').remove();

            const profile = map.profile;
            this.profile = map.profile;
            this.canvas = d3.select('.map-container').append('svg').attr({
                width: profile.JCRight,
                height: profile.JCBottom,
                viewBox: '0 0 ' + profile.JCRight + ' ' + profile.JCBottom,
                // preserveAspectRatio: 'xMinYMin meet'
            });

            this.draw(map.layers, token);
        },
        getFill: function getFill(layer) {
            let color = Number(layer.JCARGB % 0x1000000).toString(16);
            while (color.length < 6) {
                color = '0' + color;
            }
            return '#' + color;
        },
        getFillOpacity: function getFillOpacity(layer) {
            return parseInt(layer.JCARGB / 0x1000000, 10) / 0xFF;
        },
        draw: function draw(layers, token) {
            layers.forEach(function (layer) {
                this.canvas.append('g').attr({
                    id: layer.JCName,
                });
                this.canvas.append('g').attr({
                    id: 'text-' + layer.JCName,
                });

                if (!layer.features) {
                    return false;
                }
                const layerGeoType = layer.JCGeoType.toLowerCase();
                const layerSymbolStyle = layer.JCSymbolStyle.toLowerCase();

                if (layerGeoType === 'point') {
                    if (layerSymbolStyle === 'circle') {
                        this.drawPoints(layer);
                    }
                } else if (layerGeoType === 'line') {
                    this.drawLines(layer);
                } else if (layerGeoType === 'polygon') {
                    if (layerSymbolStyle === 'solid') {
                        this.drawPolygons(layer);
                    } else if (layerSymbolStyle === 'tile') {
                        this.drawBaseLayer(layer, token);
                    }
                } else {
                    // TODO:
                    return false;
                }

                this.drawTexts(layer);
            }.bind(this));
        },
        drawBaseLayer: function drawBaseLayer(layer, token) {
            if (!layer.features || !token) {
                return false;
            }
            const layerName = layer.JCName;
            // const fill = this.getFill(layer);
            // const fillOpacity = this.getFillOpacity(layer);
            const layerCanvas = this.canvas.select('#' + layerName);

            layerCanvas.selectAll('.' + layerName)
                .data(layer.features)
                .enter()
                .append('image')
                .attr({
                    class: layerName,
                    x: 0,
                    y: 0,
                    width: this.profile.JCRight,
                    height: this.profile.JCBottom,
                    'xlink:href': (d) => {
                        return 'http://map-warehouse.jcbel.com/v1/maps/' + d.JCImage + '?bearer=' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjI2MiwiZW1haWwiOiJmaXNoZWFkQGZpc2hlYWQuaW8iLCJpYXQiOjE0NDAxNDAwMjcsImV4cCI6MTQ0MDc0NDgyNywiYXVkIjoiZmlzaGVhZEBmaXNoZWFkLmlvIiwiaXNzIjoid29ybWhvbGUiLCJzdWIiOiJibGFoIGJsYWgifQ.Vwuipbo_A9ZSux09uRdurmvBuYlKlCFTYCet3M6t2rc';
                    },
                });
        },
        drawTexts: function drawTexts(layer) {
            if (!layer.features) {
                return false;
            }
            const layerName = layer.JCName;
            const layerCanvas = this.canvas.select('#text-' + layerName);

            layerCanvas.selectAll('.text-' + layerName)
                .data(layer.features)
                .enter()
                .append('text')
                .text((d) => {
                    const texts = layer.JCFormat.trim()
                        .split(' ')
                        .map((format) => {
                            const key = format.slice(1);
                            return d[key];
                        });
                    return texts.join('');
                })
                .attr({
                    class: 'test-' + layerName,
                    x: (d) => {
                        return (d.JCLeft + d.JCRight) / 2;
                    },
                    y: (d) => {
                        return (d.JCTop + d.JCBottom) / 2;
                    },
                    'text-anchor': 'middle',
                    // TODO: vertical align
                    // 'alignment-baseline': 'central',
                    fill: '#143B2A',
                    'fill-opacity': 0xFF / 0xFF,
                });
        },
        drawPoints: function drawPoints(layer) {
            const layerName = layer.JCName;
            const fill = this.getFill(layer);
            const fillOpacity = this.getFillOpacity(layer);
            const layerCanvas = this.canvas.select('#' + layerName);

            layerCanvas.selectAll('.' + layerName)
                .data(layer.features)
                .enter()
                .append('circle')
                .attr({
                    class: layerName,
                });

            layerCanvas.selectAll('.' + layerName).transition()
                .duration(1000)
                .ease('bounce')
                .attr({
                    cx: (d) => {
                        return d.JCLeft;
                    },
                    cy: (d) => {
                        return d.JCTop;
                    },
                    r: layer.JCSize,
                    fill: fill,
                    'fill-opacity': fillOpacity,
                });
        },
        drawLines: function drawLines(layer) {
            const layerName = layer.JCName;
            const fill = this.getFill(layer);
            const fillOpacity = this.getFillOpacity(layer);
            const layerCanvas = this.canvas.select('#' + layerName);

            layerCanvas.selectAll('.' + layerName)
                .data(layer.features)
                .enter()
                .append('line')
                .attr({
                    class: layerName,
                });

            layerCanvas.selectAll('.' + layerName).transition()
                .duration(1000)
                .ease('bounce')
                .attr({
                    x1: (d) => {
                        return d.x1;
                    },
                    y1: (d) => {
                        return d.y1;
                    },
                    x2: (d) => {
                        return d.x2;
                    },
                    y2: (d) => {
                        return d.y2;
                    },
                    // stroke: layer.JCSize,
                    fill: fill,
                    'fill-opacity': fillOpacity,
                });
        },
        drawPolygons: function drawPolygons(layer) {
            const layerName = layer.JCName;
            const fill = this.getFill(layer);
            const fillOpacity = this.getFillOpacity(layer);
            const layerCanvas = this.canvas.select('#' + layerName);

            layerCanvas.selectAll('.' + layerName)
                .data(layer.features)
                .enter()
                .append('polygon')
                .attr({
                    class: layerName,
                });

            layerCanvas.selectAll('.' + layerName)
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr({
                    points: (d) => {
                        return d.JCGeoData.trim();
                    },
                    // 'stroke-width': layer.JCSize,
                    fill: fill,
                    'fill-opacity': fillOpacity,
                });
        },
    };

    return {
        MapCanvas: Object.create(MapCanvas),
    };
}
