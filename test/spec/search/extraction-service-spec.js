'use strict';

describe('extractionService', function () {

    var $http, $q, extractionService, toastr;

    var cfg = _.clone(config);

    beforeEach(function () {
        module('voyager.modal');
        module('voyager.search');
        module(function ($provide) {
            $provide.constant('config', cfg);
        });

        inject(function (_$httpBackend_, _$q_, _extractionService_, vsModalService, _toastr_) {
            $http = _$httpBackend_;
            $q = _$q_;
            extractionService = _extractionService_;
            vsModalService.showModal = function() {
                return $q.when(true);
            };
            toastr = _toastr_;
        });
    });

    // Specs here

    it('should add to queue', function () {

        spyOn(toastr, 'success');

        extractionService.updateQueue('add');

        $http.expectPOST(new RegExp('extraction')).respond({});

        $http.flush();

        expect(toastr.success).toHaveBeenCalled();
    });

    it('should replace queue', function () {

        spyOn(toastr, 'success');

        extractionService.updateQueue('replace');

        $http.expectPUT(new RegExp('extraction')).respond({});

        $http.flush();

        expect(toastr.success).toHaveBeenCalled();

    });

    it('should remove queue', function () {

        spyOn(toastr, 'success');

        extractionService.updateQueue('remove');

        $http.expectDELETE(new RegExp('extraction')).respond({});

        $http.flush();

        expect(toastr.success).toHaveBeenCalled();

    });
});