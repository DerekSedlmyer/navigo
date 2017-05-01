'use strict';

angular.module('voyager.search')
    .component('vsBotSearch', {
        templateUrl: 'src/bot/bot-search.html',
        controller: function(searchService, $location, $scope) {
            var vm = this;
            vm.hasMore = true;

            $scope.$on('$locationChangeSuccess', function() {
                if ($location.path() === '/bot') {
                    var page = $location.search().page;
                    if (angular.isDefined(page) && parseInt(page) !== vm.page) {
                        vm.page = parseInt(page);
                        searchService.setPage(vm.page);
                        _doSearch();
                    }
                }
            });

            vm.$onInit = function() {
                vm.page = 1;
                if (angular.isDefined($location.search().page)) {
                    vm.page = parseInt($location.search().page);
                }
                searchService.setItemsPerPage(50);
                searchService.setPage(vm.page);
                _doSearch();
            };

            function _doSearch() {
                var _params = $location.search();
                searchService.doSearch2(_params).then(function(res) {
                    vm.list = res.data.response.docs;
                    vm.hasMore = vm.list.length === 50;
                });
            }
        }
    });
