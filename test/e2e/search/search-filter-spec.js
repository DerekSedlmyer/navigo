'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var detailsPage = require('../../pages/details-page.js');

    var server = Util.getServer();

    it('should load search page with filter', function() {
        browser.get(server + '/search?disp=default&fq=format_type:File');

        var selectedFilters = element.all(by.repeater('selected in filters'));
        expect(selectedFilters.count()).toEqual(1);

    });

    it('should show filters', function() {
        browser.get(server + '/search');

        var showFilters = searchPage.getOpenFiltersMenuButton();  

        Util.patientClick(showFilters, 3, 100);

        expect($('#filterContainer').isDisplayed()).toBeTruthy();

    });

    it('should show then hide filters', function() {
        browser.get(server + '/search');

        var showFilters = searchPage.getOpenFiltersMenuButton();  
        var hideFilters = searchPage.getHideFiltersMenuButton(); 

        Util.patientClick(showFilters, 3, 100);
        Util.patientClick(hideFilters, 3, 100);

        expect($('#filterContainer').isDisplayed()).toBeFalsy();

    });


    it('should show facets and select facet', function() {
        browser.get(server + '/search');

        Util.waitForSpinner();

        var startTotal = 0;

        var total = searchPage.getTotalValue().then(function(val) {
            startTotal = val;
            return val;
        });

        expect(total).toBeGreaterThan(0);

        Util.patientClick(element(by.css('.icon-filters')),3,100);

        var filters = element.all(by.repeater('filter in filters'));

        var filter = filters.first().element(by.tagName('a'));
        Util.patientClick(filter,3,100);

        filter.getAttribute('href').then(function(href) {
            var id = href.substring(href.indexOf('#'));  //href contains the id of the facets panel
            expect($(id).isDisplayed()).toBeTruthy();
        });

        var facets = element.all(by.repeater('facet in filter.values'));

        var checkFacet = facets.first().element(by.tagName('input'));  //assumes check box style for first filter
        checkFacet.isPresent().then(function(present) {
            if(present) {Util.patientClick(checkFacet,3,100);}
        });

        Util.waitForSpinner();

        var linkFacet = facets.first().element(by.tagName('a'));  //assumes check box style for first filter
        linkFacet.isPresent().then(function(present) {
            if(present) {
                browser.executeScript('window.scrollTo(0,0);'); // if filters have lots of items it will scroll down so scroll back up
                Util.patientClick(linkFacet,3,100);
            }
        });

        var selectedFilters = element.all(by.repeater('selected in filters'));
        expect(selectedFilters.count()).toEqual(1);

        //check that the total is lower after applying filter
        searchPage.getTotalValue().then(function(val) {
            expect(val < startTotal).toBeTruthy();
        });

    });

    it('should show facets and then hide them', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        expect($('#filterContainer').isDisplayed()).toBeTruthy();
        
        var filterCategory = searchPage.getFilterCategory(0)
                                        .element(by.css('.panel-heading'))
                                        .element(by.css('.panel-title'))
                                        .element(by.css('[ng-click="toggleDisplayState(filter)"]'));
        Util.patientClick(filterCategory, 3, 100);

        expect(filterCategory.getAttribute('aria-expanded')).toBeTruthy();

        Util.waitForSpinner();
        browser.waitForAngular();
        Util.patientClick(filterCategory, 3, 100);

        expect(filterCategory.getAttribute('aria-expanded')).toBe('false');
    });

    it('should open facet list dialog', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var showAllFilters = searchPage.getShowAllFiltersButton();
        Util.patientClick(showAllFilters, 3, 100);

        var showAllFiltersDialog = searchPage.getShowAllFiltersDialog();

        expect(showAllFiltersDialog.isPresent()).toBeTruthy();
    });

    it('should open then close the facet list dialog', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var showAllFilters = searchPage.getShowAllFiltersButton();
        Util.patientClick(showAllFilters, 3, 100);

        var showAllFiltersDialog = searchPage.getShowAllFiltersDialog();
        var closeFiltersDialog = searchPage.getCloseFiltersDialog();

        Util.patientClick(closeFiltersDialog, 3, 100);


        expect(showAllFiltersDialog.isPresent()).toBeFalsy();
    });

    it('should open then select an option from the facets list', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var showAllFilters = searchPage.getShowAllFiltersButton();
        Util.patientClick(showAllFilters, 3, 100);

        var filterInFiltersList = searchPage.getFirstFilterInFiltersList();
        Util.patientClick(filterInFiltersList, 3, 100);

        expect(browser.getCurrentUrl()).toContain('&fq=');
    });

    it('should apply multiple select facets', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var formatCategory = searchPage.getFilterCategory(1);
        var typeCategory = searchPage.getFilterCategory(2);
        Util.patientClick(formatCategory, 3, 100);
        Util.waitForSpinner();
        Util.patientClick(typeCategory, 3, 200);
        Util.waitForSpinner();
        
        var firstFormatFilter = searchPage.getFacetInCategory(formatCategory, 0);
        
        var firstTypeFilter = searchPage.getFacetInCategory(typeCategory, 0);


        Util.patientClick(firstFormatFilter, 3, 100);
       
        
        Util.patientClick(firstTypeFilter, 3, 200);
        expect(browser.getCurrentUrl()).toContain('fq=format:application%5C%2Fvnd.esri.featureclass.feature&fq=format_type:Feature');
    });

    it('should apply multiple checkbox facets', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var formatCategory = searchPage.getFilterCategory(0);
        Util.patientClick(formatCategory, 3, 100);
        Util.waitForSpinner();
        
        var firstCategoryFilter = searchPage.getFacetInCategory(formatCategory, 0).element(by.css('[ng-click="filterResults(facet)"]'));
        var secondCategoryFilter = searchPage.getFacetInCategory(formatCategory, 1).element(by.css('[ng-click="filterResults(facet)"]'));

        Util.patientClick(firstCategoryFilter, 3, 100); 
        Util.patientClick(secondCategoryFilter, 3, 200);
        expect(browser.getCurrentUrl()).toContain('fq=format_category:GIS&fq=format_category:Office');
    });

    it('should check the item counts in the facets dialog', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var showAllFilters = searchPage.getShowAllFiltersButton();
        Util.patientClick(showAllFilters, 3, 100);

        var filterCount = searchPage.getFirstCountInFiltersList().getText();

        expect(filterCount).toBeGreaterThan('0');
    });

    it('should select a facet and then remove it by clicking it again', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var checkBoxFacet = searchPage.getCheckboxFacet();
        Util.patientClick(checkBoxFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).toContain('&fq=');

        Util.patientClick(checkBoxFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).not.toContain('&fq=');
    });

    it('should check the item counts in the facets list', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var checkBoxFacetText = searchPage.getCheckboxFacet().getText().then(function(text){
            var textLength = text.length;
            return text.substring(1,textLength - 1);
            
        });
        
        expect(checkBoxFacetText).toBeGreaterThan(0);
    });

    it('should select a facet and then remove it by clicking the clear all filters option', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var checkBoxFacet = searchPage.getCheckboxFacet();
        Util.patientClick(checkBoxFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).toContain('&fq=');

        var filtersDropdown = searchPage.getFiltersDropdown();

        var clearAllFilters = searchPage.getClearAllFilters();

        browser.actions()
            .mouseMove(filtersDropdown).click()
            .mouseMove(clearAllFilters).click()
            .perform();
        
        expect(browser.getCurrentUrl()).not.toContain('&fq=');
    });

    it('should select a facet and then remove it by clicking the x on the facet label', function() {
        browser.get(server + '/search');

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var checkBoxFacet = searchPage.getCheckboxFacet();
        Util.patientClick(checkBoxFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).toContain('&fq=');

        var removeFacet = searchPage.getRemoveFacetButton();
        Util.patientClick(removeFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).not.toContain('&fq=');
    });

    it('should apply a date filter via a date picker',function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var e2eInterceptors = function() {
            return angular.module('e2eInterceptors', []).factory('filterInterceptor', function() {
                return {
                    response: function(response) {
                        var requestedUrl = response.config.url;
                        if(requestedUrl.indexOf('display/config') > -1){
                            response.data.filters.push({
                                'field': 'created',
                                'style': 'RANGE'
                            });
                        }
                        return response;
                    }
                };
            }).config(function($httpProvider) {
                return $httpProvider.interceptors.push('filterInterceptor');
            });
        };
        browser.addMockModule('e2eInterceptors',e2eInterceptors);

        var showFilters = searchPage.getOpenFiltersMenuButton();  

        Util.patientClick(showFilters, 3, 100);

        expect($('#filterContainer').isDisplayed()).toBeTruthy();

        var createdFilterCategory = searchPage.getFilterCategory(11);

        expect(createdFilterCategory.getText()).toBe('CREATED');

        Util.patientClick(createdFilterCategory, 3, 100);

        var startDate = searchPage.getCreatedFilterStartDate();
        var endDate = searchPage.getCreatedFilterEndDate();
        var applyButton = searchPage.getCreatedFilterApplyButton();

        Util.patientClick(startDate, 3, 100);
        var firstDate = searchPage.getDatePickerDate(0);
        Util.patientClick(firstDate, 3, 100);

        Util.patientClick(endDate, 3, 100);
        var lastDate = searchPage.getDatePickerDate(3);
        Util.patientClick(lastDate, 3, 100);

        Util.patientClick(applyButton, 3, 199);

        expect(browser.getCurrentUrl()).toContain('created');
    });
    
});
