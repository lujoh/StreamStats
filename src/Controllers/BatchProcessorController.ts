﻿//------------------------------------------------------------------------------
//----- BatchProcessorController ---------------------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2023 USGS WIM

//    authors:  Andrew R Laws USGS Web Informatics and Mapping
//              Martyn J. Smith USGS Wisconsin Internet Mapping
//
//
//   purpose:
//
//discussion:


//Comments
//03.07.2016 mjs - Created
//02.02.2023 arl - Adapted from AboutController

//Import

module StreamStats.Controllers {
    'use string';
    interface IBatchProcessorControllerScope extends ng.IScope {
        vm: IBatchProcessorController;
    }

    interface IModal {
        Close(): void
    }

    interface IBatchProcessorController extends IModal {
    }

    interface IParameter {
        code: string,
        description: string,
        checked: boolean,
        toggleable: boolean
    }

    class Parameter implements IParameter {
        public code: string;
        public description: string;
        public checked: boolean;
        public toggleable: boolean;
    }

    class SubmitBatchData {
        public email: string;
        public idField: string;
        public attachment: any;
    }

    class BatchProcessorController extends WiM.Services.HTTPServiceBase implements IBatchProcessorController {
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        public http: any;
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
        private modalService: Services.IModalService;
        private nssService: Services.InssService;
        public selectedBatchProcessorTabName: string;
        public displayMessage: string;
        public toaster: any;

        // Regions
        public regionList: Object;
        public selectedRegion: string;

        // Flow Stats
        public flowStatsList: Array<any>;
        public flowStatsAllChecked: boolean;
        public selectedFlowStatsList: Array<Object>;
        public flowStatisticsAllChecked: boolean;

        // Parameters/basin characteristics
        public availableParamList: Array<Parameter>;
        public selectedParamList: Array<string>
        public parametersAllChecked: boolean;
        public showBasinCharacteristics: boolean;

        // POST methods
        public submittingBatch: boolean;
        public showSuccessAlert: boolean;
        public submitBatchData: SubmitBatchData;


        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$http', 'StreamStats.Services.ModalService', 'StreamStats.Services.nssService', '$modalInstance', 'toaster'];
        constructor($scope: IBatchProcessorControllerScope, $http: ng.IHttpService, modalService: Services.IModalService, nssService: Services.InssService, modal: ng.ui.bootstrap.IModalServiceInstance, toaster) {
            super($http, configuration.baseurls.StreamStats);
            $scope.vm = this;
            this.modalInstance = modal;
            this.modalService = modalService;
            this.selectedBatchProcessorTabName = "submitBatch";
            this.nssService = nssService;
            this.toaster = toaster;
            this.selectedFlowStatsList = [];
            this.selectedParamList = [];
            this.flowStatsAllChecked = true;
            this.parametersAllChecked = true;
            this.showBasinCharacteristics = false;
            this.submittingBatch = false; 
            this.showSuccessAlert = false;
            this.submitBatchData = new SubmitBatchData();
            this.init();
        }

        //Methods  
        //-+-+-+-+-+-+-+-+-+-+-+-

        public Close(): void {
            this.showSuccessAlert = false;
            this.modalInstance.dismiss('cancel')
        }

        // used for switching between tabs
        public selectBatchProcessorTab(tabname: string): void {
            this.selectedBatchProcessorTabName = tabname;
        }

        // Get list of State/Regions from batchprocessor/regions
        public getRegions(): void {

            var url = configuration.baseurls['BatchProcessorServices'] + configuration.queryparams['Regions'];
            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);

            this.Execute(request).then(
                (response: any) => {
                    this.regionList = response.data;
                });

        }

        // send selected region code and retrieve flows stats list
        public getFlowStatsAndParams(rcode: string): void {

            this.nssService.getFlowStatsList(rcode).then(
                // set flowStatsList to values of promised response
                response => { this.flowStatsList = response; }

            )

            this.loadParametersByRegionBP(rcode).then(
                response => { this.availableParamList = response; }
            );

        }

        public setRegionStats(statisticsGroup: Array<any>, allFlowStatsSelectedToggle: boolean = null): void {

            // allFlowStatsSelectedToggle is true if the "Select All Flow Statistics" button was clicked
            // allFlowStatsSelectedToggle is false if the "Unselect All Flow Statistics" button was clicked
            // allFlowStatsSelectedToggle is null if no button was clicked

            var checkStatisticsGroup = this.checkArrayForObj(this.selectedFlowStatsList, statisticsGroup);

            // If no "Select/Unselect All Flow Statistics" button was clicked...
            if (allFlowStatsSelectedToggle == null) {

                //if toggled remove selected flow stats set
                if (checkStatisticsGroup != -1) {
                    //remove this statisticsGroup from the list
                    this.selectedFlowStatsList.splice(checkStatisticsGroup, 1);

                    // if no selected scenarios, clear studyareaparameter list
                    if (this.selectedFlowStatsList.length == 0) {
                        this.selectedParamList = [];

                        this.availableParamList.forEach((parameter) => {
                            parameter.checked = false;
                            parameter.toggleable = true;
                        });
                    }
                }

                //add it to the list and get its required parameters
                else {
                    this.selectedFlowStatsList.push(statisticsGroup);

                    // edit checked/toggleable for availableParamList
                    this.setParamCheck(statisticsGroup['regressionRegions']);

                    // make sure DNRAREA is in selectedParamList
                    // this.addParameterToSelectedParamList("DRNAREA"); // uncomment if want to forcibly add DRNAREA to selectedParamList
                    
                }

                this.onSelectedStatisticsGroupChanged();

            } else if (allFlowStatsSelectedToggle == true) { // "Select All Flow Statistics" button was clicked
                if (checkStatisticsGroup == -1) {
                    this.selectedFlowStatsList.push(statisticsGroup);

                    // edit checked/toggleable for availableParamList
                    this.setParamCheck(statisticsGroup['regressionRegions']);
                } 

                this.onSelectedStatisticsGroupChanged();

            } else if (allFlowStatsSelectedToggle == false) { // "Unselect All Flow Statistics" button was clicked
                if (checkStatisticsGroup != -1) {
                    this.selectedFlowStatsList.splice(checkStatisticsGroup, 1);

                    
                }
                this.onSelectedStatisticsGroupChanged(false);
            }

            // handle impacts of flowStat.checked
            this.checkStats();
        }

        // set params in availableParamList to checked
        private setParamCheck(regressionRegions: Array<any>): void {

            regressionRegions.forEach((regressionRegion) => {

                regressionRegion.parameters.forEach((parameter) => {
                    var paramCode = parameter.code;
                    for (var i = 0; i < this.availableParamList.length; i++) {
                        let p = this.availableParamList[i];

                        if (p['code'].toUpperCase() === paramCode.toUpperCase()) {
                            p['checked'] = true;
                            p['toggleable'] = false;
                            break;
                        }
                    }
                });
            });
        }


        public onSelectedStatisticsGroupChanged(allFlowStatsSelectedToggle: boolean = null): void {

            // Rebuild the selected parameters from scratch
            if (allFlowStatsSelectedToggle == false) {
                this.availableParamList.forEach(param => {
                    param.checked = false;
                    param.toggleable = true;
                })
            }

            this.selectedParamList = [];

            //loop over whole statisticsgroups
            this.selectedFlowStatsList.forEach((statisticsGroup) => {

                // set checked to true
                statisticsGroup['checked'] = true;

                if (statisticsGroup['regressionRegions']) {

                    //get their parameters
                    statisticsGroup['regressionRegions'].forEach((regressionRegion) => {

                        //loop over list of state/region parameters to see if there is a match
                        regressionRegion.parameters.forEach((param) => {

                            var found = false;
                            for (var i = 0; i < this.availableParamList.length; i++) {
                                var parameter = this.availableParamList[i];
                                if (parameter.code.toLowerCase() == param.code.toLowerCase()) {
                                    this.addParameterToSelectedParamList(param.code);
                                    found = true;
                                    break;
                                }//end if
                            }//next iparam

                            if (!found) {
                                // this.toaster.pop('warning', "Missing Parameter: " + param.code, "The selected scenario requires a parameter not available in this State/Region.  The value for this parameter will need to be entered manually.", 0);

                                //add to region parameterList
                                var newParam: Parameter = {
                                    code: param.code,
                                    description: param.description,
                                    checked: false,
                                    toggleable: true

                                }

                                //push the param that was not in the original regionService paramaterList
                                this.availableParamList.push(newParam);

                                //select it
                                this.addParameterToSelectedParamList(param.code);
                            }
                        });// next param
                    });// next regressionRegion
                }//end if
            });//next statisticgroup
        }

        public checkStats(): void {

            if (this.selectedFlowStatsList.length > 0) {
                this.showBasinCharacteristics = true;
            } else {
                this.showBasinCharacteristics = false;
            }
        }

        // update selectedParamList
        public updateSelectedParamList(parameter: Parameter): void {
            
            //dont mess with certain parameters
            if (parameter.toggleable == false) {
                parameter.checked = true;
                return;
            }

            var paramCode = parameter.code
            var index = this.selectedParamList.indexOf(paramCode);

            if (!parameter.checked && index > -1) {
                //remove it
                this.selectedParamList.splice(index, 1);
            }
            else if (parameter.checked && index == -1) {
                //add it
                this.selectedParamList.push(paramCode);
            }

            this.checkParameters();

        }

        public checkParameters(): void {
            // change select all parameters toggle to match if all params are checked or not
            let allChecked = true;
            for (let param of this.availableParamList) {
                if (!param['checked']) {
                    allChecked = false;
                }
            }
            if (allChecked) {
                this.parametersAllChecked = false;
            } else {
                this.parametersAllChecked = true;
            }
        }

        public toggleFlowStatisticsAllChecked(): void {
            if (this.flowStatsAllChecked) {
                this.flowStatsAllChecked = false;
                this.flowStatsList.forEach((flowStat) => {
                    flowStat['checked'] = true;
                    this.setRegionStats(flowStat, true)
                });
            } else {                
                this.flowStatsAllChecked = true;
                this.flowStatsList.forEach((flowStat) => {
                    flowStat['checked'] = false;
                    this.setRegionStats(flowStat, false)
                });
            }
        }

        // controls button to select/unselect all parameters
        public toggleParametersAllChecked(): void {

            this.availableParamList.forEach((parameter) => {
                
                var paramCheck = this.selectedParamList.indexOf(parameter.code);

                if (this.parametersAllChecked) {

                    //if its not there add it
                    if (paramCheck == -1) this.selectedParamList.push(parameter.code);
                    parameter.checked = true;
                }
                else {

                    //remove it only if toggleable
                    if (paramCheck > -1 && parameter.toggleable) {
                        this.selectedParamList.splice(paramCheck, 1);
                        //this.toaster.pop('warning', parameter.code + " is required by one of the selected scenarios", "It cannot be unselected");
                        parameter.checked = false;
                    }
                }


            });

            // toggle switch
            this.parametersAllChecked = !this.parametersAllChecked;
        }

        // Service methods
        // get basin characteristics list for region and nation
        public loadParametersByRegionBP(rcode: string): ng.IPromise<any> {

            if (!rcode) return;
            var url = configuration.baseurls['StreamStatsServices'] + configuration.queryparams['SSAvailableParams'].format(rcode);
            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);

            return this.Execute(request).then(
                (response: any) => {

                    if (response.data.parameters && response.data.parameters.length > 0) {

                        // create array to return
                        var paramRaw = [];

                        response.data.parameters.forEach((parameter) => {


                            try {
                                let param: Parameter = {
                                    code: parameter.code,
                                    description: parameter.description,
                                    checked: false,
                                    toggleable: true
                                }
                                paramRaw.push(param);
                            }

                            catch (e) {
                                alert(e)

                            }
                        });

                    }

                    else {
                    }
                    return paramRaw;
                }, (error) => {
                }).finally(() => {
                });
        }

        public validateZipFile($files): void {
            // validate that the file is a .zip
            if ($files[0].type != "application/x-zip-compressed"  && $files[0].type != "application/zip") {

                this.toaster.pop('warning', "Please upload a .zip file.", "", 5000);
                this.submitBatchData.attachment = null;
            }
            return;
        }
        
        public submitBatch(): void {

            var url = null;

            var formdata = new FormData();

            formdata.append('submit_batch[email]', this.submitBatchData.email);
            formdata.append('submit_batch[subject]', this.submitBatchData.idField);
            formdata.append('submit_batch[attachments][][resource]', this.submitBatchData.attachment, this.submitBatchData.attachment.name);
            
            // successful toaster pop message
            this.toaster.pop('success', "The batch was submitted successfully. You will be notified by email when results are available.", "", 5000);

            var headers = {
                "tdb": "tbd"
            };

            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.POST, 'json', formdata, headers, angular.identity);

            this.submittingBatch = true;

            // will be uncommented when ready to submit to server
            // this.Execute(request).then(
            //     (response: any) => {
            //         //console.log('Successfully submitted help ticket: ', response);

            //         //clear out fields
            //         this.submitBatchData = new SubmitBatchData();

            //         //show user feedback
            //         this.showSuccessAlert = true;

            //     }, (error) => {
            //         //sm when error
            //     }).finally(() => {
            //         this.submittingBatch = false;
            //     });
        }

        // Helper Methods
        // -+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            this.getRegions();
        }

        private checkArrayForObj(arr, obj): number {
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], obj)) {
                    return i;
                }
            };
            return -1;
        }

        // add parameter to selectedParamList
        private addParameterToSelectedParamList(paramCode): boolean {
            try {
                for (var i = 0; i < this.availableParamList.length; i++) {
                    let p = this.availableParamList[i];

                    if (p['code'].toUpperCase() === paramCode.toUpperCase() && this.checkArrayForObj(this.selectedParamList, p['code']) == -1) {
                        this.selectedParamList.push(p['code']);
                        p['checked'] = true;
                        p['toggleable'] = false;
                        break;
                    }//endif
                }//next i

            } catch (e) {
                return false;
            }


        }

    }//end  class

    angular.module('StreamStats.Controllers')
        .controller('StreamStats.Controllers.BatchProcessorController', BatchProcessorController);
}//end module 