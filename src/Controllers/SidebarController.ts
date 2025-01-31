﻿//------------------------------------------------------------------------------
//----- SidebarController ------------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2014 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping


//   purpose:  

//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.

//Comments
//04.14.2015 jkn - Created

//Imports"
module StreamStats.Controllers {

    declare var search_api;
    declare var shpwrite;
    declare var tokml;

    'use strinct';
    interface ISidebarControllerScope extends ng.IScope {
        vm: SidebarController;
    }
    interface ILeafletData {
        getMap(mapID: any): ng.IPromise<any>;
        getLayers(mapID: any): ng.IPromise<any>;
    }
    interface ISidebarController {
        sideBarCollapsed: boolean;
        selectedProcedure: ProcedureType;
        selectedStatisticsGroupList: Services.IStatisticsGroup;
        setProcedureType(pType: ProcedureType): void;
        toggleSideBar(): void;
    }

    interface IDateRange {
        dates: {
            startDate: Date;
            endDate: Date;
        }
        minDate?: Date;
        maxDate?: Date;
    }
    
    class SidebarController implements ISidebarController {
        public dateRange: IDateRange;
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-
        private _onSelectedStatisticsGroupChangedHandler: WiM.Event.EventHandler<WiM.Event.EventArgs>;
        private _onStudyAreaServiceBusyChangedHandler: WiM.Event.EventHandler<WiM.Event.EventArgs>;
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        public sideBarCollapsed: boolean;
        public selectedProcedure: ProcedureType;
        public toaster: any;
        public selectedStatisticsGroupList: Services.IStatisticsGroup;
        private regionService: Services.IRegionService;
        private nssService: Services.InssService;
        private studyAreaService: Services.IStudyAreaService;       
        private modalService: Services.IModalService;    
        private leafletData: ILeafletData;
        private multipleParameterSelectorAdd: boolean;
        private explorationService: Services.IExplorationService;
        private parametersLoaded: boolean;
        private SSServicesVersion = '1.2.22'; //TODO: get actual version when ready
        public get ParameterValuesMissing(): boolean {
            if (!this.studyAreaService.studyAreaParameterList || this.studyAreaService.studyAreaParameterList.length < 1) return true;
            for (var i = 0; i < this.studyAreaService.studyAreaParameterList.length; i++) {
                var p = this.studyAreaService.studyAreaParameterList[i];
                if (!p.value || p.value < 0) return true;
            }//next i
            return false;
        }
        private scenarioHasExtensions: Boolean;
        private extensionsConfigured: Boolean;
        public environment: string;

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', 'toaster', 'StreamStats.Services.RegionService', 'StreamStats.Services.StudyAreaService', 'StreamStats.Services.nssService', 'StreamStats.Services.ModalService', 'leafletData', 'StreamStats.Services.ExplorationService', 'WiM.Event.EventManager'];
        constructor($scope: ISidebarControllerScope, toaster, region: Services.IRegionService, studyArea: Services.IStudyAreaService, StatisticsGroup: Services.InssService, modal: Services.IModalService, leafletData: ILeafletData, exploration: Services.IExplorationService, private EventManager:WiM.Event.IEventManager) {
            this.dateRange = { dates: { startDate: new Date(), endDate: new Date() }, minDate: new Date(1900, 1, 1), maxDate: new Date() };

            $scope.vm = this;
            this.init();

            this.toaster = toaster;
            this.sideBarCollapsed = false;
            this.selectedProcedure = ProcedureType.INIT;
            this.regionService = region;
            this.nssService = StatisticsGroup;
            this.studyAreaService = studyArea;
            this.modalService = modal;
            this.leafletData = leafletData;
            this.multipleParameterSelectorAdd = true;
            this.explorationService = exploration;
            this.environment = configuration.environment;
            
            StatisticsGroup.onSelectedStatisticsGroupChanged.subscribe(this._onSelectedStatisticsGroupChangedHandler);
            
            //watch for map based region changes here
            $scope.$watch(() => this.regionService.selectedRegion,(newval, oldval) => {
                //console.log('region change', oldval, newval);
                if (newval == null) this.setProcedureType(1);
                else this.setProcedureType(2);
            });

            //watch for completion of regression region query
            $scope.$watch(() => this.studyAreaService.regressionRegionQueryComplete, (newval, oldval) => {
                if (newval == oldval) return;            
                if (newval == null) this.setProcedureType(2);
                else if (!this.regionService.selectedRegion.ScenariosAvailable) this.setProcedureType(2);
                else this.setProcedureType(3);
            });
            $scope.$watchCollection(() => this.studyAreaService.selectedStudyAreaExtensions, (newval, oldval) => {
                if (newval == oldval) return;
                this.scenarioHasExtensions = (this.studyAreaService.selectedStudyAreaExtensions.length >0 );
            });
            $scope.$watchCollection(() => this.studyAreaService.extensionsConfigured, (newval, oldval) => {
                if (newval == oldval) return;
                if (!newval) {this.extensionsConfigured = newval; return; }
                var hasAllParams = true;
                // double check extensions have all params
                this.studyAreaService.selectedStudyAreaExtensions.forEach(ext => {
                    ext.parameters.forEach(p => {
                        if (!p.hasOwnProperty('value') || p.value == undefined) hasAllParams = false;
                    })
                })
                if (hasAllParams) this.extensionsConfigured = true;
            });
            EventManager.SubscribeToEvent(Services.onSelectedStudyParametersLoaded, new WiM.Event.EventHandler<Services.StudyAreaEventArgs>((sender: any, e: Services.StudyAreaEventArgs) => {
                this.parametersLoaded = e.parameterLoaded;
                if (!this.parametersLoaded) this.setProcedureType(3);
                else this.setProcedureType(4);
            }));
        }

        public setProcedureType(pType: ProcedureType) {    
            //console.log('in setProcedureType', this.selectedProcedure, pType, this.canUpdateProcedure(pType));     

            if (this.selectedProcedure == pType || !this.canUpdateProcedure(pType)) {
                //capture issues and send notifications here
                //if (this.selectedProcedure == 3 && (pType == 4 )) this.toaster.pop("warning", "Warning", "Make sure you calculate selected basin characteristics before continuing", 5000);
                if (this.selectedProcedure == 2 && (pType == 3 || pType == 4 )) this.toaster.pop("warning", "Warning", "Make sure you have delineated a basin and clicked continue", 5000);
                return;
            }
            this.selectedProcedure = pType;
        }
        public toggleSideBar(): void {
            if (this.sideBarCollapsed) this.sideBarCollapsed = false;
            else this.sideBarCollapsed = true;          
        }
        public onAOISelect(item: WiM.Services.ISearchAPIOutput) {
            this.EventManager.RaiseEvent(WiM.Services.onSelectedAreaOfInterestChanged,this, new WiM.Services.SearchAPIEventArgs(item));          
        }
        public zoomRegion(inRegion: string) {
            var region = angular.fromJson(inRegion);
            //console.log('zooming to region: ', region);
            
        }
        public setRegion(region: Services.IRegion) {
            //ga event
            gtag('event', 'SetRegion', { 'Region': region.RegionID });

            //console.log('setting region: ', region);
            if (this.regionService.selectedRegion == undefined || this.regionService.selectedRegion.RegionID !== region.RegionID)
                this.regionService.selectedRegion = region;
            this.setProcedureType(2);

            //get available parameters
            this.regionService.loadParametersByRegion();
        }

        public openStatePage(e, region) {
            e.stopPropagation(); e.preventDefault();
            
            //console.log('Opening state page for: ', region);
            this.modalService.openModal(Services.SSModalType.e_about, { "tabName": "regionInfo", "regionID": region});
            
            //var regionParsed = region.replace(' ', '_').toLowerCase();
            //window.open('https://water.usgs.gov/osw/streamstats/' + regionParsed + '.html', '_blank');
        }

        public resetWorkSpace() {
            //this.regionService.clearRegion();
            this.regionService.clearSelectedParameters();
            this.studyAreaService.clearStudyArea();
            this.studyAreaService.zoomLevel15 = true;
            this.nssService.clearNSSdata();
            this.multipleParameterSelectorAdd = false;
        }

        public startSearch(e) {
            e.stopPropagation(); e.preventDefault();
            $("#searchBox").trigger($.Event("keyup", { "keyCode": 13 }));
        }

        public startDelineate() {
            //console.log('in startDelineate', this.studyAreaService.canUpdate, this.studyAreaService.doDelineateFlag);
            this.leafletData.getMap("mainMap").then((map: any) => {
                //console.log('mapzoom', map.getZoom());
                if (map.getZoom() < 15) {
                    this.toaster.pop('error', "Delineate", "You must be at or above zoom level 15 to delineate.");
                    return;
                }
                else {
                    this.toaster.pop('success', "Delineate", "Click on a blue stream cell to start delineation");
                    this.studyAreaService.doDelineateFlag = !this.studyAreaService.doDelineateFlag;
                }
            });
        }

        public setStatisticsGroup(statisticsGroup: Services.IStatisticsGroup) {

            var checkStatisticsGroup = this.checkArrayForObj(this.nssService.selectedStatisticsGroupList, statisticsGroup);

            // console.log('set stat group: ', statisticsGroup, checkStatisticsGroup);

            //if toggled remove selected parameter set
            if (checkStatisticsGroup != -1) {
                var preventRemoval = false;
                // need to remove QPPQ when deselected
                if (typeof statisticsGroup.id != 'number' && statisticsGroup.id.indexOf('fdctm')) {
                    var qppqExtension = this.studyAreaService.selectedStudyAreaExtensions.filter(e => e.code == 'QPPQ')[0];
                    var extensionIndex = this.studyAreaService.selectedStudyAreaExtensions.indexOf(qppqExtension);
                    // splice and send new event
                    this.studyAreaService.selectedStudyAreaExtensions.splice(extensionIndex, 1);
                    this.EventManager.RaiseEvent(Services.onScenarioExtensionChanged, this, new Services.NSSEventArgs(this.studyAreaService.selectedStudyAreaExtensions) );
                    // select the Flow-Duration Statistics group
                }

                // if Flow Duration Curve Transfer Method (FDCTM) is selected, prevent Flow-Duration Statistics from being de-selected
                if (this.nssService.selectedStatisticsGroupList.filter((selectedStatisticsGroup) => selectedStatisticsGroup.name == "Flow-Duration Curve Transfer Method").length > 0 && statisticsGroup.name == "Flow-Duration Statistics") {
                    preventRemoval = true;
                } 
                
                if (!preventRemoval) {
                    //remove this statisticsGroup from the list
                    this.nssService.selectedStatisticsGroupList.splice(checkStatisticsGroup, 1);

                    //if no selected scenarios, clear studyareaparameter list
                    if (this.nssService.selectedStatisticsGroupList.length == 0) {
                        this.studyAreaService.studyAreaParameterList = [];

                        this.regionService.parameterList.forEach((parameter) => {
                            parameter.checked = false;
                            parameter.toggleable = true;
                        });
                    }
                }
                
            }

            //add it to the list and get its required parameters
            else {
                this.nssService.selectedStatisticsGroupList.push(statisticsGroup);

                // if Flow Duration Curve Transfer Method (FDCTM) was selected, also select Flow-Duration Statistics
                if (typeof statisticsGroup.id != 'number' && statisticsGroup.id.indexOf('fdctm')) {
                    // see if the Flow-Duration Statistics group has been selected already and select it if not
                    var statisticsGroupFDS = this.nssService.statisticsGroupList.filter((statisticsGroup) => statisticsGroup.name == "Flow-Duration Statistics")[0];
                    var checkStatisticsGroupFDS = this.checkArrayForObj(this.nssService.selectedStatisticsGroupList, statisticsGroupFDS);
                    if (checkStatisticsGroupFDS == -1) {
                        this.nssService.selectedStatisticsGroupList.push(statisticsGroupFDS);
                    }
                }

                if (this.studyAreaService.selectedStudyArea.CoordinatedReach != null && statisticsGroup.code.toUpperCase() == "PFS") {
                    this.addParameterToStudyAreaList("DRNAREA");
                    this.nssService.showFlowsTable = true
                    return;
                }//end if
                
                //get list of params for selected StatisticsGroup
                this.nssService.loadParametersByStatisticsGroup(this.regionService.selectedRegion.RegionID, statisticsGroup.id, this.studyAreaService.selectedStudyArea.RegressionRegions.map(function (elem) {
                    return elem.code;
                }).join(","), this.studyAreaService.selectedStudyArea.RegressionRegions);
            }

        }

        public multipleParameterSelector() {

            this.regionService.parameterList.forEach((parameter) => {

                //console.log('length of configuration.alwaysSelectedParameters: ', configuration.alwaysSelectedParameters.length);
             
                var paramCheck = this.checkArrayForObj(this.studyAreaService.studyAreaParameterList, parameter);

                if (this.multipleParameterSelectorAdd) {

                    //if its not there add it
                    if (paramCheck == -1) this.studyAreaService.studyAreaParameterList.push(parameter);
                    parameter.checked = true;
                }
                else {

                    //remove it only if toggleable
                    if (paramCheck > -1 && parameter.toggleable) {
                        this.studyAreaService.studyAreaParameterList.splice(paramCheck, 1);
                        //this.toaster.pop('warning', parameter.code + " is required by one of the selected scenarios", "It cannot be unselected");
                        parameter.checked = false;
                    }
                } 

     
            });

            //flip toggle
            this.multipleParameterSelectorAdd = !this.multipleParameterSelectorAdd;
        }

        public updateStudyAreaParameterList(parameter: any) {

            //console.log('in updatestudyarea parameter', parameter);

            //dont mess with certain parameters
            if (parameter.toggleable == false) {
                this.toaster.pop('warning', parameter.code + " is required by one of the selected scenarios", "It cannot be unselected");
                parameter.checked = true;
                return;
            }

            var index = this.studyAreaService.studyAreaParameterList.indexOf(parameter);

            if (!parameter.checked && index > -1) {
                //remove it
                this.studyAreaService.studyAreaParameterList.splice(index, 1);
            }
            else if(parameter.checked && index == -1) {
                //add it
                this.studyAreaService.studyAreaParameterList.push(parameter);
            }
            this.checkParameters();

        }

        public checkParameters() {
            // change select all parameters toggle to match if all params are checked or not
            let allChecked = true;
            for (let param of this.regionService.parameterList) {
                if (!param.checked) {
                    allChecked = false;
                }
            }
            if (allChecked) {
                this.multipleParameterSelectorAdd = false;
            } else {
                this.multipleParameterSelectorAdd = true;
            }
        }

        public calculateParameters() {
            //ga event
            gtag('event', 'Calculate', { 'Category': "Parameters", 'Location': this.regionService.selectedRegion.Name, 'Value':  this.studyAreaService.studyAreaParameterList.map(function (elem) { return elem.code; }).join(",")});

            //console.log('in Calculate Parameters');
            this.studyAreaService.loadParameters();
            if (this.scenarioHasExtensions && this.nssService.selectedStatisticsGroupList.length == 1) {
                this.nssService.showBasinCharacteristicsTable = false;
            }
        }

        public configureExtensions(extensionName) {
            //open modal for extensions
            if (extensionName == "FDCTM") {
                this.modalService.openModal(Services.SSModalType.e_extensionsupport);
            } else if (extensionName == "FLA") {
                this.modalService.openModal(Services.SSModalType.e_flowanywhere);
                this.addParameterToStudyAreaList("DRNAREA");
            }
        }

        public submitBasinEdits() {
            //ga event
            var latLong = this.studyAreaService.selectedStudyArea.Pourpoint.Latitude.toFixed(5) + ',' + this.studyAreaService.selectedStudyArea.Pourpoint.Longitude.toFixed(5);
            gtag('event', 'BasinEditor', { 'Type': 'SubmitEdits', 'Location': latLong });

            this.studyAreaService.showEditToolbar = false;

            this.toaster.pop('wait', "Submitting edited basin", "Please wait...", 0);

            //check if basin has been edited, if so we need to re-query regression regions
            if (this.studyAreaService.selectedStudyArea.Disclaimers['isEdited']) {

                //clear out any scenarios and other stuff
                this.nssService.clearNSSdata();

                this.studyAreaService.loadEditedStudyBoundary();

            }

        }

        public selectScenarios() {

            //if not, just continue
            this.setProcedureType(3);
        }

        public refreshWindow() {
            window.location.reload();
        }

        public generateReport() {

            //console.log('in estimateFlows');
            this.toaster.pop('wait', "Opening Report", "Please wait...",5000);
            
            //ga event
            gtag('event', 'Calculate', { 'Category': 'Flows', 'Location': this.regionService.selectedRegion.Name, 'Value': this.nssService.selectedStatisticsGroupList.map(function (elem) { return elem.name; }).join(",") });

            this.studyAreaService.extensionResultsChanged = 0; //reset FDCTM results

            // Compute FlowAnywhereResults
            if (this.regionService.selectedRegion.Applications.indexOf('FLA') != -1 && this.studyAreaService.flowAnywhereData && this.studyAreaService.flowAnywhereData.selectedGage && this.studyAreaService.flowAnywhereData.dateRange) {
                this.studyAreaService.computeFlowAnywhereResults();
            }

            if (this.nssService.selectedStatisticsGroupList.length > 0 && this.nssService.showFlowsTable) {
                var strippedoutStatisticGroups = []; 
                if (this.studyAreaService.selectedStudyArea.CoordinatedReach != null) {
                    //first remove from nssservice
                    for (var i = 0; i < this.nssService.selectedStatisticsGroupList.length; i++) {
                        var sg = this.nssService.selectedStatisticsGroupList[i];
                        if (sg.code.toUpperCase() === "PFS") {
                            sg.citations = [{ author: "Indiana DNR,", title: "Coordinated Discharges of Selected Streams in Indiana.", citationURL: "http://www.in.gov/dnr/water/4898.htm" }];
                            sg.regressionRegions = [];
                            var result = this.studyAreaService.selectedStudyArea.CoordinatedReach.Execute(this.studyAreaService.studyAreaParameterList.filter(p => { return p.code === "DRNAREA" }))
                            sg.regressionRegions.push(result); 
                            strippedoutStatisticGroups.push(sg);
                            this.nssService.selectedStatisticsGroupList.splice(i, 1);
                            break;
                        }//end if
                    }//next

                    
                }//end if
                this.nssService.estimateFlows(this.studyAreaService.studyAreaParameterList,"value", this.regionService.selectedRegion.RegionID);
                if (this.regionService.selectedRegion.Applications.indexOf("RegulationFlows") !=-1) {
                    setTimeout(() => {
                        this.nssService.estimateFlows(this.studyAreaService.studyAreaParameterList, "unRegulatedValue", this.regionService.selectedRegion.RegionID, true);
                    }, 500);
                }

                //add it back in.
                if(sg != null && sg.code.toUpperCase() === "PFS") {
                    this.nssService.selectedStatisticsGroupList.push(sg);
                    if (this.nssService.selectedStatisticsGroupList.length == 1) {
                        this.toaster.clear();
                        this.modalService.openModal(Services.SSModalType.e_report);
                        this.nssService.reportGenerated = true;
                    }
                }
            } else {
                this.toaster.clear();
                this.modalService.openModal(Services.SSModalType.e_report);
                this.nssService.reportGenerated = true;
            }

           

            //pass mainMap basemap to studyAreaService
            this.leafletData.getMap("mainMap").then((map: any) => {
                this.leafletData.getLayers("mainMap").then((maplayers: any) => {
                    for (var key in maplayers.baselayers) {
                        if (map.hasLayer(maplayers.baselayers[key])) {
                            this.studyAreaService.baseMap = {};
                            this.studyAreaService.baseMap[key] = configuration.basemaps[key];
                        }//end if
                    }//next
                });//end getLayers                                
            });//end getMap 
        }

        public checkRegulation() {
            //console.log('checking for regulation');
            //ga event
            gtag('event', 'AdditionalFunctionality', { 'Category': 'Regulation' });

            this.studyAreaService.upstreamRegulation();
        }

        private queryRegressionRegions() {

            //return if this state is not enabled
            if (!this.regionService.selectedRegion.ScenariosAvailable) {
                this.studyAreaService.regressionRegionQueryComplete = true;
                this.setProcedureType(ProcedureType.SELECT);
                return;
            }

            this.nssService.queriedRegions = true;

            //send watershed to map service query that returns list of regression regions that overlap the watershed
            if (this.regionService.selectedRegion.Applications.indexOf("CoordinatedReach") != -1) {
                this.studyAreaService.queryCoordinatedReach();
            }

            //only do this if we havent done it already and basin hasn't been edited
            //if (!this.studyAreaService.selectedStudyArea.RegressionRegions && !this.studyAreaService.selectedStudyArea.Disclaimers['isEdited']) {  //COMMENTED OUT 9/14/2017 BECAUSE EDIT NOT WORKING
            if (!this.studyAreaService.selectedStudyArea.RegressionRegions) {
                this.studyAreaService.queryRegressionRegions();
            }
            else this.setProcedureType(3);
        }

        private queryStatisticsGroupTypes() {
            this.nssService.loadStatisticsGroupTypes(this.regionService.selectedRegion.RegionID, this.studyAreaService.selectedStudyArea.RegressionRegions.map(function (elem) {
                return elem.code;
            }).join(","));
        }

        private updateParameterValue(parameter) {
            //var paramIndex = this.studyAreaService.requestParameterList.indexOf(parameter.code);
            //if (parameter.value >= 0 && paramIndex != -1) {
            //    this.studyAreaService.requestParameterList.splice(paramIndex, 1);
            //}
        }

        public onSelectedStatisticsGroupChanged() {

            //toggle show flows checkbox
            this.nssService.selectedStatisticsGroupList.length > 0 ? this.nssService.showFlowsTable = true : this.nssService.showFlowsTable = false;

            //loop over whole statisticsgroups
            this.nssService.selectedStatisticsGroupList.forEach((statisticsGroup) => {

                if (statisticsGroup.regressionRegions) {

                    //get their parameters
                    statisticsGroup.regressionRegions.forEach((regressionRegion) => {

                        //loop over list of state/region parameters to see if there is a match
                        regressionRegion.parameters.forEach((param) => {

                            var found = false;
                            for (var i = 0; i < this.regionService.parameterList.length; i++) {
                                var parameter = this.regionService.parameterList[i];
                                if (parameter.code.toLowerCase() == param.code.toLowerCase()) {
                                    this.addParameterToStudyAreaList(parameter.code);
                                    found = true;
                                    break;
                                }//end if
                            }//next i
                            
                            if (!found) {
                                //console.log('PARAM NOT FOUND', param.Code)
                                this.toaster.pop('warning', "Missing Parameter: " + param.code, "The selected scenario requires a parameter not available in this State/Region.  The value for this parameter will need to be entered manually.", 0);

                                //add to region parameterList
                                var newParam = {
                                    name: param.name,
                                    description: param.description,
                                    code: param.code,
                                    unit: param.unitType.unit,
                                    value: null,
                                    regulatedValue: null,
                                    unRegulatedValue: null,
                                    loaded:null,
                                    checked: false,
                                    toggleable: true
                                }

                                //push the param that was not in the original regionService paramaterList
                                this.regionService.parameterList.push(newParam);

                                //select it
                                this.addParameterToStudyAreaList(param.code);
                            }
                        });// next param
                    });// next regressionRegion
                }//end if
            });//next statisticgroup
        }

        public OpenWateruse() {
            //ga event
            gtag('event', 'AdditionalFunctionality', { 'Category': 'WaterUse' });
            this.modalService.openModal(Services.SSModalType.e_wateruse);
        }
        public OpenStormRunoff() {
            //ga event
            gtag('event', 'AdditionalFunctionality', { 'Category': 'StormRunoff' });
            this.modalService.openModal(Services.SSModalType.e_stormrunnoff);
        }

        public OpenNearestGages() {
            //ga event
            gtag('event', 'AdditionalFunctionality', { 'Category': 'NearestGages' });
            this.modalService.openModal(Services.SSModalType.e_nearestgages);
        }

        public downloadGeoJSON() {

            //ga event
            gtag('event', 'Download', { 'Category': 'Basin', 'Type': 'Geojson' });

            var GeoJSON = angular.toJson(this.studyAreaService.selectedStudyArea.FeatureCollection);

            var filename = 'data.geojson';

            var blob = new Blob([GeoJSON], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = <any>document.createElement("a");
                var url = URL.createObjectURL(blob);
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                else {
                    window.open(url);
                }
            }

        }

        public downloadKML() {
            //ga event
            gtag('event', 'Download', { 'Category': 'Basin', 'Type': 'KML' });

            //https://github.com/mapbox/tokml
            //https://gis.stackexchange.com/questions/159344/export-to-kml-option-using-leaflet
            var geojson = JSON.parse(angular.toJson(this.studyAreaService.selectedStudyArea.FeatureCollection));
            var kml = tokml(geojson);
            var blob = new Blob([kml], { type: 'text/csv;charset=utf-8;' });
            var filename = 'data.kml';
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = <any>document.createElement("a");
                var url = URL.createObjectURL(blob);
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                else {
                    window.open(url);
                }
            }
        }
        public downloadShapeFile() {
            //ga event
            gtag('event', 'Download', { 'Category': 'Basin', 'Type': 'Shapefile' });

            try {
                var flowTable: Array<Services.INSSResultTable> = null;

                if (this.nssService.showFlowsTable)
                    flowTable = this.nssService.getflattenNSSTable(this.studyAreaService.selectedStudyArea.WorkspaceID)

                var fc: GeoJSON.FeatureCollection = this.studyAreaService.getflattenStudyArea();
                
                //this will output a zip file
                var disclaimer = "USGS Data Disclaimer: Unless otherwise stated, all data, metadata and related materials are considered to satisfy the quality standards relative to the purpose for which the data were collected. Although these data and associated metadata have been reviewed for accuracy and completeness and approved for release by the U.S. Geological Survey (USGS), no warranty expressed or implied is made regarding the display or utility of the data for other purposes, nor on all computer systems, nor shall the act of distribution constitute any such warranty." + '\n' +
                    "USGS Software Disclaimer: This software has been approved for release by the U.S. Geological Survey (USGS). Although the software has been subjected to rigorous review, the USGS reserves the right to update the software as needed pursuant to further analysis and review. No warranty, expressed or implied, is made by the USGS or the U.S. Government as to the functionality of the software and related material nor shall the fact of release constitute any such warranty. Furthermore, the software is released on condition that neither the USGS nor the U.S. Government shall be held liable for any damages resulting from its authorized or unauthorized use." + '\n' +
                    "USGS Product Names Disclaimer: Any use of trade, firm, or product names is for descriptive purposes only and does not imply endorsement by the U.S. Government." + '\n\n';
                var versionText = 'Application Version: ' + configuration.version;
                if (this.SSServicesVersion) versionText += '\nStreamStats Services Version: ' + this.SSServicesVersion;
                shpwrite.download(fc, flowTable, disclaimer + versionText);
            } catch (e) {
                console.log(e)
            }

        }
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void { 
            //init event handler
            this._onSelectedStatisticsGroupChangedHandler = new WiM.Event.EventHandler<WiM.Event.EventArgs>(() => {
                this.onSelectedStatisticsGroupChanged();
            });
        }

        //special function for searching arrays but ignoring angular hashkey
        private checkArrayForObj(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], obj)) {
                    return i;
                }
            };
            return -1;
        }
        private addParameterToStudyAreaList(paramCode):boolean {
            try {
                for (var i = 0; i < this.regionService.parameterList.length; i++) {   
                    let p: Services.IParameter = this.regionService.parameterList[i];

                    if (p.code.toUpperCase() === paramCode.toUpperCase() && this.checkArrayForObj(this.studyAreaService.studyAreaParameterList, p) == -1) {
                        this.studyAreaService.studyAreaParameterList.push(p);
                        p['checked'] = true;
                        p['toggleable'] = false;
                        break;
                    }//endif
                }//next i

            } catch (e) {
                return false;
            }
           

        }
        private canUpdateProcedure(pType: ProcedureType): boolean {
            //console.log('in canUpdateProcedure');
            //Project flow:
            var msg: string;
            try {               
                switch (pType) {
                    case ProcedureType.INIT:
                        return true;
                    case ProcedureType.IDENTIFY:
                        return this.regionService.selectedRegion != null;
                    case ProcedureType.SELECT:
                        //proceed if there is a regression region
                        return this.studyAreaService.regressionRegionQueryComplete;
                    case ProcedureType.BUILD:

                        return this.studyAreaService.regressionRegionQueryComplete && this.parametersLoaded;
                    default:
                        return false;
                }//end switch          
            }
            catch (e) {
                //this.sm(new MSG.NotificationArgs(e.message, MSG.NotificationType.INFORMATION, 1.5));
                return false;
            }
        }
        
        private sm(msg: string) {
            try {
                //toastr.options = {
                //    positionClass: "toast-bottom-right"
                //};

                //this.NotificationList.unshift(new LogEntry(msg.msg, msg.type));

                //setTimeout(() => {
                //    toastr[msg.type](msg.msg);
                //    if (msg.ShowWaitCursor != undefined)
                //        this.IsLoading(msg.ShowWaitCursor)
                //}, 0)
            }
            catch (e) {
            }
        }

  
    }//end class

    enum ProcedureType {
        INIT = 1,
        IDENTIFY = 2,
        SELECT = 3,
        BUILD = 4
    }

    angular.module('StreamStats.Controllers')
        .controller('StreamStats.Controllers.SidebarController', SidebarController)
    
}//end module
 