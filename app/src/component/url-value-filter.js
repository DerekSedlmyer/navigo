/*global angular */

angular.module('voyager.component')
    .filter('urlValue', function(sugar) {
        'use strict';
        var urlValueFilter = function(input) {
            if(sugar.isUrl(input)) {
                return '<a href="' + input + '" target="_blank">'+input+'</a>';
            }
            return input;
        };
        return urlValueFilter;
    });
