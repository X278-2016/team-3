(function() {
    'use strict';
    angular
        .module('manateeApp')
        .factory('CheckIn', CheckIn);

    CheckIn.$inject = ['$resource', 'DateUtils'];

    function CheckIn ($resource, DateUtils) {
        var resourceUrl =  'api/check-ins/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.timestamp = DateUtils.convertDateTimeFromServer(data.timestamp);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
