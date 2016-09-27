/*global angular */
'use strict';

angular.module('voyager.search')
    .controller('SaveSearchDialog', function($scope, $uibModalInstance, savedSearchService, $location, authService, $analytics, recentSearchService, searchItem, displayConfigResource) {

        $scope.savedSearch = {query:searchItem.query};

        var _shareGroups = [];
        var _coreRoles = [{id:'_EVERYONE',text:'EVERYONE'},{id:'_LOGGEDIN',text:'LOGGEDIN'},{id:'_ANONYMOUS',text:'ANONYMOUS'}];

        $scope.sharedOptions = {
            'multiple': true,
            'tags': _shareGroups
        };

        function _loadGroups() {
            if($scope.canAdmin) { // use system groups
                $.merge(_shareGroups, _coreRoles);
                authService.fetchGroups().then(function(groups) {
                    $.merge(_shareGroups, groups);
                });
            } else if ($scope.canShare) {  // use user's groups
                authService.getUserInfo().then(function(user) {
                    var groups = [];
                    _(user.groups).forEach(function(n) {groups.push({id:n,text:n});});
                    $.merge(_shareGroups, groups);
                });
            }
        }

        function _getPrivileges() {
            authService.getPrivileges().then(function() {
                $scope.canAdmin = authService.hasPermission('manage');
                $scope.canSave = authService.hasPermission('save_search');
                $scope.canShare = authService.hasPermission('share_saved_search');

                _loadGroups();
            });
        }

        function _activate() {
            _getPrivileges();
        }

        _activate();

        $scope.ok = function () {

            if (_.isEmpty($scope.savedSearch.title)) {
                return;
            }
            if($scope.savedSearch.makeDefault) {
                $scope.savedSearch.order = new Date().getTime();
            }

            var savedSearchCopy = _.cloneDeep($scope.savedSearch);  //copy so not to alter binding
            savedSearchCopy.share = _.pluck(savedSearchCopy.share,'id');

            var promises = [savedSearchService.fetch(savedSearchCopy), displayConfigResource.getDisplayConfig(savedSearchCopy.config)];

            $q.all(promises).then(function(response) {
                var docs = response[0];
                var dispConfig = response[1].data;
                if (docs.length === 0 || _.contains($scope.error,'Overwrite')) {
                    delete $scope.error;
                    if (docs.length > 0) {
                        savedSearchCopy.id = docs[0].id;
                    }
                    if (savedSearchCopy.view === dispConfig.defaultView) {
                        delete savedSearchCopy.view;  // don't override view if same as disp config default
                    }
                    return _saveSearch(savedSearchCopy);
                } else {
                    var existingSearch = docs[0];
                    if (existingSearch.owner === authService.getUser().id || authService.hasPermission('manage')) {
                        $scope.error = 'Saved Search exists. Overwrite?';
                    } else {
                        $scope.error = 'Saved Search exists. You don\'t have permission to overwrite. Please rename your search.';
                    }
                }
            });

            savedSearchService.fetch(savedSearchCopy).then(function(docs) {
                if (docs.length === 0 || _.contains($scope.error,'Overwrite')) {
                    delete $scope.error;
                    if (docs.length > 0) {
                        savedSearchCopy.id = docs[0].id;
                    }
                    return _saveSearch(savedSearchCopy);
                } else {
                    var existingSearch = docs[0];
                    if (existingSearch.owner === authService.getUser().id || authService.hasPermission('manage')) {
                        $scope.error = 'Saved Search exists. Overwrite?';
                    } else {
                        $scope.error = 'Saved Search exists. You don\'t have permission to overwrite. Please rename your search.';
                    }
                }
            });

        };

        function _saveSearch(savedSearch) {
            return savedSearchService.saveSearch(savedSearch, searchItem).then(function(response) {

                $uibModalInstance.close();
                $analytics.eventTrack('saved-search', {
                    category: 'save'
                });

                recentSearchService.updateSearchID(searchItem, response.data);

                //TODO this should not submit event, just return success to controller using it
                $scope.$emit('saveSearchSuccess', response.data);

            }, function(error) {
                console.log(error.data);
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
        };

        $scope.handleEnter = function(ev) {
            delete $scope.error;
            if (ev.which === 13) {
                $scope.ok();
            }
        };

    });
