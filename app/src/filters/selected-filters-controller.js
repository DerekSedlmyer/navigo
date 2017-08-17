'use strict';

angular.module('voyager.filters')
    .controller('SelectedFiltersCtrl', function ($scope, filterService, $location, mapUtil, sugar, translateService) {

        function _applyOrFacets() {
            $scope.filters.forEach(function(filter) {
                filter.isOr = filter.name.indexOf('(') === 0;
                if (filter.isOr) {
                    filter.parts = [];
                    var parts = filter.name.replace('(', '').replace(')', '').replace('{!expand}' ,'').trim().split(' ');
                    parts.forEach(function (part) {
                        var facet = {name: part, filter: filter.filter, pretty: part};
                        filter.parts.push(facet);
                        if (filter.filter === 'location') {
                            facet.pretty = translateService.getLocation(part);
                        }
                    });
                }
            });
        }

        function _setSelectedFilters() {
            var params = $location.search();
            $scope.filters = filterService.getFilters().slice(0);

            _applyOrFacets();

            if (params.q && params.q !== '*:*') {
                $scope.filters.push({'isInput': true, 'name': 'search', 'humanized': 'Search:' +params.q, pretty: params.q.replace('{!expand}' ,'')});
            }
            if (params.place) {
                var formattedPlace = params.place;
                var humanized;
                var isBbox = false;
                var isWkt = false;

                if(mapUtil.isBbox(params.place)) {
                    formattedPlace = sugar.formatBBox(params.place);
                    isBbox = true;
                } else {
                    formattedPlace = mapUtil.formatWktForDisplay(params.place);
                    isWkt = true;
                }

                humanized = (params['place.op'] === 'within' ? 'Within' : 'Intersects') + ': ' + formattedPlace;
                $scope.filters.push({'isInput': true, 'name': 'place', 'humanized': humanized, 'isBbox' : isBbox, 'isWkt' : isWkt, pretty: formattedPlace});
            }
            if(params['links.to']) {
                $scope.filters.push({'isInput': false, 'name': 'linksTo', 'humanized': 'Links.To:' + params['links.to'], pretty: params['links.to']});
            }
            if(params['links.from']) {
                $scope.filters.push({'isInput': false, 'name': 'linksFrom', 'humanized': 'Links.From:' + params['links.from'], pretty: params['links.from']});
            }
        }

        function clearPlace(params) {
            delete params.place;
            delete params['place.op'];
            delete params['place.id'];
            return params;
        }

        $scope.removeExpanded = function(term) {
            var exp_exclude = $location.search()['expand.exclude'];
            if(typeof(exp_exclude) === 'undefined') {
                exp_exclude = '';
            }
            exp_exclude += (' ' + term);
            $location.search('expand.exclude', exp_exclude.trim());
            $scope.$emit('removeFilterEvent', {});
        };

        $scope.removeFilter = function(facet) {
            if (facet.name === 'search') {
                $location.search('q', null);
                $scope.$emit('removeFilterEvent', {});
            }
            else if (facet.name === 'place') {
                var filterHumanized = facet.humanized.split(': ');
                filterHumanized.splice(0, 1);
                var args = {isBbox: facet.isBbox, isWkt: facet.isWkt};
                $location.search(clearPlace($location.search()));
                $scope.$emit('removeFilterEvent', args);
            }
            else if (facet.name === 'linksTo' || facet.name === 'linksFrom') {
                var params = $location.search();
                delete params['links.to'];
                delete params['links.from'];
                $location.search(params);
                $scope.$emit('removeFilterEvent', facet);
            }
            else {
                filterService.removeFilter(facet);
                $location.search('fq', filterService.getFilterAsLocationParams());  //remove filter from url
                $scope.$emit('removeFilterEvent', facet);  //fire filter event
            }

            _setSelectedFilters();
        };

        $scope.clearAllFilter = function() {
            var params = $location.search();
            delete params.q;
            delete params.fq;
            $location.search(clearPlace(params));

            filterService.clear();
            $scope.$emit('removeFilterEvent', {});  //fire filter event
            _setSelectedFilters();
        };

        $scope.resetExpanded = function() {
            delete $location.search()['expand.exclude'];
            delete $scope.expanded;
            $scope.$emit('removeFilterEvent', {});
        };


        $scope.$on('filterChanged', function () {
            _setSelectedFilters();
        });

        $scope.$on('searchResults', function (event, data) {
            if(data && data.expansion && 
                data.expansion.terms && 
                _.isArray(data.expansion.terms) && 
                data.expansion.terms.length > 0) 
            {
                $scope.expanded = data.expansion.terms;
            } else {
                delete $scope.expanded;
            }
        });

        // $scope.$on('changeView', function () {
        //     _setSelectedFilters();
        // });

        $scope.$on('clearSearch', function() {
            _setSelectedFilters();  //search cleared, update selected filters
        });

        if($location.search().fq) {
            filterService.setFilters($location.search().fq);
        } else if (angular.isDefined($location.search()['links.to']) || angular.isDefined($location.search()['links.from'])) {
            filterService.clear();  // no fq filters defined on url when loading so clear any the service has stored
        }
        _setSelectedFilters();

    });
