'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');
    var searchPage = require('../../pages/search-page.js');
    var detailsPage = require('../../pages/details-page.js');

    var server = Util.getServer();

    it('should add a result item to the cart', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var addToCart = searchPage.getAddItemToCartButton();   
        var cartCount = searchPage.getCartCount();
        var cartDropdown = searchPage.getCartDropdown();
        var clearCartButton = searchPage.getClearCartButton();

        Util.patientClick(cartDropdown, 3, 100);
        Util.patientClick(clearCartButton, 3, 100);
        Util.waitForSpinner();
        Util.patientClick(addToCart, 3, 100);
        Util.waitForSpinner();
        expect(cartCount.getText()).toEqual('1');
        Util.patientClick(cartDropdown, 3, 100);
        Util.patientClick(clearCartButton, 3, 100);
        Util.waitForSpinner();
        expect(cartCount.getText()).toEqual('0');

    });

    it('should add a result item to the cart in grid view', function() {

        browser.get(server + '/search?view=grid&disp=default');
        Util.waitForSpinner();
        expect(element(by.css('[ui-view="grid-results"]')).isPresent()).toBeTruthy();
        Util.waitForSpinner();

        var addToCart = searchPage.getAddItemToCartButton();   
        var cartCount = searchPage.getCartCount();
        var cartDropdown = searchPage.getCartDropdown();
        var clearCartButton = searchPage.getClearCartButton();
        var firstResult = searchPage.getFirstResult();

        Util.patientClick(cartDropdown, 3, 100);
        Util.patientClick(clearCartButton, 3, 100);
        browser.actions().mouseMove(firstResult).perform();
        Util.patientClick(addToCart, 3, 100);
        expect(cartCount.getText()).toEqual('1');
        Util.patientClick(cartDropdown, 3, 100);
        Util.patientClick(clearCartButton, 3, 100);
        expect(cartCount.getText()).toEqual('0');
    });

    it('should open details of a featured item via the items title', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var firstFeaturedItem = searchPage.getItemTitle();   

        Util.waitForSpinner();     
        Util.patientClick(firstFeaturedItem, 3, 100);

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('show?id=');
    
    });

    it('should open details of a featured item via the items thumbnail', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var firstFeaturedItemThumbnail = searchPage.getItemThumbnail();   

        Util.waitForSpinner();     
        Util.patientClick(firstFeaturedItemThumbnail, 3, 100);

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('show?id=');
    
    });

    it('should open details, then go back to results and maintain query', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var filterPanel = searchPage.getFilterPanel();
        Util.patientClick(filterPanel, 3, 100);

        var filterCategory = searchPage.getFilterCategory(0);
        Util.patientClick(filterCategory, 3, 100);

        var checkBoxFacet = searchPage.getCheckboxFacet();
        Util.patientClick(checkBoxFacet, 3, 100);
        
        expect(browser.getCurrentUrl()).toContain('&fq=');

        var firstFeaturedItemThumbnail = searchPage.getItemThumbnail();   

        Util.waitForSpinner();     
        Util.patientClick(firstFeaturedItemThumbnail, 3, 100);

        Util.waitForSpinner();   
        expect(browser.getCurrentUrl()).toContain('show?id=');

        var returnToSearchButton = detailsPage.getReturnToSearchButton();
        Util.patientClick(returnToSearchButton, 3, 100);

        expect(browser.getCurrentUrl()).toContain('&fq=');
    });

    it('should search using the OR keyword ', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'format:application/pdf or format:image/tiff';
        var format1Count = 0;
        var format2Count = 0;
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        expect(browser.getCurrentUrl()).toContain('format:application%2Fpdf%20or%20format:image%2Ftiff');

        searchPage.getResults().then(function(){
            searchPage.getResults().map(function(elm){
                return elm.getText();
            }).then(function(texts){
                texts.forEach(function(text){
                    var format = (text.split('\n')[1]).substring(8);
                    if(format === 'PDF'){
                        format1Count++;
                    }
                    else if(format === 'TIFF'){
                        format2Count++;
                    }
                });
                expect(format1Count).toBeGreaterThan(0);
                expect(format2Count).toBeGreaterThan(0);
            });
        });
    });

    it('should test the negate query', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = '-format:application/vnd.esri.shapefile';
        var format1Count = 0;
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        var results = searchPage.getResults().then(function(){
            searchPage.getResults().map(function(elm){
                return elm.getText();
            }).then(function(texts){
                texts.forEach(function(text){
                    var format = (text.split('\n')[1]).substring(8);
                    if(format === 'SHP'){
                        format1Count++;
                    }
                });
                expect(format1Count).toBe(0);
            });
        });
    });

    it('should search using the * keyword', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'count*';
        var format1Count = 0;
        var format2Count = 0;
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        expect(browser.getCurrentUrl()).toContain('q=count*');

        var results = searchPage.getResults().then(function(){
            searchPage.getResults().map(function(elm){
                return elm.getText();
            }).then(function(texts){
                texts.forEach(function(text){
                    var format = (text.split('\n')[0]);
                    if(format.toLowerCase().includes('countries')){
                        format1Count++;
                    }
                    else if(format.toLowerCase().includes('counties')){
                        format2Count++;
                    }
                });
                expect(format1Count).toBeGreaterThan(0);
                expect(format2Count).toBeGreaterThan(0);
            });
        });
    });

    it('should search using multi-word keyword', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'name:"Data Set"';
        var correctTitle = false;
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();

        searchPage.getResults().then(function(){
            searchPage.getResults().map(function(elm){
                return elm.getText();
            }).then(function(texts){
                texts.forEach(function(text){
                    var title = (text.split('\n')[0]);
                    if(title.includes('Data Set')){
                        correctTitle = true;
                    }
                });
                expect(correctTitle).toBeTruthy();
            });
        });
    });

    it('should search using the [* TO *] query', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'author:[* TO *]';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(0);
    });

    it('should search a single wildcard query using ?', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'n3?';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(10);
        expect(results).toBeLessThan(50);
    });

    it('should search using escaped special characters', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'count*';

        searchInput.sendKeys(searchString);
        Util.sendEnter();
        Util.waitForSpinner();   

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(3000);

        searchInput.clear().then(function(){
            var searchString2 = 'count\\*';
            searchInput.sendKeys(searchString2);
            Util.sendEnter();

            Util.waitForSpinner();   
            var results2 = searchPage.getResultsCount();
            expect(results2).toBeLessThan(50);
        });
    });

    it('should test the AND query', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'geometry_type:Point and format_type:File';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(0);
        expect(results).toBeLessThan(100);
    });

    it('should test the relative path query', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'path:shp';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   

        expect(browser.getCurrentUrl()).toContain('path:shp');

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(0);
        
    });
    
    it('should test the absolute path query', function() {
        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchInput = searchPage.getSearchInput();
        var searchString = 'path=Z:\\TestData\\test\\shp\\';
        
        searchInput.sendKeys(searchString);
        Util.sendEnter();

        Util.waitForSpinner();   
        
        expect(browser.getCurrentUrl()).toContain('path%3DZ:%5CTestData%5Ctest%5Cshp');

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(0);
        
    });

    it('should search test searching WITHIN a location', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var placefinderInput = searchPage.getPlacefinderInput();    
        var placeString = 'Australia';

        placefinderInput.sendKeys(placeString);
        Util.sendEnter();

        expect(browser.getCurrentUrl()).toContain('place=Australia');
        expect(browser.getCurrentUrl()).toContain('place.op=within');

        var results = searchPage.getResultsCount();
        expect(results).toBeLessThan(100);
    });

    it('should search test searching INTERSECTS', function() {

        browser.get(server + '/search');
        Util.waitForSpinner();

        var searchTypeButton = searchPage.getSearchTypeButton();    
        var intersectsOption = searchPage.getIntersectsOption();

        Util.patientClick(searchTypeButton, 3, 100);
        Util.patientClick(intersectsOption, 3, 100);
        
        expect(searchTypeButton.getText()).toEqual('Intersects');

        var placefinderInput = searchPage.getPlacefinderInput();    
        var placeString = 'Australia';

        placefinderInput.sendKeys(placeString);
        Util.sendEnter();

        Util.waitForSpinner();
        expect(browser.getCurrentUrl()).toContain('place=Australia');
        expect(browser.getCurrentUrl()).toContain('place.op=intersects');

        var results = searchPage.getResultsCount();
        expect(results).toBeGreaterThan(120);
    });

    

    /* it('should search test Bulk Field Editing', function() {

        browser.get(server + '/search?disp=ace4bb77&view=card&filter=true&fq=geometry_type:Multipoint&place=Galapagos%20Islands,%20Ecuador');
        Util.waitForSpinner();

        Util.loginToVoyager('admin', 'admin');
        Util.waitForSpinner();

        var resultsButton = searchPage.getAddToQueueLink();
        var editFields = searchPage.getEditFieldButton();

        Util.waitForSpinner();
        
        browser.actions()
            .mouseMove(resultsButton).click()
            .mouseMove(editFields).click()
            .perform();
        
        var confirm = searchPage.getFlagConfirmButton();
        
        Util.patientClick(confirm, 3, 100);
        Util.waitForSpinner();

        var flag = searchPage.getFirstFlag();
        expect(flag.isPresent()).toBeFalsy();
    }); */

    it('should add all to queue', function() {
        searchPage.addAllToQueue('*:*');
    });

    it('should test downloading an item from the tools dropdown', function() {

        browser.get(server + '/search?disp=ace4bb77&fq=format:application%5C%2Fvnd.openxmlformats%5C-officedocument.wordprocessingml.document');
        Util.waitForSpinner();

        var firstResult = searchPage.getFirstResult();

        var toolsDropdown = searchPage.getToolsDropdown(firstResult);

        Util.patientClick(toolsDropdown, 3, 100);

        var downloadButton = searchPage.getDropdownOption('Download');

        expect((downloadButton).isDisplayed()).toBeTruthy();
    });
    
});
