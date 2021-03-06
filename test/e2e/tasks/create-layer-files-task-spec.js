'use strict';


describe('Run Create Layer Files Task', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var taskPage = require('../../pages/task-page.js');
    var taskStatusPage = require('../../pages/task-status-page.js');
    var server = Util.getServer();

    beforeEach(function() {
        searchPage.addAllToQueue('title:test_polygon_102100');
        browser.get(server + '/task?type=create_layer_files');
        Util.waitForSpinner();
    });

    it('should run create_layer_files using default parameter values', function() {

        // Get list of parameters
        var paramList = taskPage.getParams();

        // Verify we have the correct number of params and defaults
        expect(paramList.count()).toBe(1);
        Util.waitForSpinner();  //can't click until spinner is gone

        // Execute the task with default parameter values
        taskPage.executeTask();
        browser.waitForAngular();
    });

    afterEach(function() {
        verifyStatus();
    });

    function verifyStatus() {
        // Verify there are no errors or warnings (warnings may be possible bug and to be investigated)
        expect(browser.getCurrentUrl()).toMatch(/\/status/);
        expect(taskStatusPage.getSuccess().isPresent()).toBeTruthy();
    }
});