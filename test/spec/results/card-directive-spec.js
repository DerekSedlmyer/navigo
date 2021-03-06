describe('Card Directive:', function () {
    'use strict';

    var cfg = _.clone(config);

    beforeEach(function () {
        module('templates');
        // module('voyager.common'); //auth service module - apparently this is needed to mock the auth service
        module('voyager.results');
        module('voyager.security');
        module('voyager.filters');
        module('cart');
        module('angulartics');
        module('ui.bootstrap');
        module(function ($provide) {
            $provide.constant('config', cfg);
        });
    });

    var scope, $timeout, httpMock, compile, $q, element, compiled, controller, cartService, $location, inView, configService;

    function initDirective() {

        httpMock.expectGET(new RegExp('auth')).respond({}); //auth info call

        element = angular.element('<div vs-card></div>');
        compiled = compile(element)(scope);
        element.scope().$apply();
        controller = element.controller(scope);
    }

    beforeEach(inject(function ($compile, $rootScope, _$timeout_, $httpBackend, _$q_, _cartService_, _$location_, _inView_, _configService_, _authService_) {
        scope = $rootScope.$new();
        $timeout = _$timeout_;
        httpMock = $httpBackend;
        compile = $compile;
        $q = _$q_;
        cartService = _cartService_;
        $location = _$location_;
        inView = _inView_;
        configService = _configService_;
        spyOn(_authService_, 'getUser').and.returnValue({id:'id'});
    }));


    describe('Render', function () {

        it('should render card', function () {
            scope.doc = {id:'id', canCart:true, hasDownload:true, isService: true, download: 'file://file', geo:'geo'};

            spyOn(inView,'remove').and.callThrough();

            initDirective();

            expect(element.html()).toContain('card_inner');

            inView.check();

            expect(inView.remove).toHaveBeenCalled();
        });

        it('should toggle cart', function () {
            scope.doc = {id:'id', canCart:true};

            spyOn(cartService,'addItem');

            initDirective();

            scope.toggleCart(scope.doc);

            expect(scope.doc.inCart).toBeTruthy();

            scope.toggleCart(scope.doc);

            expect(scope.doc.inCart).toBeFalsy();
        });

        it('should apply tag', function () {
            scope.doc = {id:'id', canCart:true};

            $location.path('/search');

            initDirective();

            scope.applyTag('tag');

            expect($location.search().fq).toEqual('tag_flags:tag');

        });

        it('should apply filter', function () {
            scope.doc = {id:'id', canCart:true};

            $location.path('/search');

            initDirective();

            scope.applyFilter('foo', 'bar');

            expect($location.search().fq).toEqual(['foo:bar']);

        });

        it('should toggle on addAll event', function () {
            scope.doc = {id:'id', canCart:true};

            initDirective();

            scope.$emit('addAllToCart');

            expect(scope.doc.inCart).toBeTruthy();
        });

        it('should toggle on remove all event', function () {
            scope.doc = {id:'id', canCart:true};

            initDirective();

            scope.$emit('removeAllCart');

            expect(scope.doc.inCart).toBeFalsy();
        });

        it('should sync card', function () {
            scope.doc = {id:'id', canCart:true, inCart:true};

            initDirective();

            scope.$emit('syncCard');

            expect(scope.cartAction).toBe('Remove');

            scope.doc.inCart = false;

            scope.$emit('syncCard');

            expect(scope.cartAction).toBe('Add');
        });

        it('should perform actions', function () {
            scope.doc = {id:'id', canCart:true, hasDownload:true, isService: true, download: 'file://file', geo:'geo'};

            initDirective();

            scope.actions[0].do();
            scope.actions[1].do();
        });

        it('should format fields', function () {
            var doc = {id:'id', canCart:true, hasDownload:true, isService: true, download: 'file://file', geo:'geo', format: 'audio/mpeg', modified: '1978-09-14T20:47:24Z', somedate: '2014-10-31T20:47:24Z', notexist: 'fooooo'};
            var facet = {field: 'format'};
            scope.doc = doc;
            initDirective();
            var formatted = scope.formatField(doc, facet);
            expect(formatted).toBeDefined();
            expect(formatted).toBe('MP3');

            facet = {field: 'modified'};
            formatted = scope.formatField(doc, facet);
            expect(formatted).toBeDefined();

            facet = {field: 'somedate'};
            formatted = scope.formatField(doc, facet);
            expect(formatted).toBeDefined();

            facet = {field: 'notexist'};
            formatted = scope.formatField(doc, facet);
            expect(formatted).toBe('fooooo');

        });

        //it('should toggle map mode', function () {
        //    scope.displayFormat = 'detail_format';
        //    initDirective();
        //    expect(element.hasClass('dragging_disabled')).toBeTruthy();
        //
        //    scope.displayFormat = 'short_format';
        //    scope.$apply();
        //
        //    $timeout.flush();
        //
        //    expect(element.hasClass('dragging_disabled')).toBeFalsy();
        //});
        //
        //it('should zoom', function () {
        //    initDirective();
        //
        //    scope.zoomIn($.Event( 'click' ));
        //
        //    scope.zoomOut($.Event( 'click' ));
        //});
        //
        //it('should toggle display format', function () {
        //    initDirective();
        //
        //    scope.toggleDisplayFormat('Card', $.Event('click'));
        //
        //    expect(scope.selectedMapType).toBe('Card');
        //});
        //
        //it('should draw rectangle', function () {
        //    scope.selectedDrawingType = 'Intersects';
        //    scope.displayFormat = 'detail_format';
        //
        //    spyOn(leafletData,'getMap').and.callThrough();
        //
        //    initDirective();
        //
        //    scope.drawRectangle('within', $.Event('click'));
        //
        //    scope.$apply();
        //    $timeout.flush();
        //
        //    expect(scope.selectedDrawingType).toBe('Within');
        //    expect(leafletData.getMap).toHaveBeenCalled();
        //
        //});
        //
        //it('should resize', function () {
        //    scope.selectedDrawingType = 'Intersects';
        //    scope.displayFormat = 'detail_format';
        //
        //    spyOn(leafletData,'getMap').and.callThrough();
        //
        //    // TODO function in outer scope, fix this
        //    scope.toggleMap = function(){};
        //
        //    initDirective();
        //
        //    scope.resize();
        //
        //    scope.$apply();
        //    $timeout.flush();
        //
        //    expect(scope.selectedDrawingType).toBe('Intersects');
        //    expect(leafletData.getMap).toHaveBeenCalled();
        //});
    });

});