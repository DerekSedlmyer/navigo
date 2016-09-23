var Util = (function () {
    'use strict';

    return {

        waitForSpinner: function() {
            //wait for the block-ui overlay to go away
            var block = element(by.css('.block-ui-overlay'));
            return browser.wait(function () {
                return block.isDisplayed().then(function (result) {
                    return !result;
                });
            }, 30000);
        },

        getServer: function() {
            //return 'http://localhost:8888/navigo/';
            //console.log("BROWSER URL", browser.params.url);
            //return browser.params.url;
            return 'http://127.0.0.1:9000/';
        },

        loginToVoyager: function(username, password) {

            // check if already logged in
            //element(by.css('[ng-click="toggleMobileNav()"]')).click();
            //browser.waitForAngular();
            var loginLink = element(by.css('[ng-click="vm.login()"]'));
            return loginLink.isDisplayed().then(function(isVisible) {
                if(isVisible) {
                    loginLink.click();
                    browser.waitForAngular();

                    var user = element(by.css('[name="username"]'));
                    var pass = element(by.css('[name="password"]'));
                    user.sendKeys(username);
                    pass.sendKeys(password);
                    element(by.css('[ng-click="ok()"]')).click();
                }
                return !isVisible;
            });
        }
    };
})();  // jshint ignore:line
module.exports = Util;