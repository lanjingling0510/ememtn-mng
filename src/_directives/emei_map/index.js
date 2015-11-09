require('./style.less');
const angular = require('angular');
const ol = require('openlayers');
module.exports = angular.module('jc.emei.map.directive', [])
    .directive('jcEmeiMap', JCEmeiMapDirective);

/* @ngInject */
function JCEmeiMapDirective($q, $timeout, Restangular, AlertService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            onDrawEnd: '&',
            floor: '=',
            selectLayer: '=',
            onSelected: '&',
        },
        template: require('./template.html'),
        // replace: true,
        link: link,
    };

    function link(scope) {
        const MapProfile = Restangular.all('map-profiles');
        const MapLayer = Restangular.all('map-layers');
        const MapFeature = Restangular.all('map-features');

        scope.$watch('floor.JCObjId + floor.JCObjMask', onFloorChange);

        scope.drawPoint = drawPoint;
        scope.drawPolygon = drawPolygon;
        scope.removeSelected = removeSelected;
        scope._onDrawEnd = scope.onDrawEnd() || angular.noop;
        scope._onSelect = scope.onSelected() || angular.noop;

        const projection = new ol.proj.Projection({
            code: 'JCMap',
            units: 'pixels',
            extent: [0, 0, 4000, 4000],
        });

        ol.proj.addProjection(projection);
        ol.proj.addCoordinateTransforms('EPSG:4326', projection, (coordinate) => {
            const extent = projection.getExtent();
            return [coordinate[0], -coordinate[1] + extent[3]];
        }, (coordinate) => {
            const extent = projection.getExtent();
            return [coordinate[0], -coordinate[1] + extent[3]];
        });

        const map = new ol.Map({
            target: 'map-canvas',
            view: new ol.View({
                projection: projection,
                center: ol.extent.getCenter(projection.getExtent()),
                zoomFactor: 2,
                minZoom: 2,
                maxZoom: 5,
                zoom: 3,
            }),
            controls: [
                new ol.control.Zoom(),
                // new ol.control.FullScreen(),
                // new ol.control.ScaleLine(),
                // new ol.control.Rotate(),
            ],
        });

        function drawPoint() {
            const features = new ol.Collection();

            const featureOverlay = new ol.layer.Vector({
                source: new ol.source.Vector({ features: features }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2,
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33',
                        }),
                    }),
                }),
                zIndex: 99,
            });

            const interaction = new ol.interaction.Draw({
                features: features,
                type: 'Point',
            });

            interaction.on('drawend', (event) => {
                const feature = event.feature;
                const geometry = feature.getGeometry();
                const coordinates = ol.proj.transform(geometry.getCoordinates(), 'EPSG:4326', 'JCMap');
                map.removeInteraction(interaction);
                scope._onDrawEnd(coordinates);
            });

            map.addLayer(featureOverlay);
            map.addInteraction(interaction);
        }

        function drawPolygon() {
            const features = new ol.Collection();

            const featureOverlay = new ol.layer.Vector({
                source: new ol.source.Vector({ features: features }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        // color: 'rgba(255, 255, 255, 0.8)',
                        // color: '#96A395',
                        color: '#eebb33',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2,
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33',
                        }),
                    }),
                }),
                zIndex: 99,
            });

            const interaction = new ol.interaction.Draw({
                features: features,
                type: 'Polygon',
            });

            interaction.on('drawend', (event) => {
                const feature = event.feature;
                const geometry = feature.getGeometry();
                const coordinates = geometry.getCoordinates()[0].map((coord) => {
                    return ol.proj.transform(coord, 'EPSG:4326', 'JCMap');
                });

                map.removeInteraction(interaction);
                scope._onDrawEnd(coordinates);
            });

            map.addLayer(featureOverlay);
            map.addInteraction(interaction);
        }

        function onFloorChange() {
            if (!scope.floor || scope.floor.JCObjId === undefined || scope.floor.JCObjMask === undefined) { return; }
            renderMap(scope.floor);
        }

        function renderMap(floor) {
            prepareMap(floor);
            cleanLayers();
            appendLayers(floor, 'base', [
                'obs',
                'stall',
                'beacon',
                'port',
                'area',
                // 'navigate',
                'serv_desk',
                'rest_area',
                'smoking_area',
                'stairway',
                // 'trade_area',
            ]);
        }

        function prepareMap(floor) {
            MapProfile.one(`${floor.JCObjId}:${floor.JCObjMask}`).get().then((mapProfile) => {
                projection.setExtent([0, 0, mapProfile.JCRight, mapProfile.JCBottom]);
                // projection.setExtent([0, 0, 4000, 4000]);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }

        function cleanLayers() {
            map.getLayers().forEach((layer) => {
                map.removeLayer(layer);
            });
        }

        function appendLayers(floor, baseLayerName = 'base', vectorLayerNames = []) {
            appendBaseLayer(floor, baseLayerName).then(() => {
                vectorLayerNames.forEach((vectorLayerName, index) => {
                    appendVectorLayer(floor, vectorLayerName, index);
                });
            });
        }

        function fetchLayer(floor, layerName) {
            return MapLayer.one(layerName).get({
                JCObjId: floor.JCObjId,
                JCObjMask: floor.JCObjMask,
            });
        }

        function appendBaseLayer(floor, baseLayerName = 'base') {
            return MapFeature.getList({
                JCObjId: floor.JCObjId,
                JCObjMask: floor.JCObjMask,
                JCLayerName: baseLayerName,
            }).then((layerInfo) => {
                const mapImageName = layerInfo.pop().JCImage;
                const baseLayer = new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        imageExtent: projection.getExtent(),
                        url: `http://map-warehouse.jcbel.com/v1/maps/${mapImageName}`,
                    }),
                });
                map.addLayer(baseLayer);
            });
        }

        function appendVectorLayer(floor, vectorLayerName, zIndex = 0) {
            return fetchLayer(floor, vectorLayerName).then((layerInfo) => {
                const color = {
                    alpha: parseInt('0x' + layerInfo.JCARGB.toString(16).slice(0, 2), 16) / 100,
                    red: parseInt('0x' + layerInfo.JCARGB.toString(16).slice(2, 4), 16),
                    green: parseInt('0x' + layerInfo.JCARGB.toString(16).slice(4, 6), 16),
                    blue: parseInt('0x' + layerInfo.JCARGB.toString(16).slice(6, 8), 16),
                };
                const rgba = `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
                const baseURL = '/apis/map-feature-geo.app';
                const source = new ol.source.Vector({
                    url: `${baseURL}?JCObjId=${floor.JCObjId}&JCObjMask=${floor.JCObjMask}&JCLayerName=${vectorLayerName}`,
                    format: new ol.format.GeoJSON(),
                });
                const styles = (function () {
                    const style = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: rgba,
                        }),
                        stroke: new ol.style.Stroke({
                            color: rgba,
                            width: 2,
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: rgba,
                            }),
                        }),
                        text: new ol.style.Text({
                            text: '',
                        }),
                    });
                    const _styles = [style];
                    return function (feature) {
                        if (feature.get('JCLayerName') === 'stall') {
                            style.getText().setText(feature.get('name'));
                        }
                        return _styles;
                    };
                })();
                const layer = new ol.layer.Vector({
                    source: source,
                    zIndex: zIndex,
                    style: styles,
                });
                map.addLayer(layer);

                addSelectInteraction(vectorLayerName, layer);
            });
        }

        function addSelectInteraction(name, layer) {
            if (!scope.selectLayer || name !== scope.selectLayer) { return; }

            const interaction = new ol.interaction.Select({
                features: layer,
            });

            interaction.on('select', (event) => {
                if (event.selected[0]) {
                    const feature = event.selected[0];
                    $timeout(() => {
                        scope._selectedLayer = layer;
                        scope._selectedFeature = feature;
                    }, 0);
                    scope._onSelect(feature);
                }
            });

            map.addInteraction(interaction);
        }

        function removeSelected(feature, layer) {
            layer.getSource().removeFeature(feature);

            const properties = feature.getProperties();
            MapFeature.one(properties.JCGUID).remove({
                profileId: `${properties.JCObjId}:${properties.JCObjMask}`,
                JCLayerName: properties.JCLayerName,
            }).then(() => {
                AlertService.success('删除成功');
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }
    }
}
