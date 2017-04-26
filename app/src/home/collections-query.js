'use strict';

angular.module('voyager.home')
    .service('collectionsQuery', function(config, $http) {

        function _getQueryString(count) {
            var rows = 1000;
            var label = config.homepage.sidebarLinksLabel;
            var queryString = config.root + 'solr/ssearch/select?fq=labels:' + label + '&fl=id,title,query,display:[display],*';
            if (count) {
                queryString += ',count:[count]';
            }
            queryString += '&rows=' + rows + '&rand=' + Math.random();
            queryString += '&wt=json&json.wrf=JSON_CALLBACK&block=false';
            queryString += '&sort=order desc';
            return queryString;
        }

        function _execute(count) {
            return $http.jsonp(_getQueryString(count)).then(function (data) {
                return data.data.response.docs;
            }, function(error) {
                return error;
            });
        }

        return {
            execute: function(count) {
                return _execute(count);
            }
        };

    });

