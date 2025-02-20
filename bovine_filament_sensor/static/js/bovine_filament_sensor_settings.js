/*
 * View model for OctoPrint-Bovine-Filament-Sensor
 *
 * Author: joaquin abian
 * License: AGPLv3
 */
$(function() {
    function bovineFilamentSensorSettingsViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.printerStateViewModel = parameters[1];
        self.connectionTestDialog = undefined;

        self.remainingDistance = ko.observable(undefined);
        self.lastMotionDetected = ko.observable(undefined);
        self.isFilamentMoving = ko.observable(undefined);
        self.isConnectionTestRunning = ko.observable(false);

        self.onStartup = function() {
            self.connectionTestDialog = $("#settings_plugin_bovine_filament_sensor_connectiontest");
        };
        
        self.showConnectionTest = function() {
            self.connectionTestDialog.modal({
                show: true
            });
        };

        self.onDataUpdaterPluginMessage = function(plugin, data){
            if(plugin !== "bovine_filament_sensor"){
                return;
            }
            
            var message = JSON.parse(data);
            self.remainingDistance(message["_remaining_distance"]);
            self.lastMotionDetected(message["_last_motion_detected"]);
            self.isConnectionTestRunning(message["_connection_test_running"]);

            if(message["_filament_moving"] == true){
                self.isFilamentMoving("Movement detected");
            }
            else{
                self.isFilamentMoving("Filament is not moving");
            }
        };

        self.enableConnectionTest = ko.pureComputed(function() {
            return !self.printerStateViewModel.isBusy();
        });

        self.startConnectionTest = function(){
            $.ajax({
                url: API_BASEURL + "plugin/bovine_filament_sensor",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ "command": "startConnectionTest" }),
                contentType: "application/json",
                success: self.RestSuccess
            });
        };

        self.stopConnectionTest = function(){
            $.ajax({
                url: API_BASEURL + "plugin/bovine_filament_sensor",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ "command": "stopConnectionTest" }),
                contentType: "application/json",
                success: self.RestSuccess
            });
        };

        self.RestSuccess = function(response){
            return;
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: bovineFilamentSensorSettingsViewModel,
        name: "bovineFilamentSensorSettingsViewModel",
        dependencies: ["settingsViewModel", "printerStateViewModel"],
        elements: ["#settings_plugin_bovine_filament_sensor"]
    });
});
