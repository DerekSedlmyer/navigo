'use strict';

angular.module('taskRunner')
    .directive('vsListParam', function ($compile, authService, savedSearchService) {
        return {
            replace: true,
            scope: {
                param: '=',
                show: '=',
                list: '@list',
                multi: '='
            },
            template:'<input type="hidden" ui-select2="listOptions" ng-model="param.value" ng-change="onChange()" style="width: 50%">',
            controller: function ($scope, $element, $attrs) {
                var _options = [];
                var _searches = [];
                var _coreRoles = [{id:'_EVERYONE',text:'EVERYONE'},{id:'_LOGGEDIN',text:'LOGGEDIN'},{id:'_ANONYMOUS',text:'ANONYMOUS'}];
                var isMultiple = $attrs.multi !== 'false';

                if (!!$scope.multi === false) {
                    $scope.onChange = function() {
                        if (angular.isDefined($scope.param.value) && $scope.param.value.length > 1) {
                            $scope.param.value = [$scope.param.value[1]];
                        }
                    };
                }


                if (!!$scope.multi === false) {
                    $scope.listOptions = {
                        multiple: isMultiple,
                        dropdownAutoWidth: true,
                        minimumResultsForSearch: 5,
                        tags: _searches
                    }
                }
                else {
                    $scope.listOptions = {
                        multiple: isMultiple,
                        simple_tags: true,
                        dropdownAutoWidth: true,
                        minimumResultsForSearch: 5,
                        data: function() {
                            return {results:_options};
                        }
                    };
                }

                if (!!$scope.multi === false){
                    savedSearchService.getSavedSearches().then(function(savedSearches) {
                        var sortedSavedSearches = savedSearchService.sortSavedSearches(savedSearches);
                        angular.forEach(sortedSavedSearches.personal, function(value){
                            if(_searches.indexOf(value['title']) === -1) {
                                _searches.push(value['title']);
                            }
                        });
                    });

                }


                if ($scope.list == 'permissions'){
                    authService.getPrivileges().then(function() {
                        if (authService.hasPermission('manage')) {
                            $.merge(_options, _coreRoles);
                            authService.fetchGroups().then(function(groups) {
                                $.merge(_options, groups);
                            });
                        }
                        else {
                            authService.fetchGroups().then(function(groups) {
                                $.merge(_options, groups);
                            });
                        }
                    });
                }
            }
        };
    });