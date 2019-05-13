var CordonLine = (function(){
    var map, layer, view, options,prjCoordSys,vectorLayer,epsgcode,url = "http://119.3.246.90:8090/iserver/services/map-ugcv5-CordonLine/rest/maps/Cordon_Line",isMvt = false;
    var lon=0,lat=0,zoomlevel=2,initZoomToScale;
    var envelope;

    var queryString = "";
    // 中继服务发送的请求，queryString字段是类似“token=&isMvt=true"这种情况，和普通请求做一下兼容处理
    var parms = queryString.split("&");
    for(var i = 0; i < parms.length; i++) {
        if(parms[i] == "isMvt=true") {
            isMvt = true;
            break;
        }
    }
    function _(m){
        map = m;
        var originResult = {"viewBounds":{"top":4624249.86373016,"left":432220.9267338826,"bottom":4623090.349201336,"leftBottom":{"x":432220.9267338826,"y":4623090.349201336},"right":433380.44126270624,"rightTop":{"x":433380.44126270624,"y":4624249.86373016}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"METER","scale":5.841525194345576E-5,"description":null,"paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":{"centralParallel":0,"firstPointLongitude":0,"rectifiedAngle":0,"scaleFactor":1,"falseNorthing":0,"centralMeridian":87,"secondStandardParallel":0,"secondPointLongitude":0,"azimuth":0,"falseEasting":500000,"firstStandardParallel":0},"epsgCode":4538,"coordUnit":"METER","name":"China_2000_3_DEGREE_GK_Zone_29N","projection":{"name":"Gauss_Kruger","type":"PRJ_GAUSS_KRUGER"},"type":"PCS_USER_DEFINED","coordSystem":{"datum":{"name":"D_China_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.003352810681182319,"name":"CGCS2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[5.841525194345576E-5,1.1683050388691085E-4,2.3366100777382442E-4,4.6732201554764883E-4,9.346440310953414E-4,0.0018692880621906827,0.0037385761243813654],"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":432800.6839982944,"y":4623670.106465748},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":{"centralParallel":0,"firstPointLongitude":0,"rectifiedAngle":0,"scaleFactor":1,"falseNorthing":0,"centralMeridian":87,"secondStandardParallel":0,"secondPointLongitude":0,"azimuth":0,"falseEasting":500000,"firstStandardParallel":0},"epsgCode":4538,"coordUnit":"METER","name":"China_2000_3_DEGREE_GK_Zone_29N","projection":{"name":"Gauss_Kruger","type":"PRJ_GAUSS_KRUGER"},"type":"PCS_USER_DEFINED","coordSystem":{"datum":{"name":"D_China_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.003352810681182319,"name":"CGCS2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":false,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"Cordon_Line","bounds":{"top":4623892.370799446,"left":432607.5002566871,"bottom":4623447.842132049,"leftBottom":{"x":432607.5002566871,"y":4623447.842132049},"right":432993.86773990176,"rightTop":{"x":432993.86773990176,"y":4623892.370799446}},"backgroundStyle":null};
        var visibleScales = originResult.visibleScales;
        var visableResolution = [4.529353628217545,2.2646768141087854,1.1323384070543794,0.5661692035271897,0.28308460176358163,0.14154230088179082,0.07077115044089541];
        var prjParamter =  "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";
        var attrib = 'Map data &copy; 2013 Lantm?teriet, Imagery &copy; 2013 SuperMap';
        var projection = 'EPSG:3857';
        var maxZoom = 18;
        var zoom = 0;
        options = {};
        options.maxZoom = 18;
        options.minZoom = 0;
        options.attribution = attrib;
        if(originResult.overlapDisplayed){
            options.overlapDisplayed=originResult.overlapDisplayed;
        }
        var envelope;

        if(originResult.prjCoordSys){
            var resolution;
            if(originResult.prjCoordSys.coordUnit){
                resolution = scaleToResolution(originResult.scale, 96, originResult.prjCoordSys.coordUnit);
            }

            if(isMvt){
                var styleJson = getVectorStyle();
                // 如果style.json中有indexbounds，那么就根据indexbounds计算地图的缩放层级zoom
                if(styleJson && styleJson.metadata && styleJson.metadata.indexbounds){
                    var indexbounds = styleJson.metadata.indexbounds;
                    if(indexbounds.length == 4) {
                        envelope = {};
                        envelope.left = indexbounds[0];
                        envelope.bottom = indexbounds[1];
                        envelope.right = indexbounds[2];
                        envelope.top = indexbounds[3];
                    }
                } else {
                    envelope = getProjectionExtent();
                }
            }

            if(visableResolution.length == 0){
                if(!envelope) {
                    envelope = getProjectionExtent();
                }
                if(!envelope) {
                    envelope = originResult.bounds;
                }
                visableResolution = getStyleResolutions(envelope);
                var scales = getScales(envelope, originResult.prjCoordSys.coordUnit);
                if(originResult.scale){
                    var temp;
                    for(var j = 0; j < scales.length; j++){
                        if(j == 0) {
                            temp = Math.abs(originResult.scale - scales[j]);
                        }
                        if(temp > Math.abs(originResult.scale - scales[j])){
                            temp = Math.abs(originResult.scale - scales[j]);
                            zoom = j;
                        }
                    }
                }
            } else {
                if(resolution){
                    var temp;
                    for(var j = 0; j < visableResolution.length; j++){
                        if(j == 0) {
                            temp = Math.abs(resolution - visableResolution[j]);
                        }
                        if(temp > Math.abs(resolution - visableResolution[j])){
                            temp = Math.abs(resolution - visableResolution[j]);
                            zoom = j;
                        }
                    }
                }
            }
            if(epsgcode&&originResult.prjCoordSys.type!="PCS_NON_EARTH") {//有设置动态投影而且不是平面坐标的地图
                if(epsgcode=="4326"){
                    options.projection = 4326;
                    projection = 'EPSG:4326';
                }else if(epsgcode=="3857"){
                    options.projection = 3857;
                    projection = 'EPSG:3857';
                }
            } else {//没有设置动态投影
                if(isMvt && originResult.prjCoordSys.epsgCode && originResult.prjCoordSys.epsgCode != -1000 && originResult.prjCoordSys.epsgCode != -1){
                    projection = 'EPSG:' + originResult.prjCoordSys.epsgCode;
                } else if (originResult.prjCoordSys.epsgCode=="4326" || originResult.prjCoordSys.type=="PCS_EARTH_LONGITUDE_LATITUDE") {
                    lon = (originResult.bounds.left + originResult.bounds.right) / 2;
                    lat = (originResult.bounds.bottom + originResult.bounds.top) / 2;
                    projection = 'EPSG:4326';
                } else if (originResult.prjCoordSys.epsgCode=="3857" || originResult.prjCoordSys.type=="PCS_SPHERE_MERCATOR") {
                    projection = 'EPSG:3857';
                } else if (originResult.prjCoordSys.type=="PCS_NON_EARTH") {
                    projection = new ol.proj.Projection({
                        extent: [originResult.bounds.left, originResult.bounds.bottom, originResult.bounds.right, originResult.bounds.top],
                        units: 'm',
                        code: '0'
                    });
                } else {
                    projection = 'EPSG:3857';
                }
            }
        }

        var tileGrid;
        if(visableResolution.length > 0) {
            tileGrid = new ol.tilegrid.TileGrid({
                extent: [originResult.bounds.left, originResult.bounds.bottom, originResult.bounds.right, originResult.bounds.top],
                resolutions: visableResolution
            });
        }else{
            tileGrid = ol.source.TileSuperMapRest.optionsFromMapJSON(url, originResult).tileGrid;
            visableResolution = tileGrid.getResolutions();
        }

        if(isMvt && projection != 'EPSG:3857' && projection != 'EPSG:4326'){
            if(prjParamter){
                proj4.defs(projection,prjParamter);
                var prj = ol.proj.get(projection);
                prj.setExtent([envelope.left, envelope.bottom, envelope.right, envelope.top]);
            }
        }

        view = new ol.View({
            center: [(originResult.bounds.left + originResult.bounds.right) / 2, (originResult.bounds.bottom + originResult.bounds.top) / 2],
            zoom: zoom,
            projection: projection,
            resolutions: visableResolution
        });


        if(isMvt){
            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            info = new ol.control.Control({
                element: container
            });
            info.setMap(map);
            map.addControl(info);

        }
        var format = new ol.format.MVT({
            featureClass: ol.Feature
        });
        format.defaultDataProjection = new ol.proj.Projection({
            code: projection,
            units: ol.proj.Units.TILE_PIXELS
        });

        if(isMvt){
            var host = "http://119.3.246.90:8090/iserver/services/map-ugcv5-CordonLine/rest";
            host = host.substring(0,host.indexOf("/iserver"));
            url = (window.isLocal ? window.server : host) + url;
            var styleResolutions = getStyleResolutions(envelope);
            var style = new ol.supermap.MapboxStyles({
                url: url,
                source: originResult.name,
                resolutions: styleResolutions,
                map:map
            })
            var origin = [envelope.left, envelope.top];
            style.on('styleloaded', function () {
                vectorLayer = new ol.layer.VectorTile({
                    //设置避让参数
                    declutter: true,
                    source: new ol.source.VectorTileSuperMapRest({
                        url: url,
                        projection: projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            resolutions: styleResolutions,
                            origin: origin,
                            tileSize: 512
                        }),
                        tileType: "ScaleXY",
                        format: format
                    }),
                    style: style.getStyleFunction()
                });
                map.addLayer(vectorLayer);
            })

            map.on('pointermove', function (e) {
                var features = map.getFeaturesAtPixel(e.pixel);
                if (!features) {
                    content.innerHTML = '';
                    container.style.opacity = 0;
                    return;
                }
                content.innerHTML = "Layer: " + features[0].get('layer') + "<br />" + (features[0].get('NAME') ?
                    "Name:  " + features[0].get('NAME') : "");
                container.style.opacity = 1;

            });
            console.log("vectorlayer");
        }else{
            console.log("layer");
            options.url = url;
            options.tileGrid = tileGrid;
            layer = new ol.layer.Tile({
                source: new ol.source.TileSuperMapRest(options)
            });
            map.addLayer(layer);
        }
    }

    function getProjection(epsgCodeStr, bounds, resolutions) {
        return new L.Proj.CRS(epsgCodeStr,"",{
            bounds: L.bounds([bounds.left, bounds.bottom], [bounds.right, bounds.top]),
            resolutions: resolutions,
            origin: [bounds.left, bounds.top]
        });
    }

    function showScale(){
        var scale = layer.getScale();
        scale = parseInt(1 / scale * 10) / 10;
        var scaleText = document.getElementById("scaleText");
        scaleText.value="比例尺： 1/" + scale;
    }

    function showCoords(){
        var mapdiv = document.getElementById("map");
        var coordsText = document.getElementById("coordsText");
        mapdiv.onmousemove = function(e){
            e = e||window.event;
            var point = map.mouseEventToLatLng(e);
            coordsText.value=parseFloat(point.lat).toFixed(4)+","+parseFloat(point.lng).toFixed(4);
        }
    }

    function getProjectionExtent(){
        var requestUrl = "/iserver/services/map-ugcv5-CordonLine/rest/maps/Cordon_Line";
        requestUrl = requestUrl + "/" + "prjCoordSys/projection/extent.json";
        var commit = new Requester();
        var extent = commit.sendRequestWithResponse(requestUrl, "GET", null);
        if(extent){
            var result = eval('('+extent+')');
            if(result && result.left && result.right && result.top && result.bottom) {
                return result;
            }
        }
        return null;
    }

    function getVectorStyle(){
        var requestUrl = "/iserver/services/map-ugcv5-CordonLine/rest/maps/Cordon_Line";
        requestUrl = requestUrl + "/" + "tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true";
        var commit = new Requester();
        try {
            var style = commit.sendRequestWithResponse(requestUrl, "GET", null);
            return JSON.parse(style);
        }catch(ex){
            return null;
        }
    }

    function setPrjCoordSys() {// 支持动态投影，解析url相应参数
    }

    function scaleToResolution(scale, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        var meterPerMapUnitValue = getMeterPerMapUnit(mapUnit);
        var resolution = scale * dpi * inchPerMeter * meterPerMapUnitValue;
        resolution = 1 / resolution;
        return resolution;
    }

    function resolutionToScale(resolution, dpi, mapUnit) {
        var inchPerMeter = 1 / 0.0254;
        // 地球半径。
        var meterPerMapUnit = getMeterPerMapUnit(mapUnit);
        var scale = resolution * dpi * inchPerMeter * meterPerMapUnit;
        scale = 1 / scale;
        return scale;
    }

    function getMeterPerMapUnit(mapUnit) {
        var earchRadiusInMeters = 6378137;// 6371000;
        var meterPerMapUnit;
        if (mapUnit == "METER") {
            meterPerMapUnit = 1;
        } else if (mapUnit == "DEGREE") {
            // 每度表示多少米。
            meterPerMapUnit = Math.PI * 2 * earchRadiusInMeters / 360;
        } else if (mapUnit == "KILOMETER") {
            meterPerMapUnit = 1.0E-3;
        } else if (mapUnit == "INCH") {
            meterPerMapUnit = 1 / 2.5399999918E-2;
        } else if (mapUnit == "FOOT") {
            meterPerMapUnit = 0.3048;
        }
        return meterPerMapUnit;
    }

    //由于mvt的style渲染必须要传一个完整的分辨率数组，这里计算出一个从0开始的分辨率数组
    function getStyleResolutions(bounds){
        var styleResolutions = [];
        var temp = Math.abs(bounds.left - bounds.right)/ 512;
        for(var i = 0;i < 22;i++){
            if(i == 0){
                styleResolutions[i] = temp;
                continue;
            }
            temp = temp / 2;
            styleResolutions[i] = temp;
        }
        return styleResolutions;
    }

    function getScales(bounds, coordUnit){
        var resolution0 = Math.abs(bounds.left - bounds.right)/ 512;
        var temp = resolutionToScale(resolution0, 96, coordUnit);
        var scales = [];
        for(var i = 0;i < 22;i++){
            if(i == 0){
                scales[i] = temp;
                continue;
            }
            temp = temp * 2;
            scales[i] = temp;
        }
        return scales;
    }

    _.prototype.addLayer = function(){
        map.addLayer(layer);
    }

    _.prototype.removeLayer = function(){
        map.removeLayer(layer);
    }

    return _;
})()