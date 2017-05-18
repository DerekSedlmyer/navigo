'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var detailsPage = require('../../pages/details-page.js');

    var server = Util.getServer();

    it('should scroll down to reveal more results in card view', function() {
        browser.get(server + '/search');

        var resultList = element.all(by.repeater('doc in results'));
        expect(resultList.count()).toBeLessThan(51);

        browser.executeScript('window.scrollTo(0,10000);');
        Util.waitForSpinner();
        expect(resultList.count()).toBeGreaterThan(51);

    });

    it('should show table view', function() {
        browser.get(server + '/search?view=table&disp=default');

        //workaround - this test times out for some reason
        browser.sleep(10000);
        browser.waitForAngular();

        var tableColumns = element.all(by.repeater('field in vm.tableFields'));
        expect(tableColumns.count()).toBeGreaterThan(0);

        var rows = element.all(by.repeater('doc in $data'));
        expect(rows.count()).toBeGreaterThan(0);

    });

    it('should show map view', function() {
        browser.get(server + '/search?view=map&disp=default');

        expect(element(by.css('.alt_list_view')).isPresent()).toBeTruthy();

        var resultList = element.all(by.repeater('doc in results'));
        expect(resultList.count()).toBeGreaterThan(0);

    });

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
            expect((popover).isPresent()).toBeTruthy();
        });        

    });

    it('should click the items popover name in grid view', function() {
        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        browser.actions().mouseMove(firstResult).perform();

        var popover = searchPage.getGridViewPopover();
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
