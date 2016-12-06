(function() {
    'use strict';

    angular
        .module('manateeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('location', {
            parent: 'entity',
            url: '/location',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Locations'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/location/locations.html',
                    controller: 'LocationController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('location-detail', {
            parent: 'entity',
            url: '/location/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Location'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/location/location-detail.html',
                    controller: 'LocationDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Location', function($stateParams, Location) {
                    return Location.get({id : $stateParams.id});
                }]
            }
        })
        .state('location.new', {
            parent: 'location',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-dialog.html',
                    controller: 'LocationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('location', null, { reload: true });
                }, function() {
                    $state.go('location');
                });
            }]
        })
        .state('location.edit', {
            parent: 'location',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-dialog.html',
                    controller: 'LocationDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Location', function(Location) {
                            return Location.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('location', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('location.delete', {
            parent: 'location',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/location/location-delete-dialog.html',
                    controller: 'LocationDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Location', function(Location) {
                            return Location.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('location', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
