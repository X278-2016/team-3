(function() {
    'use strict';
    angular
        .module('manateeApp')
        .factory('Quickinfo', Quickinfo);

    Quickinfo.$inject = ['$resource'];

    function Quickinfo ($resource) {
        var resourceUrl =  'api/quickinfos/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
