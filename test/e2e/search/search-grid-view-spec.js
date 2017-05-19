'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var EC = protractor.ExpectedConditions;

    var server = Util.getServer();

    it('should show grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');

        expect(element(by.css('[ui-view="grid-results"]')).isPresent()).toBeTruthy();

        var resultList = element.all(by.repeater('doc in results'));
        expect(resultList.count()).toBeGreaterThan(0);

    });

    it('should show the popover in grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        browser.actions().mouseMove(firstResult).perform().then(function(){
            var popover = searchPage.getGridViewPopover();
            browser.wait(EC.visibilityOf(popover), 5000);
            expect((popover).isPresent()).toBeTruthy();
        });

    });

    it('should click the items popover name in grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        browser.actions().mouseMove(firstResult).perform();

        var popover = searchPage.getGridViewPopover();
        browser.wait(EC.visibilityOf(popover), 5000);

        expect((popover).isPresent()).toBeTruthy();

        var popoverTitle = searchPage.getGridViewPopoverTitle();
        Util.patientClick(popoverTitle, 3, 100);

        expect(browser.getCurrentUrl()).toContain('show?id=');
    });

    it('should click the items popover image in grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        browser.actions().mouseMove(firstResult).perform();

        var popover = searchPage.getGridViewPopover();
        browser.wait(EC.visibilityOf(popover), 5000);

        expect((popover).isPresent()).toBeTruthy();

        var popoverImage = searchPage.getGridViewPopoverImage();
        Util.patientClick(popoverImage, 5, 200);

        expect(browser.getCurrentUrl()).toContain('show?id=');
    });

    it('should click the items popover format in grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        browser.actions().mouseMove(firstResult).perform();

        var popover = searchPage.getGridViewPopover();
        browser.wait(EC.visibilityOf(popover), 5000);

        expect((popover).isPresent()).toBeTruthy();

        var popoverFormat = searchPage.getGridViewPopoverFormat();
        Util.patientClick(popoverFormat, 3, 100);

        expect(browser.getCurrentUrl()).toContain('fq=format:');
    });

    /*it('should click the thumbnail image in grid view', function() {
     browser.get(server + '/search?view=grid&disp=default');
     Util.waitForSpinner();
     expect(element(by.css('[ui-view="grid-results"]')).isPresent()).toBeTruthy();

     var firstResult = searchPage.getFirstResult();

     browser.actions().mouseMove(firstResult, {x:10, y:10}).click().perform();

     Util.waitForSpinner();

     expect(browser.getCurrentUrl()).toContain('show?id=');
     }); */

});
