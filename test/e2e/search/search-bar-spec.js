'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var detailsPage = require('../../pages/details-page.js');

    var server = Util.getServer();

    it('should load search page', function() {
        browser.get(server + '/search');

        var totalAnchor = searchPage.getTotalLink();

        expect(searchPage.getTotalValue()).toBeGreaterThan(0);

        var resultList = element.all(by.repeater('doc in results'));
        expect(resultList.count()).toEqual(48);

        expect(totalAnchor.getAttribute('href')).not.toBeNull();
        expect($('#filterContainer').isDisplayed()).toBeFalsy();
        expect(element(by.css('.leaflet-map-pane')).isPresent()).toBeTruthy();
    });

    it('should go back to the home page', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var homeButton = searchPage.getHomeButton();    

        Util.patientClick(homeButton, 3, 100);

        expect(browser.getCurrentUrl()).toContain('home');

    });

    it('should search for Australia in the Placefinder', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var placefinderInput = searchPage.getPlacefinderInput();    
        var placeString = 'Australia';

        placefinderInput.sendKeys(placeString);
        Util.sendEnter();

        expect(browser.getCurrentUrl()).toContain('place=Australia');

    });

    it('should execute a keyword search', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'water';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('water');

    });

    it('should execute a search via enter key', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        
        searchInput.sendKeys('test');
        Util.sendEnter();

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('q=test');

    });

    it('should execute a search via the search button', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchButton = searchPage.getSearchButton();
        var searchInput = searchPage.getSearchInput();
        searchInput.sendKeys('test');
        searchButton.each(function(button){
            Util.patientClick(button, 3, 100);
        });

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('q=test');

    });

    it('should select a suggestion in the Placefinder bar', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var placefinderInput = searchPage.getPlacefinderInput();    
        var placeString = 'Austra';
        var placefinderSuggestion = searchPage.getFirstPlaceSuggestion();  

        placefinderInput.sendKeys(placeString);
        Util.patientClick(placefinderSuggestion, 3, 100);

        expect(browser.getCurrentUrl()).toContain('place=Australia');

    });

    it('should switch the search type from within to intersects', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchTypeButton = searchPage.getSearchTypeButton();    
        var intersectsOption = searchPage.getIntersectsOption();

        Util.patientClick(searchTypeButton, 3, 100);
        Util.patientClick(intersectsOption, 3, 100);
        
        expect(searchTypeButton.getText()).toEqual('Intersects');

    });

    it('should switch the search type from within to intersects and back', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchTypeButton = searchPage.getSearchTypeButton();    
        var intersectsOption = searchPage.getIntersectsOption();
        var withinOption = searchPage.getWithinSecondaryOption();

        Util.patientClick(searchTypeButton, 3, 100);
        Util.patientClick(intersectsOption, 3, 100);

        Util.waitForSpinner();

        Util.patientClick(searchTypeButton, 3, 100);
        Util.patientClick(withinOption, 3, 100);

        Util.waitForSpinner();

        expect(searchTypeButton.getText()).toEqual('Within');

    });

    it('should clear the placefinder field', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var placefinderInput = searchPage.getPlacefinderInput();   
        var placefinderString = '(╯°□°)╯︵ ┻━┻';

        placefinderInput.sendKeys(placefinderString);

        var placefinderClearButton = searchPage.getPlacefinderClearButton(); 

        browser.executeScript('arguments[0].click()', placefinderClearButton.getWebElement());

        expect(placefinderInput.getAttribute('value')).toEqual('');

    });

    it('should clear the keyword field', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var keywordInput = searchPage.getSearchInput();   
        var placefinderString = '(╯°□°)╯︵ ┻━┻';

        keywordInput.sendKeys(placefinderString);

        var keywordClearButton = searchPage.getKeywordClearButton(); 

        browser.executeScript('arguments[0].click()', keywordClearButton.getWebElement());

        expect(keywordInput.getAttribute('value')).toEqual('');

    });
    
});
