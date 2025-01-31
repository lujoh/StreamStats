var configuration = {};
configuration.version = "4.19.3";
configuration.environment = 'development';
configuration.showWarningModal = false;
configuration.warningModalMessage = "Due to heavy demand, StreamStats is currently experiencing system interruptions. If you receive errors, please try back again later.<br><br>Thank you for your patience."
configuration.showBPWarning = false;
configuration.warningBPMessage = ""
configuration.manageBPQueue = false;
if (window.location.host === 'test.streamstats.usgs.gov') {
    configuration.showBPButton = false;
} else {
    configuration.showBPButton = true;
}

configuration.baseurls =
{
    'NWISurl': 'https://waterservices.usgs.gov/nwis',
    'StreamStatsServices': 'https://dev.streamstats.usgs.gov',
    'StreamStatsMapServices': 'https://gis.streamstats.usgs.gov',
    'NSS': 'https://dev.streamstats.usgs.gov/nssservices',
    'WaterUseServices': 'https://test.streamstats.usgs.gov/wateruseservices',
    'StormRunoffServices': 'https://test.streamstats.usgs.gov/runoffmodelingservices',
    'ScienceBase': 'https://gis.usgs.gov/sciencebase2',
    'GageStatsServices': 'https://dev.streamstats.usgs.gov/gagestatsservices',
    'WeightingServices': 'https://streamstats.usgs.gov/channelweightingservices',
    'FlowAnywhereRegressionServices': 'https://streamstats.usgs.gov/regressionservices',
    'BatchProcessorServices': 'https://dev.streamstats.usgs.gov/batchprocessor', // Will need to change this if running locally and want to use production data
    'PourPointServices': 'https://dev.streamstats.usgs.gov/pourpoint'
};

//override streamstats arguments if on production, these get overriden again in MapController after load balancer assigns a server
if (window.location.host === 'streamstats.usgs.gov') {
    configuration.baseurls.StreamStatsServices = 'https://streamstats.usgs.gov',
        configuration.baseurls.StreamStatsMapServices = 'https://gis.streamstats.usgs.gov',
        configuration.baseurls.NSS = 'https://streamstats.usgs.gov/nssservices',
        configuration.baseurls.WaterUseServices = 'https://streamstats.usgs.gov/wateruseservices',
        configuration.baseurls.StormRunoffServices = 'https://streamstats.usgs.gov/runoffmodelingservices',
        configuration.baseurls.GageStatsServices = 'https://streamstats.usgs.gov/gagestatsservices',
        configuration.baseurls.FlowAnywhereRegressionServices = 'https://streamstats.usgs.gov/regressionservices',
        configuration.baseurls.BatchProcessorServices = 'https://streamstats.usgs.gov/batchprocessor',
        configuration.baseurls.PourPointServices = 'https://streamstats.usgs.gov/pourpoint',
        configuration.environment = 'production';
}

configuration.queryparams =
{
    'NWISsite': '/site/?format=rdb,1.0&bBox={0},{1},{2},{3}&seriesCatalogOutput=true&outputDataTypeCd=dv&parameterCd=00060&siteStatus=all&hasDataTypeCd=dv',
    'NWISsiteinfo': '/site?site=',
    'NWISperiodOfRecord': '/site?seriesCatalogOutput=true&outputDataTypeCd=dv&format=rdb&site=',
    'NWISdailyValues': '/dv/?format=rdb&parameterCd=00060&site={0}&startDT={1}&endDT={2}',
    'KrigService': '/krigservices/sites/{0}/krig?&x={1}&y={2}&crs={3}&count={4}',
    'RegressionScenarios': '/{0}/estimate?state={1}',
    'statisticsGroupLookup': '/statisticgroups?regions={0},NA&regressionregions={1}',
    'statisticsGroupParameterLookup': '/scenarios?regions={0},NA&statisticgroups={1}&regressionregions={2}',
    'estimateFlows': '/scenarios/estimate?regions={0},NA',
    'SSdelineation': '/streamstatsservices/watershed.{0}?rcode={1}&xlocation={2}&ylocation={3}&crs={4}&simplify=false&includeparameters=false&includeflowtypes=false&includefeatures=true',
    'SSstormwaterDelineation': '/stormwaterservices/watershed?rcode={0}&xlocation={1}&ylocation={2}&simplify=false&surfacecontributiononly={3}',
    'SSwatershedByWorkspace': '/streamstatsservices/watershed.{0}?rcode={1}&workspaceID={2}&crs={3}&simplify=false&includeparameters=false&includeflowtypes=false&includefeatures=true',
    'SSeditBasin': '/streamstatsservices/watershed/edit.{0}?rcode={1}&workspaceID={2}&crs={3}&simplify=true&includeparameters=false&includeflowtypes=false&includefeatures=true',
    'SSAvailableParams': '/streamstatsservices/parameters.json?rcode={0}',
    'SSComputeParams': '/streamstatsservices/parameters.json?rcode={0}&workspaceID={1}&includeparameters={2}',
    'SSavailableFeatures': '/streamstatsservices/features.json?workspaceID={0}',
    'SSfeatures': '/streamstatsservices/features.geojson?workspaceID={0}&crs={1}&includefeatures={2}&simplify=false',
    'SSStateLayers': '/arcgis/rest/services/StreamStats/stateServices_dev/MapServer',
    'SSNationalLayers': '/arcgis/rest/services/StreamStats/nationalLayers_test/MapServer',
    'SSBatchProcessorBatch': '/batch',
    'SSBatchProcessorBatchPause': '/pauseBatch?batchID={0}',
    'SSBatchProcessorBatchStatus': '/batch/?emailAddress={0}',
    'SSBatchProcessorBatchUnpause': '/unpauseBatch?batchID={0}',
    'SSBatchProcessorDeleteBatch': '/batch/{0}',
    'SSBatchProcessorGetBatch': '/batch/',
    'SSBatchProcessorReorderBatch': '/batch/order',
    'SSBatchProcessorStatusMessages': '/status/',
    'SSBatchProcessorStreamGrids': '/streamgrids/',
    'SSBatchProcessorSubmitBatch': '/batch',        
    'SSBatchProcessorRefreshBatch': '/batch/{0}/refresh?deleteCurrentData={1}',
    'SSBatchProcessorStartWorker': '/worker',
    'regionService': '/arcgis/rest/services/ss_studyAreas_prod/MapServer/identify',
    'NLCDQueryService': '/LandCover/USGS_EROS_LandCover_NLCD/MapServer/4',
    'regulationService': '/arcgis/rest/services/regulations/{0}/MapServer/exts/RegulationRESTSOE/Regulation',
    'RegressionRegionQueryService': '/regressionregions/bylocation',
    'SSNavigationServices': '/navigationservices/navigation',
    'Wateruse': '/summary?year={0}&endyear={1}&includePermits={2}&computeReturns={3}&computeDomestic={4}',
    'WateruseSourceCSV': '/summary/bysource?year={0}&endyear={1}&includePermits={2}&computeReturns={3}&computeDomestic={4}',
    'WateruseConfig': '/regions/{0}/config',
    'coordinatedReachQueryService': '/arcgis/rest/services/coordinatedreaches/{0}/MapServer/0/query?geometry={1},{2},{3},{4}&geometryType=esriGeometryEnvelope&inSR={5}&spatialRel=esriSpatialRelIntersects&outFields={6}&returnGeometry=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson',
    'StormRunoffTR55': '/TR55/GetResult?area={0}&precip={1}&crvnum={2}&pdur={3}',
    'StormRunoffRationalMethod': '/RationalMethod?area={0}&precipint={1}&rcoeff={2}&pdur={3}',
    'ProsperPredictions': '/rest/services/Catalog/5c5204e4e4b0708288fb42e2/MapServer',
    'ProsperSPPPredictions1': '/rest/services/Catalog/5c538c11e4b0708288fd078b/MapServer',
    'ProsperSPPPredictions2': '/rest/services/Catalog/5c538c71e4b0708288fd078e/MapServer',
    'ProsperIdentify': '/identify?layers=all:{0}&tolerance=5&returnGeometry=false&imageDisplay={1}&mapExtent={2}&geometry={3}&sr={4}&geometryType=esriGeometryPoint&f=json',
    'SSURGOexCOMS': '/rest/services/Catalog/5b96f40ce4b0702d0e8272bf/MapServer',
    'SSURGOexCO': '/0/query?geometry={0}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelContains&returnGeometry=false&returnIdsOnly=false&returnCountOnly=true&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson',
    'GageStatsServicesStations': '/stations/',
    'GageStatsServicesStationTypes': '/stationtypes/',
    'GageStatsServicesCharacteristics': '/characteristics/',
    'GageStatsServicesVariables': '/variables/',
    'GageStatsServicesUnits': '/units/',
    'GageStatsServicesCitations': '/citations/',
    'GageStatsServicesStatistics': '/statistics/',
    'GageStatsServicesAgencies': '/agencies/',
    'GageStatsServicesStatGroups': '/statisticgroups/',
    'GageStatsServicesNearest': '/stations/Nearest?lat={0}&lon={1}&radius={2}&geojson=false&includeStats=true',
    'GageStatsServicesNetwork': '/stations/Network?lat={0}&lon={1}&distance={2}&includeStats=true&geojson=false',
    'GageStatsServicesBounds': '/stations/Bounds?xmin={0}&xmax={1}&ymin={2}&ymax={3}&geojson=true',
    'FlowAnywhereEstimates': '/models/FLA/estimate?state={0}',
    'FlowAnywhereGages': '/arcgis/rest/services/IowaStreamEst/FlowAnywhere/MapServer/1/query?geometry={0},{1}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=regions_local.Region_Agg,reference_gages.site_id,reference_gages.site_name,reference_gages.da_gis_mi2,reference_gages.da_pub_mi2,reference_gages.lat_dd_nad,reference_gages.long_dd_na&returnGeometry=false&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson',
    'Regions': '/regions/',
    'PourPointServicesExcludePolygon': '/ssExcludePolygon/'
};

configuration.basemaps =
{
    natgeo: {
        name: "National Geographic",
        type: "agsBase",
        layer: "NationalGeographic",
        visible: true
    },
    AtnmBaseMap: {
        "name": "National Map",
        "visible": false,
        "type": 'group',
        "layerOptions": {
            "layers": [
                {
                    "name": "tiles",
                    "url": "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer",
                    "type": 'agsTiled',
                    "layerOptions": {
                        "opacity": 0.8,
                        "minZoom": 0,
                        "maxZoom": 16,
                        "attribution": "<a href='https://www.doi.gov'>U.S. Department of the Interior</a> | <a href='https://www.usgs.gov'>U.S. Geological Survey</a> | <a href='https://www.usgs.gov/laws/policies_notices.html'>Policies</a>"
                    }
                },
                {
                    "name": "dynamic",
                    "url": "https://services.nationalmap.gov/arcgis/rest/services/USGSImageryTopoLarge/MapServer",
                    "type": 'agsDynamic',
                    "layerOptions": {
                        "format": "png8",
                        "f": "image",
                        "position": "back",
                        "opacity": 0.7,
                        "zIndex": -100,
                        "minZoom": 17,
                        "maxZoom": 20,
                        "attribution": "<a href='https://www.doi.gov'>U.S. Department of the Interior</a> | <a href='https://www.usgs.gov'>U.S. Geological Survey</a> | <a href='https://www.usgs.gov/laws/policies_notices.html'>Policies</a>"
                    }
                }
            ]
        }
    },
    streets: {
        name: "Streets",
        type: "agsBase",
        layer: "Streets",
        visible: true
    },
    topo: {
        name: "World Topographic",
        type: "agsBase",
        layer: "Topographic",
        visible: false
    },
    gray: {
        name: "Gray",
        type: "group",
        visible: false,
        layerOptions: {
            layers: [
                {
                    name: "gray",
                    type: "agsBase",
                    layer: "Gray"
                },
                {
                    name: "graylabel",
                    type: "agsBase",
                    layer: "GrayLabels"
                }
            ]
        }
    },
    graydark: {
        name: "Dark Gray",
        type: "group",
        visible: false,
        layerOptions: {
            layers: [
                {
                    name: "darkgray",
                    type: "agsBase",
                    layer: "DarkGray"
                },
                {
                    name: "darkgraylabel",
                    type: "agsBase",
                    layer: "DarkGrayLabels"
                }
            ]
        }
    },
    imagery: {
        name: "Imagery",
        type: "group",
        visible: false,
        layerOptions: {
            layers: [
                {
                    name: "Imagery",
                    type: "agsBase",
                    layer: "Imagery"
                },
                {
                    name: "Imagerylabel",
                    type: "agsBase",
                    layer: "ImageryLabels"
                }
            ]
        }
    },
    shadeRelief: {
        name: "Shaded Relief",
        type: "group",
        visible: false,
        layerOptions: {
            layers: [
                {
                    name: "ShadedRelief",
                    type: "agsBase",
                    layer: "ShadedRelief"
                },
                {
                    name: "ShadedRelieflabel",
                    type: "agsBase",
                    layer: "ShadedReliefLabels"
                }
            ]
        }
    }
};// end baselayer

configuration.regions = [
    { "RegionID": "AK", "Name": "Alaska", "Bounds": [[51.583032, -178.217598], [71.406235, -129.992235]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/alaska-streamstats-cook-inlet-basin" },
    { "RegionID": "AL", "Name": "Alabama", "Bounds": [[30.233604, -88.472952], [35.016033, -84.894016]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/alabama-streamstats" },
    { "RegionID": "AR", "Name": "Arkansas", "Bounds": [[33.010151, -94.617257], [36.492811, -89.645479]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/arkansas-streamstats" },
    { "RegionID": "AS", "Name": "American Samoa", "Bounds": [[-14.375555, -170.82611], [-14.166389, -169.438323]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "AZ", "Name": "Arizona", "Bounds": [[31.335634, -114.821761], [37.003926, -109.045615]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/arizona-streamstats" },
    { "RegionID": "CA", "Name": "California", "Bounds": [[32.535781, -124.392638], [42.002191, -114.12523]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/california-streamstats" },
    {
        "RegionID": "CO", "Name": "Colorado", "Bounds": [[36.988994, -109.055861], [41.003375, -102.037207]], "Layers": {
            "CO_Regulation": {
                "name": "Regulation Points",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/regulations/co/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [0],
                    "f": "image"
                },
                "queryProperties": { "Regulation Points": { "Source_Fea": "Description", "Source_Dat": "Source" } }
            }
        }, "Applications": ["Regulation", "StormRunoff"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/colorado-streamstats"
    },
    { "RegionID": "CT", "Name": "Connecticut", "Bounds": [[40.998392, -73.725237], [42.047428, -71.788249]], "Layers": {}, "Applications": ["Wateruse"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/connecticut-streamstats" },
    { "RegionID": "DE", "Name": "Delaware", "Bounds": [[38.449602, -75.791094], [39.840119, -75.045623]], "Layers": {}, "Applications": ["Localres"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/delaware-streamstats" },
    {"RegionID": "DC", "Name": "Washington, D.C. Stormwater", "Bounds": [[37.970255, -79.489865], [39.725461, -75.045623]], "Layers":
        {
            "StormDrainPipes": {
                "name": "Stormdrain",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/stormdrain/dc/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [0, 1, 2],
                    "f": "image"
                },
                "queryProperties": { "Pipe": { "USGS_Type": "USGS Type", "USGS_SourceID_1": "USGS Source ID", "USGS_Town": "USGS Town" } }
            }
        },
        "Applications": ["StormDrain"], "regionEnabled": true, "ScenariosAvailable": false, "URL": "https://www.usgs.gov/streamstats/washington-dc-streamstats"
    },
    { "RegionID": "FL", "Name": "Florida", "Bounds": [[24.956376, -87.625711], [31.003157, -80.050911]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "GA", "Name": "Georgia", "Bounds": [[30.361291, -85.60896], [35.000366, -80.894753]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/georgia-streamstats" },
    { "RegionID": "GU", "Name": "Guam", "Bounds": [[13.234996, 144.634155], [13.65361, 144.953308]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": null },
    { "RegionID": "HI", "Name": "Hawaii", "Bounds": [[18.921786, -160.242406], [22.22912, -154.791096]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/hawaii-streamstats" },
    { "RegionID": "IA", "Name": "Iowa", "Bounds": [[40.371946, -96.640709], [43.501457, -90.142796]], "Layers": {}, "Applications": ["FDCTM", "FLA"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/iowa-streamstats" },
    { "RegionID": "ID", "Name": "Idaho", "Bounds": [[41.994599, -117.236921], [48.99995, -111.046771]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/idaho-streamstats" },
    { "RegionID": "IL", "Name": "Illinois", "Bounds": [[36.986822, -91.516284], [42.509363, -87.507909]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/illinois-streamstats" },
    {
        "RegionID": "IN", "Name": "Indiana", "Bounds": [[37.776224, -88.10149], [41.76554, -84.787446]], "Layers": {
            "IN_Reaches": {
                "name": "Coordinated Reaches",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/coordinatedreaches/in/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "f": "image",
                    "minZoom": 15,
                }
            }
        }, "Applications": ["CoordinatedReach"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/indiana-streamstats"
    },
    { "RegionID": "KS", "Name": "Kansas", "Bounds": [[36.988875, -102.051535], [40.002987, -94.601224]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/kansas-streamstats" },
    {
        "RegionID": "KY", "Name": "Kentucky", "Bounds": [[36.49657, -89.568231], [39.142063, -81.959575]], "Layers":
        {
            "UndergroundConduit": {
                "name": "Underground Conduit",
                "url": "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [6],
                    "layerDefs": { "6": "FCODE>=42000 and FCODE<=42002" },
                    "f": "image"
                },
                "layerArray": [{
                    note: "This overrides the ESRI legend",
                    "layerName": "Flowline - Large Scale",
                    "layerId": 6,
                    "legend": [{
                        "contentType": "image/png",
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADFJREFUOI1jYaAyYBk1cNTAwWKgZyHDf2oYtr2fgZE2Ltzez8BIVQOpCUYNHDWQDAAArzAEmJdX26AAAAAASUVORK5CYII =",
                        "label": "Underground Conduit"
                    }]
                }]
            }
        }, "Applications": ["KarstCheck"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/kentucky-streamstats"
    },
    { "RegionID": "LA", "Name": "Louisiana", "Bounds": [[28.939655, -94.041785], [33.023422, -89.021803]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": null },
    { "RegionID": "MA", "Name": "Massachusetts", "Bounds": [[41.238279, -73.49884], [42.886877, -69.91778]], "Layers": {}, "Applications": ["Wateruse"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/massachusetts-streamstats" },
    { "RegionID": "MD", "Name": "Maryland and District of Columbia", "Bounds": [[37.970255, -79.489865], [39.725461, -75.045623]], "Layers": {}, "Applications": ["Wateruse"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/maryland-and-district-columbia-streamstats" },
    {
        "RegionID": "ME", "Name": "Maine", "Bounds": [[43.09105, -71.087509], [47.453334, -66.969271]], "Layers":
        {
            "MeanAugustBaseflow": {
                "name": "Mean August Baseflow",
                "url": "https://gis.usgs.gov/sciencebase3/rest/services/Catalog/620408c1d34e622189de5ad6/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png",
                    "layers": [0, 1, 2, 3, 4],
                    "f": "image",
                    "minZoom": 9
                },
                "layerArray": [
                    {
                        "layerName": "Mean August Baseflow",
                        "layerId": 1,
                        "legend": [{
                            "contentType": "image/svg+xml;base64",
                            "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaWQ9ImJvZHlfMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjUiPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4xOTY4NTAzOSAwIDAgMC4yMDAwMDAwMiAwIDApIj4KICAgIDxwYXRoIGQ9Ik0wIDBMMCAyNUwxMjcgMjVMMTI3IDBMMCAweiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC42MDMzOSA0LjAyNzc4QyAxLjQxNTI1IDYuNTUyODMgMS45Mzg3IDE3LjQzMjQgNi4xNDgxNSAxOC42ODIxQyAxMy44ODYxIDIwLjk3OTQgMjQuOTM0NyAxOSAzMyAxOUwzMyAxOUw5MyAxOUMgOTguMzgwNCAxOSAxMTYuNDQ4IDIxLjg0NTkgMTE5Ljk3MiAxNy4zOTY2QyAxMjIuMzM4IDE0LjQwOTYgMTIyLjAwOSA0LjU1MTk4IDExNy44NTIgMy4zMTc5QyAxMTAuMTE0IDEuMDIwNiA5OS4wNjUzIDMgOTEgM0w5MSAzTDMyIDNDIDI1Ljc3NzUgMyA5LjU3MDQyIDAuMDkzODI0NCA0LjYwMzM5IDQuMDI3Nzh6IiBzdHJva2U9Im5vbmUiIGZpbGw9IiNGRDRERjciIGZpbGwtcnVsZT0ibm9uemVybyIgLz4KPC9nPgo8L3N2Zz4=",
                            "label": ""
                        },
                        {
                            "contentType": "image/svg+xml;base64",
                            "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaWQ9ImJvZHlfMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjUiPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4xOTY4NTAzOSAwIDAgMC4yMDAwMDAwMiAwIDApIj4KICAgIDxwYXRoIGQ9Ik0wIDBMMCAyNUwxMjcgMjVMMTI3IDBMMCAweiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC4zMTc5IDMuMDI3NzhDIC0wLjAwNjUzMzE1IDUuOTEzNDUgMC43Nzk2OSAxOC4yMzI0IDYuMDU4NjQgMTkuNjgyMUMgMTQuMjc0NSAyMS45MzgzIDI1LjQ4NjYgMjAgMzQgMjBMMzQgMjBMOTMgMjBDIDk5LjA5NjUgMjAgMTE1Ljg4MyAyMi45MTAzIDEyMC4zOTcgMTguMzk2NkMgMTIzLjgxOSAxNC45NzQ2IDEyMy4wNTQgMy43MjE4NiAxMTcuOTQxIDIuMzE3OUMgMTEwLjAxIDAuMTM5OTE0IDk5LjIxNjUgMiA5MSAyTDkxIDJMMzMgMkMgMjUuOTUxOSAyIDEwLjI3MTUgLTAuOTQ1MDA3IDQuMzE3OSAzLjAyNzc4eiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRERBN0ZCIiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC42MDMzOSA0LjAyNzc4QyAxLjQxNTI1IDYuNTUyODMgMS45Mzg3IDE3LjQzMjQgNi4xNDgxNSAxOC42ODIxQyAxMy44ODYxIDIwLjk3OTQgMjQuOTM0NyAxOSAzMyAxOUwzMyAxOUw5MyAxOUMgOTguMzgwNCAxOSAxMTYuNDQ4IDIxLjg0NTkgMTE5Ljk3MiAxNy4zOTY2QyAxMjIuMzM4IDE0LjQwOTYgMTIyLjAwOSA0LjU1MTk4IDExNy44NTIgMy4zMTc5QyAxMTAuMTE0IDEuMDIwNiA5OS4wNjUzIDMgOTEgM0w5MSAzTDMyIDNDIDI1Ljc3NzUgMyA5LjU3MDQyIDAuMDkzODI0NCA0LjYwMzM5IDQuMDI3Nzh6IiBzdHJva2U9Im5vbmUiIGZpbGw9IiNCMTM1RjciIGZpbGwtcnVsZT0ibm9uemVybyIgLz4KPC9nPgo8L3N2Zz4=",
                            "label": ""
                        },
                        {
                            "contentType": "image/svg+xml;base64",
                            "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaWQ9ImJvZHlfMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjUiPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4xOTY4NTAzOSAwIDAgMC4yMDAwMDAwMiAwIDApIj4KICAgIDxwYXRoIGQ9Ik0wIDBMMCAyNUwxMjcgMjVMMTI3IDBMMCAweiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC4zMTc5IDMuMDI3NzhDIC0wLjAwNjUzMzE1IDUuOTEzNDUgMC43Nzk2OSAxOC4yMzI0IDYuMDU4NjQgMTkuNjgyMUMgMTQuMjc0NSAyMS45MzgzIDI1LjQ4NjYgMjAgMzQgMjBMMzQgMjBMOTMgMjBDIDk5LjA5NjUgMjAgMTE1Ljg4MyAyMi45MTAzIDEyMC4zOTcgMTguMzk2NkMgMTIzLjgxOSAxNC45NzQ2IDEyMy4wNTQgMy43MjE4NiAxMTcuOTQxIDIuMzE3OUMgMTEwLjAxIDAuMTM5OTE0IDk5LjIxNjUgMiA5MSAyTDkxIDJMMzMgMkMgMjUuOTUxOSAyIDEwLjI3MTUgLTAuOTQ1MDA3IDQuMzE3OSAzLjAyNzc4eiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjOTE4REY5IiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC42MDMzOSA0LjAyNzc4QyAxLjQxNTI1IDYuNTUyODMgMS45Mzg3IDE3LjQzMjQgNi4xNDgxNSAxOC42ODIxQyAxMy44ODYxIDIwLjk3OTQgMjQuOTM0NyAxOSAzMyAxOUwzMyAxOUw5MyAxOUMgOTguMzgwNCAxOSAxMTYuNDQ4IDIxLjg0NTkgMTE5Ljk3MiAxNy4zOTY2QyAxMjIuMzM4IDE0LjQwOTYgMTIyLjAwOSA0LjU1MTk4IDExNy44NTIgMy4zMTc5QyAxMTAuMTE0IDEuMDIwNiA5OS4wNjUzIDMgOTEgM0w5MSAzTDMyIDNDIDI1Ljc3NzUgMyA5LjU3MDQyIDAuMDkzODI0NCA0LjYwMzM5IDQuMDI3Nzh6IiBzdHJva2U9Im5vbmUiIGZpbGw9IiM4Nzg5RjkiIGZpbGwtcnVsZT0ibm9uemVybyIgLz4KPC9nPgo8L3N2Zz4=",
                            "label": ""
                        },
                        {
                            "contentType": "image/svg+xml;base64",
                            "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaWQ9ImJvZHlfMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjUiPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4xOTY4NTAzOSAwIDAgMC4yMDAwMDAwMiAwIDApIj4KICAgIDxwYXRoIGQ9Ik0wIDBMMCAyNUwxMjcgMjVMMTI3IDBMMCAweiIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIC8+CiAgICA8cGF0aCBkPSJNNC4xNDgxNSAyLjAyNzc4QyAtMS4zNzYwOSA1LjI5ODY2IC0wLjQzODMzNSAxOC45ODk5IDYuMDE5MjkgMjAuNjgyMUMgMTQuMzQyMSAyMi44NjMxIDI1LjQwMzUgMjEgMzQgMjFMMzQgMjFMOTIgMjFDIDk4Ljg2NjMgMjEgMTE1LjIzNCAyMy45ODY5IDEyMC42ODIgMTkuMzk2NkMgMTI1LjI1NCAxNS41NDQ5IDEyNC4xNTkgMi45MzY5OSAxMTcuOTgxIDEuMzE3OUMgMTA5Ljk0NiAtMC43ODc0NDUgOTkuMjk2NyAxIDkxIDFMOTEgMUwzNCAxQyAyNi4yOTIxIDEgMTAuODY3OCAtMS45NTA4OCA0LjE0ODE1IDIuMDI3Nzh6IiBzdHJva2U9Im5vbmUiIGZpbGw9IiM5N0ZCRkQiIGZpbGwtcnVsZT0ibm9uemVybyIgLz4KICAgIDxwYXRoIGQ9Ik00LjMxNzkgMy4wMjc3OEMgLTAuMDA2NTMzMTUgNS45MTM0NSAwLjc3OTY5IDE4LjIzMjQgNi4wNTg2NCAxOS42ODIxQyAxNC4yNzQ1IDIxLjkzODMgMjUuNDg2NiAyMCAzNCAyMEwzNCAyMEw5MyAyMEMgOTkuMDk2NSAyMCAxMTUuODgzIDIyLjkxMDMgMTIwLjM5NyAxOC4zOTY2QyAxMjMuODE5IDE0Ljk3NDYgMTIzLjA1NCAzLjcyMTg2IDExNy45NDEgMi4zMTc5QyAxMTAuMDEgMC4xMzk5MTQgOTkuMjE2NSAyIDkxIDJMOTEgMkwzMyAyQyAyNS45NTE5IDIgMTAuMjcxNSAtMC45NDUwMDcgNC4zMTc5IDMuMDI3Nzh6IiBzdHJva2U9Im5vbmUiIGZpbGw9IiMzOUY3RjkiIGZpbGwtcnVsZT0ibm9uemVybyIgLz4KPC9nPgo8L3N2Zz4=",
                            "label": ""
                        }]
                    }
                ],
                "queryProperties": {
                    "Mean August Baseflow": {
                        "GNIS_Name": "GNIS Name",
                        "DASQMI": "Drainage Area (mi2)",
                        "SANDGRAVAF": "Aquifer Area (%)",
                        "JULYAVPRE": "Mean July Precip (in)",
                        "AUGAVGBF": "Mean August Baseflow (cfs/mi2)",
                        "OOB_DA": "Drainage Area out-of-bounds",
                        "OOB_JULYAV": "Mean July Precip out-of-bounds",
                        "OOB_WARNIN": "% Aquifer Area out-of-bounds",
                        "REGULATED": "Regulated stream/river"
                    }
                }
            }
        }, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/maine-streamstats"
    },
    { "RegionID": "MI", "Name": "Michigan", "Bounds": [[41.697494, -90.4082], [48.173795, -82.419836]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "MN", "Name": "Minnesota", "Bounds": [[43.498102, -97.229436], [49.37173, -89.530673]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/minnesota-streamstats" },
    { "RegionID": "MO", "Name": "Missouri", "Bounds": [[35.989656, -95.767479], [40.609784, -89.105034]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/missouri-streamstats" },
    {
        "RegionID": "MO_STL", "Name": "Missouri St. Louis", "Bounds": [[38.399258, -90.673599], [38.837568, -89.693069]], "Layers":
        {
            "StormDrainPipes": {
                "name": "Pipes",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/stormdrain/mo_stl/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [1],
                    "f": "image"
                },
                "queryProperties": { "Pipe": { "PIPEMATERI": "Pipe Material", "WIDTH": "Width", "LENGTH": "Length" } }

            }
        },
        "Applications": ["StormDrain"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/missouri-st-louis-streamstats"
    },
    { "RegionID": "MP", "Name": "Northern Mariana Islands", "Bounds": [[14.105276, 144.89859], [20.556385, 145.870788]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": null },
    {
        "RegionID": "MRB", "Name": "Mystic River Basin", "Bounds": [[42.334, -71.3469], [42.5685, -70.8422]], "Layers":
        {
            "StormDrainPipes": {
                "name": "Stormdrain",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/stormdrain/mrb/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [0, 1, 2],
                    "f": "image"
                },
                "queryProperties": { "Pipe": { "USGS_Type": "USGS Type", "USGS_SourceID": "USGS Source ID", "USGS_Town": "USGS Town" } }

            }
        },
        "Applications": ["StormDrain"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/mystic-river-basin-streamstats"
    },
    { "RegionID": "MS", "Name": "Mississippi", "Bounds": [[30.194935, -91.643682], [35.005041, -88.090468]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/mississippi-streamstats" },
    {
        "RegionID": "MT", "Name": "Montana", "Bounds": [[44.353639, -116.063531], [49.000026, -104.043072]], "Layers":
        {
            "MT_Regulation": {
                "name": "Regulation Points",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/regulations/mt/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [0],
                    "f": "image"
                },
                "queryProperties": { "Regulation Points": { "Descript": "Description" } }
            }
        },
        "Applications": ["Regulation", "ChannelWidthWeighting"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/montana-streamstats-including-yellowstone-river-basin-wyoming"
    },
    { "RegionID": "NC", "Name": "North Carolina", "Bounds": [[33.882164, -84.323773], [36.589767, -75.45658]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/north-carolina-streamstats" },
    { "RegionID": "ND", "Name": "North Dakota", "Bounds": [[45.930822, -104.062991], [49.000026, -96.551931]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/north-dakota-streamstats" },
    { "RegionID": "NE", "Name": "Nebraska", "Bounds": [[39.992595, -104.056219], [43.003062, -95.308697]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "NH", "Name": "New Hampshire", "Bounds": [[42.698603, -72.553428], [45.301469, -70.734139]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/new-hampshire-streamstats" },
    { "RegionID": "NJ", "Name": "New Jersey", "Bounds": [[38.956682, -75.570234], [41.350573, -73.896148]], "Layers": {}, "Applications": ["Localres"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/new-jersey-streamstats" },
    { "RegionID": "NM", "Name": "New Mexico", "Bounds": [[31.343453, -109.051346], [36.99976, -102.997401]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/new-mexico-streamstats" },
    { "RegionID": "NV", "Name": "Nevada", "Bounds": [[34.998914, -119.996324], [41.996637, -114.037392]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "NY", "Name": "New York", "Bounds": [[40.506003, -79.763235], [45.006138, -71.869986]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/new-york-streamstats" },
    { "RegionID": "OH", "Name": "Ohio", "Bounds": [[38.400511, -84.81207], [41.986872, -80.519996]], "Layers": {}, "Applications": ["Wateruse"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/ohio-streamstats" },
    { "RegionID": "OK", "Name": "Oklahoma", "Bounds": [[33.621136, -102.997709], [37.001478, -94.428552]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/oklahoma-streamstats" },
    { "RegionID": "OR", "Name": "Oregon", "Bounds": [[41.987672, -124.559617], [46.236091, -116.470418]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/oregon-streamstats" },
    { "RegionID": "PA", "Name": "Pennsylvania", "Bounds": [[39.719313, -80.526045], [42.267327, -74.700062]], "Layers": {}, "Applications": ["Wateruse"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/pennsylvania-streamstats" },
    { "RegionID": "PR", "Name": "Puerto Rico", "Bounds": [[17.922222, -67.938339], [18.519443, -65.241958]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/puerto-rico-streamstats" },
    { "RegionID": "RI", "Name": "Rhode Island", "Bounds": [[41.322769, -71.866678], [42.013713, -71.117132]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/rhode-island-streamstats" },
    {
        "RegionID": "SC", "Name": "South Carolina", "Bounds": [[32.068173, -83.350685], [35.208356, -78.579453]], "Layers":
        {
            "SCDOT_Bridges": {
                "name": "Bridges",
                "url": "https://services1.arcgis.com/VaY7cY9pvUYUP1Lf/arcgis/rest/services/Statewide_Bridges/FeatureServer/0",
                "type": 'agsFeature',
                "visible": true,
                "layerOptions": {
                    pointToLayer: function (geojson, latlng) {
                        return L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAe9JREFUOI21lMFLG0EYxd837taDNXhoKZsixEslWMhhDfYivVRCIXvzpKInN9B/wuTPyOLFv0DQvfQgHqSK1j0ImiW5GCgkl56E0GKSeT00azdNm0Ro32n45pvfvGHmjYH/ JCMaaK0dAHkATaVU8TEQrbUjIi6AoogED2CSNoCDerWK1Pw8tNaBUupwHGi09jYMMZdO50kWRMQzAEBEApK4OT3F00QCzyzrgORitPsI6GG9WsWXWg1z6TQA / HLcUyG3sVH2d3exsr6OqUTiUmvtjTBsf202rcrZGd5vboJkSSnVDxYRjyRyW1vlj3t7eLe2hgnDcIdRv7VaONnfh7O9DVHKF5FiNBd3DBHxtNb229VVtzQzM8LsTxXv7mCYpi8iTrxu / N4oIt7U9PRQp3E9mZwEyYG7GAD / Kw2ASTrdbvdRkOgN / xVM0iW588n38aFSwYQx / EDfWy0Ex8d4k8tZWuuyUqowAO4lr / z56AiZ5WU8TyYDkv4op7dhaIVBgLRtuyQDEfH6wCKyU7u6wovZ2QhaGiN9RZKN6 / Nzq1GvI5lKlXvwIB5pu31 / j1eZDMaEAgA6nc7i66Wly + uLCyuZSgGADSB4iHS73X65kM3mSTbHhQKAaZoNks5CNusC8Po + oagBwKgI / 1E9WCFe+wGwdtl + 2b+bewAAAABJRU5ErkJggg == ",
                                iconSize: [27, 31],
                                iconAnchor: [13.5, 17.5],
                                popupAnchor: [0, -11]
                            })
                        });
                    },
                    "minZoom": 12,
                    onEachFeature: function (feature, layer) {
                        var popupContent = '<h5>SCDOT Bridges</h5> ';
                        var queryProperties = {
                            "STRUCTURE_": "Structure ID",
                            "ASSET_ID": "Asset ID",
                            "CROSSING": "Crossing",
                            "COUNTY_ID": "County Identifier",
                            "RTE_TYPE": "Route Type",
                            "RTE_NBR": "Route Number",
                            "RTE_DIR": "Route Direction",
                            "RTE_LRS": "Route LRS",
                            "LOCATION": "Location",
                            "STRUCTURE1": "Structure"
                        };
                        Object.keys(queryProperties).map(function (k) {
                            popupContent += '<strong>' + queryProperties[k] + ': </strong>' + feature.properties[k] + '</br>';
                        });
                        layer.bindPopup(popupContent);
                    }
                },
                "layerArray": [{
                    note: "This overrides the ESRI legend",
                    "layerName": "SCDOT Bridges",
                    "legend": [{
                        "contentType": "image/png",
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAUlJREFUOI3VlDFLAmEYx/+PnUoS4hKBINgSODm4tEhLIQ1tTgpuLn2K+h4ufgKXWwLBIVI8uEEoxVs6CHJpEt6uzuHfEHedXORlBvVOLw+8P37v8/zfV8OGl/ Z / gCQpIrIOJHhW8wr2dLoWlCTvJxP / rG941 + 9jJ53+FtQTebAs7BcK8A1FRBauS73Vwkm9DpKMAnyazTAeDHDaaPg13zCeSMizUrxqt3Fcq2FL + 3pejlK47nRw1mxCYjEs9dBb26kUjqpVXGYyUQRxMZ9Di8cRbNESUETk1XEiXRcAEslkqPa7wSZJR6mNAnGj6zgfj1cO5UUpmL0eDiuVcLA9O6PbRbFcxm42i1VZ9AI9MU0USqVlQ5K0RiPs5XKRYMD7AEnydjjEo22HX8rCdXFQLEaChaCGgWw+/2G47qcQhH4a7J9Avf3f/2DfAC / knupCOYW2AAAAAElFTkSuQmCC",
                        "label": ""
                    }]
                }],
                "queryProperties": { "SCDOT Bridges": { "COUNTY_ID": "County Identifier", "RTE_Type": "Route Type", "RTE_NBR": "Route Number", "RTE_DIR": "Route Direction", "RTE_LRS": "Route LRS", "Structure_": "Type", "Crossing": "Crossing", "Location": "Location", "Structure1": "Structure" } }
            },
            "SCDOT_Roads": {
                "name": "SCDOT Road Network",
                "url": "https://smpesri.scdot.org/arcgis/rest/services/SCDOT_Roads/MapServer/0",
                "type": 'agsFeature',
                "visible": true,
                "layerOptions": {
                    style: { color: '#bbbbbd', opacity: 0.75, weight: 6 },
                    "minZoom": 15
                },
                "layerArray": [{
                    note: "This overrides the ESRI legend",
                    "layerName": "SCDOT Road Network Routes",
                    "legend": [{
                        "contentType": "image/png",
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAC9JREFUOI1jYaAyYBk1cNTAYWtgenr6f2oYNnPmTEYWGIMaBjIwDJkwHDVwmBsIADDsBh2b0c5hAAAAAElFTkSuQmCC",
                        "label": ""
                    }]
                }],
                "queryProperties": {
                    "SCDOT Road Network Routes": {
                        "ROUTE_ID": "Route Identifier",
                        "ROUTE_TYPE": "Route Type",
                        "COUNTY_ID": "County Identifier",
                        "ROUTE_NUMB": "Route Number",
                        "STREET_NAM": "Street Name",
                        "ROUTE_LRS": "Route LRS",
                        "BEG_MILEPO": "Beginning Milepost",
                        "END_MILEPO": "Ending Milepost",
                        "EVAC_ROUTE": "Evacuation Route",
                        "TOLL_ROAD": "Toll Road",
                        "ONEWAY": "One-way"
                    }
                }
            },
            "Local_Roads": {
                "name": "Local Road Network",
                "url": "https://smpesri.scdot.org/arcgis/rest/services/EGIS_No_Imagery/MapServer/5",
                "type": 'agsFeature',
                "visible": true,
                "layerOptions": {
                    style: { color: '#cbc4c0', opacity: 0.75, weight: 3 },
                    "minZoom": 15
                },
                "layerArray": [{
                    note: "This overrides the ESRI legend",
                    "layerName": "Local Road Network Routes",
                    "legend": [{
                        "contentType": "image/png",
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAC9JREFUOI1jYaAyYBk1cNTAYWtgenr6f2oYNnPmTEYWGIMaBjIwDJkwHDVwmBsIADDsBh2b0c5hAAAAAElFTkSuQmCC",
                        "label": ""
                    }]
                }],
                "queryProperties": {
                    "Local Road Network Routes": {
                        "RoadName": "Street Name",
                        "RouteLRS": "Route LRS",
                        "TotalNumbe": "Total Number of Lanes",
                        "BeginMileP": "Beginning Milepost",
                        "EndMilePoi": "Ending Milepost",
                        "FactoredAA": "Factored AADT",
                        "FactoredA1": " Factored AADT Year",
                        "Functiona1": "Functional Class Name"
                    }
                }
            },
            "SC_Regulation": {
                "name": "Regulation Points",
                "url": configuration.baseurls['StreamStatsMapServices'] + "/arcgis/rest/services/regulations/sc/MapServer",
                "type": 'agsDynamic',
                "visible": true,
                "layerOptions": {
                    "zIndex": 1,
                    "format": "png8",
                    "layers": [0],
                    "f": "image"
                },
                "queryProperties": { "Regulation Points": { "NAME": "NID ID Number" } }
            }
        },
        "Applications": ["Regulation"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/south-carolina-streamstats"
    },
    { "RegionID": "SD", "Name": "South Dakota", "Bounds": [[42.488459, -104.061036], [45.943547, -96.439394]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/south-dakota-streamstats" },
    { "RegionID": "TN", "Name": "Tennessee", "Bounds": [[34.988759, -90.305448], [36.679683, -81.652272]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/tennessee-streamstats-0" },
    { "RegionID": "TX", "Name": "Texas", "Bounds": [[25.845557, -106.650062], [36.493912, -93.507389]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "UT", "Name": "Utah", "Bounds": [[36.991746, -114.047273], [42.0023, -109.043206]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/utah-streamstats" },
    { "RegionID": "VA", "Name": "Virginia", "Bounds": [[36.541623, -83.675177], [39.456998, -75.242219]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": null },
    { "RegionID": "VT", "Name": "Vermont", "Bounds": [[42.725852, -73.436], [45.013351, -71.505372]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/vermont-streamstats" },
    { "RegionID": "VI", "Name": "Virgin Islands", "Bounds": [[17.676666, -65.026947], [18.377777, -64.560287]], "Layers": {}, "Applications": [], "regionEnabled": false, "ScenariosAvailable": false, "URL": null },
    { "RegionID": "WA", "Name": "Washington", "Bounds": [[45.543092, -124.732769], [48.999931, -116.919132]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/washington-streamstats" },
    { "RegionID": "WI", "Name": "Wisconsin", "Bounds": [[42.489152, -92.885397], [46.952479, -86.967712]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/wisconsin-streamstats" },
    { "RegionID": "WV", "Name": "West Virginia", "Bounds": [[37.20491, -82.647158], [40.637203, -77.727467]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/west-virginia-streamstats" },
    { "RegionID": "WY", "Name": "Wyoming", "Bounds": [[40.994289, -111.053428], [45.002793, -104.051705]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/wyoming-streamstats" },
    { "RegionID": "CRB", "Name": "Connecticut River Basin", "Bounds": [[41.227366, -73.254776], [45.305324, -71.059248]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": false, "URL": "https://www.usgs.gov/streamstats/connecticut-river-basin-streamstats" },
    { "RegionID": "DRB", "Name": "Delaware River Basin", "Bounds": [[38.666626, -76.452907], [42.507076, -74.319593]], "Layers": {}, "Applications": ["Wateruse", "Localres"], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/delaware-river-basin-streamstats" },
    { "RegionID": "RRB", "Name": "Rainy River Basin", "Bounds": [[47.268377, -95.64855], [50.054196, -89.766532]], "Layers": {}, "Applications": [], "regionEnabled": true, "ScenariosAvailable": true, "URL": "https://www.usgs.gov/streamstats/rainy-river-basin-streamstats" }

];//end regions

configuration.overlayedLayers = {
    "SSLayer": {
        "name": "National Layers",
        "url": "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer",
        "type": 'agsDynamic',
        "visible": true,
        "layerOptions": {
            "dynamicLayers": JSON.stringify([
                {
                    "id": 1,
                    "source": { "type": "mapLayer", "mapLayerId": 1 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 3.0, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 2,
                    "source": { "type": "mapLayer", "mapLayerId": 2 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 3,
                    "source": { "type": "mapLayer", "mapLayerId": 3 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 4,
                    "source": { "type": "mapLayer", "mapLayerId": 4 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 5,
                    "source": { "type": "mapLayer", "mapLayerId": 5 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 6,
                    "source": { "type": "mapLayer", "mapLayerId": 6 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 7,
                    "source": { "type": "mapLayer", "mapLayerId": 7 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
                {
                    "id": 8,
                    "source": { "type": "mapLayer", "mapLayerId": 8 },
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "label": "",
                            "description": "",
                            "symbol": {
                                "color": [0, 0, 0, 0],
                                "outline": {
                                    "color": [135, 135, 135, 255], "width": 1.5, "type": "esriSLS", "style": "esriSLSSolid"
                                },
                                "type": "esriSFS",
                                "style": "esriSFSSolid"
                            }
                        },
                        "showLabels": false,
                        "transparency": 0
                    },
                },
            ]),
            "opacity": 1,
            "format": "png32",
            "zIndex": 1,
            "f": "image",
            "layers": [1, 2, 3, 4, 5, 6, 7, 8],
        },
        "layerArray": [
            {
                "layerName": "Region",
                "layerId": 1,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ViZWJlYjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDEgMUwwIDB6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNkN2Q3ZDc7IHN0cm9rZTpub25lOyIgZD0iTTEgMEwxIDFMMzAgMUwxIDB6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNlYmViZWI7IHN0cm9rZTpub25lOyIgZD0iTTMwIDBMMzEgMUwzMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYzNjM2MzOyBzdHJva2U6bm9uZTsiIGQ9Ik0wIDFDMS4zNDkyMyA5LjA4NDc4IDI5LjY1MDggOS4wODQ3NyAzMSAxTDMwIDFMMzAgNUwxIDVMMCAxeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojODc4Nzg3OyBzdHJva2U6bm9uZTsiIGQ9Ik0xIDFMMSA1TDMwIDVMMzAgMUwxIDF6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNlMWUxZTE7IHN0cm9rZTpub25lOyIgZD0iTTAgNUwxIDZMMCA1TTMwIDVMMzEgNkwzMCA1eiIvPgo8L3N2Zz4K",
                    "label": "2-digit HU"
                }]
            },
            {
                "layerName": "Subregion",
                "layerId": 2,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "4-digit HU"
                }]
            },
            {
                "layerName": "Basin",
                "layerId": 3,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "6-digit HU"
                }]
            },
            {
                "layerName": "Subbasin",
                "layerId": 4,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "8-digit HU"
                }]
            },
            {
                "layerName": "Watershed",
                "layerId": 5,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "10-digit HU"
                }]
            },
            {
                "layerName": "Subwatershed",
                "layerId": 6,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "12-digit HU"
                }]
            },
            {
                "layerName": "",
                "layerId": 7,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "14-digit HU"
                }]
            },
            {
                "layerName": "",
                "layerId": 8,
                "legend": [{
                    "contentType": "image/svg+xml;base64",
                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMSIgaGVpZ2h0PSI2Ij4KPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjsgc3Ryb2tlOm5vbmU7IiBkPSJNMCAwTDAgNkwzMSA2TDMxIDBMMCAweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojYTVhNWE1OyBzdHJva2U6bm9uZTsiIGQ9Ik0xLjMzMzMzIDIuNjY2NjdMMS42NjY2NyAzLjMzMzMzTDEuMzMzMzMgMi42NjY2N3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg3ODc4Nzsgc3Ryb2tlOm5vbmU7IiBkPSJNMiAyTDIgNEwyOSA0TDI5IDJMMiAyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojZTFlMWUxOyBzdHJva2U6bm9uZTsiIGQ9Ik0yOS4zMzMzIDIuNjY2NjdMMjkuNjY2NyAzLjMzMzMzTDI5LjMzMzMgMi42NjY2N3oiLz4KPC9zdmc+Cg==",
                    "label": "16-digit HU"
                }]
            }
        ],
        "queryProperties": { "Streamgages": { "STA_ID": "Station ID", "STA_NAME": "Station Name", "Latitude": "Latitude", "Longitude": "Longitude", "FeatureURL": "URL" } }
    },//end ssLayer
    "MaskLayer": {
        "name": "Area of Interest",
        "url": "https://streamstats.usgs.gov/maptiles/MaskLayer/{z}/{y}/{x}.png",
        "type": 'xyz',
        "visible": true,
        "layerOptions": {
            "opacity": 0.6,
            "maxZoom": 10,
            "zIndex": 9999
        },
        "layerParams": {
            "showOnSelector": false,
        }
    },//end maskLayer    
    "draw": {
        "name": 'draw',
        "type": 'group',
        "visible": true,
        "layerParams": {
            "showOnSelector": false,
        }
    }
};//end overlayedLayers

configuration.stateGeoJSONurl = './data/jsonstates.json';

configuration.streamgageSymbology = [{
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAaJJREFUOI3dzz1IW1EYxvF/TMqpFQsJCF4QOuhUpTpEVCw6RSsdQhFB6hfiF0IDFqkoOCqKEhxEqm0H20YUgpQoqOBWOkgjpQgXowREEC5SuVBE6QtFHXQwYjSJmXzgDO85hx/PayPJsd0TcD6sqM6ZBFqAk7uD4dCyqu3dkLnhRmD6bqB/ q5DwZrl4hv6rb2MWEfEDR4mD + q9ZSl + mAC75 + HOGxvwuYDAx8MNaK / +Os3mUfj5nP + tSSlsUMbKAvfhA / dSKb3qEqvrLtwUS0CeVW + sWkbfxgcsr4zx12rFe + ZJu75PMPK / jcKfQNM1gbKBPz2Az2EzJi + ten / B1LdUse9AGxAhu//ZTXPkwanurrRd3RyeBqRrAfzM48b2IvwfPcWRG9QC76nnvlMDUY2ABkOjgbshHxWvrTRqAYPGo/s9uGWh6A3ivBR3epTZTpeWQmnabB6CkqqFOjbbvi0gG8CcSXF1NMZdCw7zqjAW7iKWOT+sVqtX5TkR6IkGXqx4IMub5EYeIQAlQrmlarmEY+uWVv1ycRDJgGAaRDZOUpINnJ5KDtx5X6hkAAAAASUVORK5CYII=",
    "label": "Gaging Station, Continuous Record"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZxJREFUOI1jYaAyYBk2BjIZGAgtunDhXRwDA8M/ig10cBDKrqiwt5848WDq9u3vZlJqoIC/v3a0u7uyzLVrbxK2bz+ 8hIGB4SvZBoaGyjcnJenpMTAwMCQm6ukdPHineuPG51XkGqgVEqJjzcfHycnAwMAgIMDJFRys57px4/NpDAwMT0g2MDZWvjUoSM0AWSwsTMNgx467zcuW3Ukk1UD/nBxrdRYWZkZkQXZ2VpaEBH39HTvemb579+ 40sQay5+cbFJiZSWlik3R2ljcMDBStnjv3XQBRBqqosBeVlJgp43I6ExMTQ36 + mercuTdDGRgYVhMyUDItzdhLRoZPFpeBDAwMDLq64lolJQYpPT0XNjEwMPzEaaCDg3xzZqaRHj7DYKCoyFJ19erreQ8f / uzGaqCQkJBZRoaOJg8PBx8xBkpKcitmZpq5VFQcXsDAwPAa3UBGW1v2upAQdTNiDIOB7Gx9 / dWrr1adPfuuEN3AWAMDKbODBx + SWgKJ6 + gIhT57xj7n + fPnV5E1L2psPLuIgeEsieahgsFfwAIAW21yjgzG0zwAAAAASUVORK5CYII=",
    "label": "Low Flow, Partial Record"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAV5JREFUOI3d1DFIlGEYwPGfcvBRhMi3xIENURJKndfQLSEJFUGLpp6LGBoViZEpDqIQxNFUS0sQJMQhLTfZoqtzBC25B9I3BO/W8C7RJB2HV3d6U// xeXl + PNOb0 + Fy / w3YXaT6hbv4dWxwhIVVrr3mwTZvjwv2jibJ9K0Y + /aY3WYTP48Mlqnci7EAcxR2Wd9i7ajg4CRXezgBvZycSJKbWzG+wX7b4AwvxinWz6ZiLO5Q+cBcu+DoYy7k6KofJuRmGdpJ0yshhE+tgskiT0sMHPZ4nct3QljfYKwl8DzLK5xrdno3FunfoIzav8D8Q273caYZCJcYXOH+Kz4iNgVHqMxT+Bt20DL9NZ584+WhYJqmpUchDJyipxUwz9l5bqzyHj8awa7hEJ5NUmoFO2iBoVqSrH2OcakRnClS2m3/Bzp9Mcby93z + XZZlX + uXq8 + pton9Kcs0XtiROg7 + BnYMUkljozdEAAAAAElFTkSuQmCC",
    "label": "Peak Flow, Partial Record"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAYlJREFUOI3d1E0og3EcwPHv1lMPEnouWmHJJOLZJCuWzFtjDsPMRYQQkbd20FZKy4mLi1KU5uWygyhxcODARWolcl3kOajn5vA4yInWMjZ28j3+/v0+/U5 / gRQn / BtQbzEQDCv0A29 / Bu1GJuZ7qV / dZeQ4wvpfwRyXXex1mLW8uwcGjrfZAV5 + DXqqCAw1aDLAYCPy + Q3 + gzC + 34Jl3TZsWemkA+RkkOGuFVsOwtoa8Jg02FfHUlcNluhZj02znIQJ7F0ymCzommylRNCjix6KAsKAHfPJvVStqupVoqA47WDGaqL0q8cmmcpOWfVvntGREGgSmfN2UBTvdL0Opp0Ub57hAUI / gYZRN848ifx4IECFkTJvO8MrRxwCWlzQbiIw7kD + DvtozkVx6JSpiMbyl6AkSdYxp1qamUZWIqAhm8JxN83ze2wBz7Ggrq5AXeiuwZoI9tFEG + bQhei7jmizsWCfpRDr + W3SP1BueYHmeXo1bCiKchu9HFzcJ8h + ktxnCrEXpqSUg + 93zWK9ULsBDQAAAABJRU5ErkJggg==",
    "label": "Peak and Low Flow, Partial Record"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAXZJREFUOI3d1E8ow2EYwPHvmF5j/vRLbT/ZlmxpykayjJjkT0iUXIgoTko4buWynNyVctDIxUEpNwcXLi4rrRxclHqVvBc5vA5yoVjGxk6+ x + ft + fScXit5zvpvwAJMEkhmgJc / g4aHxbJJIo / 7LKgbtv4KVoouMeUM6prnW2bZZQ94+j3YQtzRowMARoSAuiSmk0R / CzaYYTqEDRuA3U6Jq130XSf1JnCbMyg6WXeHafo4qwjrJiNJXJ0zlys46h2gnkIsnxaKsJZ1E + TKaFVKXWQLCjHAst2L / 6tHZyPNdwEV45Sx7EDBqn+Uuoy3W8A7iC91ygRw8BNoesYZEgaujCBg99BgDjMvjzkCdGbQS7yqn8B32HuOEXzyhCU0G1 + ChmGExJDyW4spzwYUldSa4 / TKfXaA + 3TQ8uRWa742Qtlg71X3E1RnIqpv9Eo6OF1aS+ghlfMP5NBuPWE + m9tSytTH5YQ6JKEOc + TekkjSL8xLeQdfAVOiXI3dacB + AAAAAElFTkSuQmCC",
    "label": "Stage Only"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAYVJREFUOI3d1E8og3Ecx/H3mB6Tfz0XTWwtln/t2YQnjz+ b / A2J0i5EFCclHCmX5eSulINGLg5KOXEQcdFqJeWAWqmnqN / N4ecgBxQyNhzkc / nW99v31ff0tfLLsf4bMEXFHhaYw8DDj0EV50Q3A4EDNsZjxJZ / CubWKP7BUuktuOF6JMbaOnD3bbCEqpAumzWAagLaJadzF0RnvwuWaxj16dhsABlkZniVurYLGV0CrpMGK2hc8GD4Xvc80vCdEw2dcTyaLNjbQEdJKqmW18000qzVNHlN9bxGCHGSKKhU0THloLjso6EbT6VLaHOC / b6EQAVlpoXeoninW7BQS6c7wn4Q2PwKtPvp78pBLYwHAuTjLK + je + yYnW1AxgWdFIcM2rXPsJcE6HFH2JuUyMUPQVVVdV10lSmkZycCZpLr8tPfusvGKnD7HrRkCce8h1o9EewlBu3eiHI0K2Rs + j045MClX3GW7AfKs0tHULHfr5im + WY5fMhW + JCtJL3nmE / l7z / YR0W7YFxuKhm3AAAAAElFTkSuQmCC",
    "label": "Low Flow, Partial Record, Stage"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAZtJREFUOI1jYaAyYBk2BjKpCBksuvPuQhwDA8M/ig00FnLIzrOvsJ9zcGLq4XfbZ1JqoICXtn+0vbK7zJ031xIOH96+hIGB4SvZBrrLhzaH6yXpMTAwMIToJeodvXOwet/zjVXkGqjlpxNizcPJx8nAwMDAzynA5aMX7Lrv+ cZpDAwMT0g20F8 + ttVdLcgAWcxHI8xg / 90dzZvvLEsk1UD/ROscdRZmFkZkQTZWdpZQ/QT9o+ 92mL579+40sQayJxjkFxhImWlik7SRdzZ0Ew2sXvFubgBRBkqyqxRlmJUo43I6ExMTQ4JZvuqKm3NDGRgYVhMyUDLBOM1Lgk9GFpeBDAwMDBriulopBiUpcy70bGJgYPiJ00BzeYfmGKNMPXyGwUCaZZHq4uur837+fNiN1UAhISGzWJ0MTW4OHj5iDBTjllQsMst0aT9csYCBgeE1uoGMBuy2dZ7qIWbEGAYDMfrZ + tuvrq668O5sIbqBsTpSBmYnHx4ktQQSVxbSCX3J / mzO8 + fPryJrXjTpbOOiSWdJNA4NDP4CFgA3c3Kc0o9KfgAAAABJRU5ErkJggg == ",
    "label": "Miscellaneous Record"
}, {
    "contentType": "image/png",
    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAARVJREFUOI3d1L8rhVEYB/APqROD9C66xSBJDH4MLAYLi4XFJKKYlDBSlpvJrpRBstn8G2b/gXoHdTbDs8jgKt38eF138q1T55yn59MznE6XNqfr34CduMYGXtoB7mIeO7j4K9iXUlqLiAFs4gbPfwHrETHR2E/ gGEetguOYQ3fj3JNSWoyIczy2Ap5i6uNFREyhjq3fgssYRccnPZNFUczknO + rggn7GPuiPp1zPsZKVfAQw1 / U3jOCVdz + BNawhMEfwHFs4w7xHVj39jyqZAR7OPsULIpiNuc8ht6K4BAWcIWnZrAj53yC2YrYeyZTSkcRcdAMrjew3 / 5A/RGxWqvVLsuyfPjYfN1YLaUsS80TtiVtB18BHWxAwwk6imsAAAAASUVORK5CYII=",
    "label": "Unknown"
}];
