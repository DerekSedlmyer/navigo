'use strict';

describe('portalApp', function() {

    var $rootScope, $state, $injector, $http;

    beforeAll( function(){
        window.onbeforeunload = function() { return '';};
    });

    beforeEach(function() {
        module('templates');
        module('portalApp');

        inject(function(_$rootScope_, _$state_, _$injector_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $injector = _$injector_;
            $http = _$httpBackend_;
        });
    });

    it('should goto login when no permissions', function() {
        $http.expectGET(new RegExp('auth')).respond({});

        $state.go('search');

        //TODO why 3 auth calls
        $http.expectGET(new RegExp('auth')).respond({});
        $http.expectGET(new RegExp('auth')).respond({});
        //$http.expectGET(new RegExp('auth')).respond({});

        $http.flush();

        expect($state.current.name).toBe('login');
    });

    it('should goto home when view permissions', function() {
        $http.expectGET(new RegExp('auth')).respond({});

        $state.go('search');

        $http.expectGET(new RegExp('auth')).respond({permissions:{view:true}});
        $http.expectGET(new RegExp('location')).respond({});
        $http.expectGET(new RegExp('federation')).respond({servers:[]});
        $http.expectGET(new RegExp('maps')).respond({});
        $http.expectJSONP(new RegExp('search')).respond({response:{docs:[]}});

        $http.flush();

        expect($state.current.name).toBe('home');
    });

    it('should goto details', function() {
        $http.expectGET(new RegExp('auth')).respond({});

        $state.go('details');

        $http.expectGET(new RegExp('auth')).respond({permissions:{view:true}});
        $http.expectGET(new RegExp('location')).respond({});
        $http.expectGET(new RegExp('federation')).respond({servers:[]});
        $http.expectGET(new RegExp('maps')).respond({});
        $http.expectJSONP(new RegExp('search')).respond({response:{docs:[]}});

        $http.flush();

        expect($state.current.name).toBe('home');
    });

    it('should not goto queue when no process permission', function() {
        $http.expectGET(new RegExp('auth')).respond({});

        $state.go('queue');

        $http.expectGET(new RegExp('auth')).respond({permissions:{view:true}});
        $http.expectGET(new RegExp('location')).respond({});
        $http.expectGET(new RegExp('federation')).respond({servers:[]});
        $http.expectGET(new RegExp('maps')).respond({});
        $http.expectJSONP(new RegExp('search')).respond({response:{docs:[]}});

        $http.flush();

        expect($state.current.name).toBe('home');
    });

    it('should relay root scope events', function() {
        spyOn($rootScope, '$broadcast');
        $rootScope.$emit('searchEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('doSearch', {});

        $rootScope.$emit('bboxChangeEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('updateBBox', {});

        $rootScope.$emit('saveSearchSuccess', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('updateSearchSaveStatus', {});

        $rootScope.$emit('removeFilterEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('removeFilter', {});

        $rootScope.$emit('clearSearchEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('clearSearch', {});

        $rootScope.$emit('clearBboxEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('clearBbox', {});

        $rootScope.$emit('changeViewEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('changeView', {});

        $rootScope.$emit('searchComplete', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('searchResults', {});

        $rootScope.$emit('addAllToCartEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('addAllToCart', {});

        $rootScope.$emit('removeAllCartEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('removeAllCart', {});

        $rootScope.$emit('searchDrawingTypeChanged', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('updateDrawingTool', {});

        $rootScope.$emit('drawingToolChanged', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('updateSearchDrawingType', {});

        $rootScope.$emit('searchTypeChanged', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('updateSearchType', {});

        $rootScope.$emit('taskStatusEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('taskStatusChanged', {});

        $rootScope.$emit('resultHoverEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('resultHover', {});

        $rootScope.$emit('filterEvent', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('filterChanged', {});

        $rootScope.$emit('selectedDrawingTypeChanged', {});
        expect($rootScope.$broadcast).toHaveBeenCalledWith('drawingTypeChanged', {});

    });

});