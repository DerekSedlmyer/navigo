'use strict';

angular.module('voyager.search').
factory('extractionService', function(config, $http, $location, converter, vsModalService, toastr) {
    var service = config.root + 'api/rest/discovery/extraction';

    function _getArgs() {
        var params = _.clone($location.search());
        var args = {q: params.q || '*:*', fq: []};

        if (angular.isDefined(params.fq)) {
            if(_.isArray(params.fq)) {
                args.fq = params.fq;
            } else {
                args.fq.push(params.fq);
            }
        }

        if (angular.isDefined(params.place)) {
            args.fq.push(converter.toPlaceFilter(params));
        }
        return args;
    }

    return {
        updateQueue: function (type) {
            var args = _getArgs();
            var message;
            if (type === 'add') {
                return $http.post(service, {}, {params: args}).then(function() {
                    toastr.success('The current query set has been added to the Extraction Queue for re-indexing.');
                });
            } else if (type === 'replace') {
                message = 'The records in this query will replace items in the indexing queue. Are you sure you want to proceed?';
                vsModalService.showModal('Extraction Queue Replace', message, 'Yes', 'No').then(function(proceed) {
                    if (proceed) {
                        return $http.put(service, {}, {params: args}).then(function() {
                            var statusLink = config.root + 'manage/#/discovery/status/';
                            message = 'The Extraction Queue has been updated and these records are being re-indexed. </br></br>';
                            message += 'Please visit the <a class="status-link" target="_blank" href="' + statusLink + '">Status</a> page in the Management controls to monitor indexing.';
                            toastr.success(message, {timeOut: 6000, extendedTimeOut: 1000});
                        });
                    }
                });
            } else if (type === 'remove') {
                message = 'The records in this query will be removed from the Extraction Queue for reindexing. Are you sure you want to proceed?';
                vsModalService.showModal('Extraction Queue Replace', message, 'Yes', 'No').then(function(proceed) {
                    if (proceed) {
                        return $http.delete(service, {params: args}).then(function () {
                            message = 'The records were removed from the Extraction Queue.';
                            toastr.success(message);
                        });
                    }
                });
            }
        }
    };
});