'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var EC = protractor.ExpectedConditions;
    var timeout = 5000;
    var server = Util.getServer();

    it('should toggle the sorting between descending and ascending', function() {
        browser.get(server + '/search');

        var sortButton = searchPage.getSortButton();
        var ascendingOption = searchPage.getSortAscendingButton();
        var descendingOption = searchPage.getSortDescendingButton();

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(ascendingOption).click()
            .perform();

        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('sortdir=asc');

        browser.wait(EC.urlContains('sortdir=asc'), timeout);

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(descendingOption).click()
            .perform();

        Util.waitForSpinner();
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('sortdir=desc');

        browser.wait(EC.urlContains('sortdir=desc'), timeout);
    });

    it('should sort by Name then by Relevance', function() {
        browser.get(server + '/search');

        var sortButton = searchPage.getSortButton();
        var nameOption = searchPage.getSortNameButton();
        var relevanceOption = searchPage.getSortRelevanceButton();

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(nameOption).click()
            .perform();

        browser.waitForAngular();
        //browser.sleep(1000);
        //browser.waitForAngular();

        //expect(browser.getCurrentUrl()).toContain('sort=name');
        browser.wait(EC.urlContains('sort=name'), timeout);

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(relevanceOption).click()
            .perform();

        Util.waitForSpinner();
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('sort=score');
        browser.wait(EC.urlContains('sort=score'), timeout);

    });

    it('should sort by Modified', function() {
        browser.get(server + '/search');

        var sortButton = searchPage.getSortButton();
        var modifiedOption = searchPage.getSortModifiedButton();

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(modifiedOption).click()
            .perform();

        Util.waitForSpinner();

        browser.waitForAngular();

        //browser.sleep(1000);
        //browser.waitForAngular();

        //expect(browser.getCurrentUrl()).toContain('sort=modified');
        browser.wait(EC.urlContains('sort=modified'), timeout);
    });

    it('should sort by file size', function() {
        browser.get(server + '/search');

        var sortButton = searchPage.getSortButton();
        var fileSizeOption = searchPage.getSortFileSizeButton();

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(fileSizeOption).click()
            .perform();

        browser.waitForAngular();

        Util.waitForSpinner();

        browser.waitForAngular();

        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('sort=bytes');

        browser.wait(EC.urlContains('sort=bytes'), timeout);
    });

    it('should sort by path', function() {
        browser.get(server + '/search');

        var sortButton = searchPage.getSortButton();
        var pathOption = searchPage.getSortPathButton();

        Util.waitForSpinner();

        browser.actions()
            .mouseMove(sortButton).click()
            .mouseMove(pathOption).click()
            .perform();

        browser.waitForAngular();

        Util.waitForSpinner();

        browser.waitForAngular();

        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('sort=path');

        browser.wait(EC.urlContains('sort=path'), timeout);
    });

    it('should sort by Name Ascending in Table View then sort by name descending', function() {
        browser.get(server + '/search?disp=ace4bb77&view=table');

        var nameSort = searchPage.getSortTableNameButton();

        Util.waitForSpinner();
        Util.patientClick(nameSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=name&sortdir=asc');

        browser.wait(EC.urlContains('view=table&sort=name&sortdir=asc'), timeout);

        Util.patientClick(nameSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=name&sortdir=desc');

        browser.wait(EC.urlContains('view=table&sort=name&sortdir=desc'), timeout);
    });

    it('should sort by Format Ascending in Table View then sort by Format descending', function() {
        browser.get(server + '/search?disp=ace4bb77&view=table');

        var formatSort = searchPage.getSortTableFormatButton();

        Util.waitForSpinner();
        Util.patientClick(formatSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=format&sortdir=asc');

        browser.wait(EC.urlContains('view=table&sort=format&sortdir=asc'), timeout);

        Util.patientClick(formatSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=format&sortdir=desc');

        browser.wait(EC.urlContains('view=table&sort=format&sortdir=desc'), timeout);
    });

    it('should sort by File Size Ascending in Table View then sort by File Size descending', function() {
        browser.get(server + '/search?disp=ace4bb77&view=table');

        var fileSizeSort = searchPage.getSortTableFileSizeButton();

        Util.waitForSpinner();
        Util.patientClick(fileSizeSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=bytes&sortdir=asc');

        browser.wait(EC.urlContains('view=table&sort=bytes&sortdir=asc'), timeout);

        Util.patientClick(fileSizeSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=bytes&sortdir=desc');

        browser.wait(EC.urlContains('view=table&sort=bytes&sortdir=desc'), timeout);
    });

    it('should sort by Modified Ascending in Table View then sort by Modified descending', function() {
        browser.get(server + '/search?disp=ace4bb77&view=table');

        var fileSizeSort = searchPage.getSortTableModifiedButton();

        Util.waitForSpinner();
        Util.patientClick(fileSizeSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=modified&sortdir=asc');

        browser.wait(EC.urlContains('view=table&sort=modified&sortdir=asc'), timeout);

        Util.patientClick(fileSizeSort, 3, 100);
        //browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain('view=table&sort=modified&sortdir=desc');

        browser.wait(EC.urlContains('view=table&sort=modified&sortdir=desc'), timeout);
    });

    it('should hide then show thumbnails in Table View', function() {
        browser.get(server + '/search?disp=ace4bb77&view=table');

        var imageDropdown = searchPage.getTableViewImageOptions();
        var toggleDropdownOption = searchPage.getTableViewToggleThumbnailsOption();

        Util.waitForSpinner();
        browser.actions()
            .mouseMove(imageDropdown).click()
            .mouseMove(toggleDropdownOption).click()
            .perform();

        Util.waitForSpinner();
        browser.sleep(200);
        
        Util.patientClick((searchPage.getTableViewItemThumbnail()), 3, 100);

        Util.waitForSpinner();

        browser.sleep(1000);

        expect((searchPage.getTableViewHiddenItemThumbnail()).getAttribute('aria-hidden')).toBeTruthy();

        Util.waitForSpinner();
        browser.actions()
            .mouseMove(imageDropdown).click()
            .mouseMove(toggleDropdownOption).click()
            .perform();

        Util.waitForSpinner();
        browser.sleep(1000);
        expect((searchPage.getTableViewItemThumbnail()).getAttribute('aria-hidden')).toBeNull();
    });

});
