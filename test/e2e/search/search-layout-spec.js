'use strict';

describe('Search', function() {

    var Util = require('../../lib/util.js');

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
    
});
