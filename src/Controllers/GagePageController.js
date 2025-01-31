var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var StreamStats;
(function (StreamStats) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var GageInfo = (function () {
            function GageInfo(sid) {
                this.code = sid;
            }
            return GageInfo;
        }());
        var GageCharacteristic = (function () {
            function GageCharacteristic() {
            }
            return GageCharacteristic;
        }());
        var UnitType = (function () {
            function UnitType() {
            }
            return UnitType;
        }());
        var VariableType = (function () {
            function VariableType() {
            }
            return VariableType;
        }());
        var Citation = (function () {
            function Citation() {
            }
            return Citation;
        }());
        var GageStatisticGroup = (function () {
            function GageStatisticGroup() {
            }
            return GageStatisticGroup;
        }());
        var GageStatistic = (function () {
            function GageStatistic() {
            }
            return GageStatistic;
        }());
        var PredictionInterval = (function () {
            function PredictionInterval() {
            }
            return PredictionInterval;
        }());
        var StationType = (function () {
            function StationType() {
            }
            return StationType;
        }());
        var Agency = (function () {
            function Agency() {
            }
            return Agency;
        }());
        var RegressionType = (function () {
            function RegressionType() {
            }
            return RegressionType;
        }());
        var GagePageController = (function (_super) {
            __extends(GagePageController, _super);
            function GagePageController($scope, $http, modalService, modal) {
                var _this_1 = _super.call(this, $http, configuration.baseurls.StreamStats) || this;
                _this_1.filteredStatGroupsChar = [];
                _this_1.showPreferred = false;
                _this_1.multiselectOptions = {
                    displayProp: 'name'
                };
                _this_1.citationMultiselectOptions = {
                    displayProp: 'id'
                };
                _this_1.URLsToDisplay = [];
                $scope.vm = _this_1;
                _this_1.modalInstance = modal;
                _this_1.modalService = modalService;
                _this_1.init();
                _this_1.selectedStatisticGroups = [];
                _this_1.selectedCitations = [];
                _this_1.selectedStatGroupsChar = [];
                _this_1.selectedCitationsChar = [];
                _this_1.statCitationList = [];
                _this_1.charCitationList = [];
                _this_1.showPreferred = false;
                _this_1.print = function () {
                    gtag('event', 'Download', { 'Category': 'GagePage', "Type": 'Print' });
                    window.print();
                };
                return _this_1;
            }
            GagePageController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };
            GagePageController.prototype.getGagePage = function () {
                var _this_1 = this;
                this.gage = new GageInfo(this.modalService.modalOptions.siteid);
                var url = configuration.baseurls.GageStatsServices + configuration.queryparams.GageStatsServicesStations + this.gage.code;
                var request = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'json');
                this.Execute(request).then(function (response) {
                    _this_1.gage = response.data;
                    _this_1.gage.lat = response.data.location.coordinates[1];
                    _this_1.gage.lng = response.data.location.coordinates[0];
                    _this_1.gage.statisticsgroups = [];
                    _this_1.gage.citations = [];
                    _this_1.getStationCharacteristics(response.data.characteristics);
                    _this_1.getStationStatistics(response.data.statistics);
                    _this_1.getNWISInfo();
                    _this_1.getNWISPeriodOfRecord(_this_1.gage);
                    _this_1.additionalLinkCheck(_this_1.gage.code);
                }, function (error) {
                }).finally(function () {
                });
            };
            GagePageController.prototype.additionalLinkCheck = function (siteNo) {
                var _this_1 = this;
                this.URLsToDisplay = [];
                var additionalURLs = [
                    {
                        url: 'https://streamstats.usgs.gov/gagePages/NC/Sta_' + siteNo + '_daily_discharge_percentiles_table_by-wateryears.txt',
                        text: "Flow-Duration Statistics by Water Year",
                        available: false
                    },
                    {
                        url: 'https://streamstats.usgs.gov/gagePages/NC/Sta_' + siteNo + '_daily_discharge_percentiles_table_by-day-month-seasonal.txt',
                        text: "Flow-Duration Statistics by Period of Record, Calendar Day & Month, & Seasonal Periods",
                        available: false
                    },
                    {
                        url: 'https://streamstats.usgs.gov/gagePages/IA/' + siteNo + '_stats.pdf',
                        text: "Stream Flow Statistics",
                        available: false
                    }
                ];
                var _loop_1 = function (index) {
                    request = new WiM.Services.Helpers.RequestInfo(additionalURLs[index].url, true, WiM.Services.Helpers.methodType.GET, 'json');
                    this_1.Execute(request).then(function (response) {
                        if (response.status == 200) {
                            additionalURLs[index].available = true;
                            _this_1.URLsToDisplay.push(additionalURLs[index]);
                        }
                    }, function (error) {
                    }).finally(function () {
                    });
                };
                var this_1 = this, request;
                for (var index = 0; index < additionalURLs.length; index++) {
                    _loop_1(index);
                }
            };
            GagePageController.prototype.setPreferred = function (pref) {
                this.showPreferred = pref;
            };
            GagePageController.prototype.getStationCharacteristics = function (characteristics) {
                var _this_1 = this;
                characteristics.forEach(function (char, index) {
                    var characteristic = char;
                    if (char.hasOwnProperty('citation') && char.citation.id) {
                        if (char.citation && char.citation.citationURL)
                            char.citation.citationURL = char.citation.citationURL.replace('#', '');
                        if (!_this_1.checkForCitation(char.citation.id)) {
                            _this_1.gage.citations.push(char.citation);
                        }
                        if (!_this_1.checkForStatOrCharCitation(char.citation.id, _this_1.charCitationList)) {
                            _this_1.charCitationList.push(char.citation);
                        }
                    }
                    if (!_this_1.checkForCharStatisticGroup(char.variableType.statisticGroupTypeID)) {
                        if (char.hasOwnProperty('statisticGroupType')) {
                            var statgroup = char.statisticGroupType;
                            _this_1.filteredStatGroupsChar.push(statgroup);
                        }
                        else {
                            _this_1.getCharStatGroup(char.variableType.statisticGroupTypeID);
                        }
                    }
                });
            };
            GagePageController.prototype.checkForCitation = function (id) {
                var found = this.gage.citations.some(function (el) { return el.id === id; });
                return found;
            };
            GagePageController.prototype.checkForStatOrCharCitation = function (id, citationlist) {
                var found = citationlist.some(function (el) { return el.id === id; });
                return found;
            };
            GagePageController.prototype.getStationStatistics = function (statistics) {
                var _this_1 = this;
                statistics.forEach(function (stat, index) {
                    if (stat.hasOwnProperty('citation') && stat.citation.id) {
                        if (stat.citation && stat.citation.citationURL)
                            stat.citation.citationURL = stat.citation.citationURL.replace('#', '');
                        if (!_this_1.checkForCitation(stat.citation.id)) {
                            _this_1.gage.citations.push(stat.citation);
                        }
                        if (!_this_1.checkForStatOrCharCitation(stat.citation.id, _this_1.statCitationList)) {
                            _this_1.statCitationList.push(stat.citation);
                        }
                    }
                    if (!_this_1.checkForStatisticGroup(stat.statisticGroupTypeID)) {
                        if (stat.hasOwnProperty('statisticGroupType')) {
                            var statgroup = stat.statisticGroupType;
                            _this_1.gage.statisticsgroups.push(statgroup);
                        }
                        else {
                            _this_1.getStatGroup(stat.statisticGroupTypeID);
                        }
                    }
                });
            };
            GagePageController.prototype.getStatGroup = function (id) {
                var _this_1 = this;
                var url = configuration.baseurls.GageStatsServices + configuration.queryparams.GageStatsServicesStatGroups + id;
                var request = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'json');
                this.Execute(request).then(function (response) {
                    if (!_this_1.checkForStatisticGroup(response.data.id))
                        _this_1.gage.statisticsgroups.push(response.data);
                });
            };
            GagePageController.prototype.getCharStatGroup = function (id) {
                var _this_1 = this;
                var url = configuration.baseurls.GageStatsServices + configuration.queryparams.GageStatsServicesStatGroups + id;
                var request = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'json');
                this.Execute(request).then(function (response) {
                    if (!_this_1.checkForCharStatisticGroup(response.data.id))
                        _this_1.filteredStatGroupsChar.push(response.data);
                });
            };
            GagePageController.prototype.checkForStatisticGroup = function (id) {
                var found = this.gage.statisticsgroups.some(function (el) { return el.id === id; });
                return found;
            };
            GagePageController.prototype.checkForCharStatisticGroup = function (id) {
                var found = this.filteredStatGroupsChar.some(function (el) { return el.id === id; });
                return found;
            };
            GagePageController.prototype.checkForPredInt = function (statGroupID) {
                var found = this.gage.statistics.some(function (el) { return el.statisticGroupTypeID == statGroupID && el.hasOwnProperty('predictionInterval'); });
                return found;
            };
            GagePageController.prototype.getNWISInfo = function () {
                var _this_1 = this;
                var url = configuration.baseurls.NWISurl + configuration.queryparams.NWISsiteinfo + this.gage.code;
                var request = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'json');
                this.Execute(request).then(function (response) {
                    var regex = /[+-]?((\d+(\.\d*)?)|(\.\d+))/g;
                    try {
                        var latLong = response.data.split(_this_1.gage.name)[1].match(regex);
                        _this_1.NWISlat = latLong[0];
                        _this_1.NWISlng = latLong[1];
                    }
                    catch (error) {
                        var data = response.data.split('\n').filter(function (r) { return (!r.startsWith("#") && r != ""); })[2].split('\t');
                        _this_1.NWISlat = data[4];
                        _this_1.NWISlng = data[5];
                    }
                });
            };
            GagePageController.prototype.getNWISPeriodOfRecord = function (gage) {
                if (!gage.code)
                    return;
                var nwis_url = configuration.baseurls.NWISurl + configuration.queryparams.NWISperiodOfRecord + gage.code;
                var nwis_request = new WiM.Services.Helpers.RequestInfo(nwis_url, true, WiM.Services.Helpers.methodType.GET, 'TEXT');
                this.Execute(nwis_request).then(function (response) {
                    var data = response.data.split('\n').filter(function (r) { return (!r.startsWith("#") && r != ""); });
                    var headers = data.shift().split('\t');
                    data.shift();
                    do {
                        var station = data.shift().split('\t');
                        if (station[headers.indexOf("parm_cd")] == "00060") {
                            if (gage['StartDate'] == undefined)
                                gage['StartDate'] = new Date(station[headers.indexOf("begin_date")]);
                            else {
                                var nextStartDate = new Date(station[headers.indexOf("begin_date")]);
                                if (nextStartDate < gage['StartDate'])
                                    gage['StartDate'] = nextStartDate;
                            }
                            if (gage['EndDate'] == undefined)
                                gage['EndDate'] = new Date(station[headers.indexOf("end_date")]);
                            else {
                                var nextEndDate = new Date(station[headers.indexOf("end_date")]);
                                if (nextEndDate > gage['EndDate'])
                                    gage['EndDate'] = nextEndDate;
                            }
                        }
                    } while (data.length > 0);
                }, function (error) {
                    gage['StartDate'] = undefined;
                    gage['EndDate'] = undefined;
                }).finally(function () {
                });
            };
            GagePageController.prototype.citationSelected = function (item, list) {
                for (var citation in list) {
                    if (list[citation].id === item.citationID) {
                        return true;
                    }
                }
                return false;
            };
            GagePageController.prototype.downloadCSV = function () {
                gtag('event', 'Download', { 'Category': 'GagePage', "Type": 'CSV' });
                var disclaimer = '"USGS Data Disclaimer: Unless otherwise stated, all data, metadata and related materials are considered to satisfy the quality standards relative to the purpose for which the data were collected. Although these data and associated metadata have been reviewed for accuracy and completeness and approved for release by the U.S. Geological Survey (USGS), no warranty expressed or implied is made regarding the display or utility of the data for other purposes, nor on all computer systems, nor shall the act of distribution constitute any such warranty."\n'
                    + '"USGS Software Disclaimer: This software has been approved for release by the U.S. Geological Survey (USGS). Although the software has been subjected to rigorous review, the USGS reserves the right to update the software as needed pursuant to further analysis and review. No warranty, expressed or implied, is made by the USGS or the U.S. Government as to the functionality of the software and related material nor shall the fact of release constitute any such warranty. Furthermore, the software is released on condition that neither the USGS nor the U.S. Government shall be held liable for any damages resulting from its authorized or unauthorized use."\n'
                    + '"USGS Product Names Disclaimer: Any use of trade, firm, or product names is for descriptive purposes only and does not imply endorsement by the U.S. Government."\n\n';
                var periodOfRecord = (this.gage['StartDate'] !== undefined || this.gage['EndDate'] !== undefined) ? this.convertDateToString(this.gage['StartDate']) + " - " + this.convertDateToString(this.gage['EndDate']) : "Undefined";
                var filename = 'data.csv';
                var csvFile = '\uFEFFStreamStats Gage Page\n\n'
                    + 'Gage Information\n'
                    + 'Name,Value\n'
                    + 'USGS Station Number,"' + this.gage.code + '"\n'
                    + 'Station Name,"' + this.gage.name + '"\n'
                    + 'Station Type,"' + this.gage.stationType.name + '"\n'
                    + 'Latitude,"' + this.gage.lat + '"\n'
                    + 'Longitude,"' + this.gage.lng + '"\n'
                    + 'NWIS Latitude,"' + this.NWISlat + '"\n'
                    + 'NWIS Longitude,"' + this.NWISlng + '"\n'
                    + 'Is regulated?,"' + this.gage.isRegulated + '"\n'
                    + 'Agency,"' + this.gage.agency.name + '"\n'
                    + 'NWIS Discharge Period of Record,"' + periodOfRecord + '"\n\n';
                var _this = this;
                if (this.gage.characteristics.length > 0) {
                    csvFile += 'Physical Characteristics\n\n';
                    this.filteredStatGroupsChar.forEach(function (statisticGroup) {
                        if (_this.selectedStatGroupsChar.length == 0 || _this.selectedStatGroupsChar.indexOf(statisticGroup) > -1) {
                            csvFile += '"' + statisticGroup.name + '"\n'
                                + _this.tableToCSV($('#physical-characteristics-table-' + statisticGroup.id)) + "\n\n";
                        }
                    });
                }
                if (this.gage.statisticsgroups.length > 0) {
                    csvFile += 'Streamflow Statistics\n\n';
                    this.gage.statisticsgroups.forEach(function (statisticGroup) {
                        if (_this.selectedStatisticGroups.length == 0 || _this.selectedStatisticGroups.indexOf(statisticGroup) > -1) {
                            csvFile += '"' + statisticGroup.name + '"\n'
                                + _this.tableToCSV($('#streamflow-statistics-table-' + statisticGroup.id)) + "\n\n";
                        }
                    });
                }
                if (this.gage.citations.length > 0) {
                    csvFile += "Citations\n"
                        + this.tableToCSV($('#citations-table')) + "\n\n";
                }
                csvFile += disclaimer
                    + '"Application Version:",' + this.AppVersion;
                var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, filename);
                }
                else {
                    var link = document.createElement("a");
                    var url = URL.createObjectURL(blob);
                    if (link.download !== undefined) {
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
            };
            GagePageController.prototype.init = function () {
                this.AppVersion = configuration.version;
                this.getGagePage();
            };
            GagePageController.prototype.convertDateToString = function (date) {
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();
                var mmChars = mm.split('');
                var ddChars = dd.split('');
                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            };
            GagePageController.prototype.tableToCSV = function ($table) {
                var $headers = $table.find('tr:has(th)'), $rows = $table.find('tr:has(td)'), tmpColDelim = String.fromCharCode(11), tmpRowDelim = String.fromCharCode(0), colDelim = '","', rowDelim = '"\r\n"';
                var csv = '"';
                csv += formatRows($headers.map(grabRow));
                csv += rowDelim;
                csv += formatRows($rows.map(grabRow)) + '"';
                return csv;
                function formatRows(rows) {
                    return rows.get().join(tmpRowDelim)
                        .split(tmpRowDelim).join(rowDelim)
                        .split(tmpColDelim).join(colDelim);
                }
                function grabRow(i, row) {
                    var $row = $(row);
                    var $cols = $row.find('td');
                    if (!$cols.length)
                        $cols = $row.find('th');
                    return $cols.map(grabCol)
                        .get().join(tmpColDelim);
                }
                function grabCol(j, col) {
                    var $col = $(col), $text = $col.text();
                    return $text.replace('"', '""');
                }
            };
            GagePageController.$inject = ['$scope', '$http', 'StreamStats.Services.ModalService', '$modalInstance'];
            return GagePageController;
        }(WiM.Services.HTTPServiceBase));
        angular.module('StreamStats.Controllers')
            .controller('StreamStats.Controllers.GagePageController', GagePageController);
    })(Controllers = StreamStats.Controllers || (StreamStats.Controllers = {}));
})(StreamStats || (StreamStats = {}));
