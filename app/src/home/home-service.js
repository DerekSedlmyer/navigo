'use strict';

angular.module('voyager.home')
    .service('homeService', function(config, $http, $q, featureQuery, collectionsQuery) {

        function _collectionsAction(count) {
            if(config.homepage && config.homepage.showSidebarLinks) {
                return collectionsQuery.execute(count);
            } else {
                return $q.when(null);
            }
        }

        return {
            fetchCollections: function(count) {
                return _collectionsAction(count);
            },
            fetchFeatured: function() {
                return featureQuery.execute();
            },

            getFeaturedQuery: function() {
                return featureQuery.getFeatureQuery();
            }
        };

    });

