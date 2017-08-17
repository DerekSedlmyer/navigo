'use strict';

describe('Controller: SearchInpuCtrl', function () {

    var $scope, $timeout, usSpinnerService, $location, $http, $controller, q, element, compile, compiled;
    var cfg = _.clone(config);

    beforeEach(function () {
        module('voyager.home');
        module('voyager.search');
        module('voyager.tagging');
        module('ui.bootstrap');
        module('voyager.config');
        module(function ($provide) {
            $provide.constant('config', cfg);
        });

        inject(function (_$controller_, _$timeout_, _usSpinnerService_, _$location_, $httpBackend , $rootScope, _$q_, $compile) {
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            usSpinnerService = _usSpinnerService_;
            $location = _$location_;
            $http = $httpBackend;
            $controller = _$controller_;
            q = _$q_;
            compile = $compile;
        });

    });

    // Specs here

    function initController() {
        $controller('SearchInputCtrl', {$scope: $scope});
    }

    function initDirective() {
        $scope.search.q = '{!expand}text';
        element = angular.element('<div clean-expand ng-model="search.q"></div>');
        compiled = compile(element)($scope);
        element.scope().$apply();
        $(document.body).append(element);
    }

    it('should init', function () {

        $location.path('/search');
        $location.search({place:'0 0 0 0', 'place.op':'within'});
        initController();

        expect($scope.search.place).toEqual('0.00 0.00 0.00 0.00');
    });

    it('should search', function () {

        $location.path('/search');
        //$location.search({place:'0 0 0 0', 'place.op':'within'});
        initController();

        $scope.search.q = 'text';
        $scope.useExpandedQueries = false;
        $scope.submitSearch();

        var params = $location.search();

        expect(params.q).toBe('text');

    });

    it('should search expanded queries', function () {

        $location.path('/search');
        initController();

        $scope.search.q = 'text';
        $scope.useExpandedQueries = true;
        $scope.submitSearch();

        var params = $location.search();

        expect(params.q).toBe('{!expand}text');

    });

    it('should toggle use expanded', function () {

        $location.path('/search');
        initController();

        $scope.search.q = 'text';
        $scope.useExpandedQueries = true;
        $scope.setUseExpandedQueries();

        expect($scope.useExpandedQueries).toBe(false);

    });

    it('should toggle open expanded', function () {

        $location.path('/search');
        initController();

        $scope.search.q = 'text';
        $scope.queryExpansionOpen = true;
        $scope.openExpanded();

        expect($scope.queryExpansionOpen).toBe(false);

    });

    it('should clean expand query parser from input', function () {

        $location.path('/search');
        initController();
        $scope.search.q = '{!expand}text';
        initDirective();
        element.scope().$apply();
    });


    it('should clear search input', function () {

        $location.path('/search');
        $location.search({place:'0 0 0 0', 'place.op':'within'});
        initController();

        $scope.search.q = 'text';
        $scope.clearField('place', true);

        var params = $location.search();

        expect(params.q).toBeUndefined();
        expect(params.place).toBeUndefined();
    });

    it('should clear search all', function () {

        $location.path('/search');
        $location.search({place:'0 0 0 0', 'place.op':'within'});
        initController();

        $scope.search.q = 'text';
        $scope.$emit('clearSearch');

        var params = $location.search();

        expect(params.q).toBeUndefined();
        expect(params.place).toBeUndefined();
    });

});