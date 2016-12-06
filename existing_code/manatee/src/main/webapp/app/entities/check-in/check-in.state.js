(function() {
    'use strict';

    angular
        .module('manateeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('check-in', {
            parent: 'entity',
            url: '/check-in',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'CheckIns'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/check-in/check-ins.html',
                    controller: 'CheckInController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('check-in-detail', {
            parent: 'entity',
            url: '/check-in/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'CheckIn'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/check-in/check-in-detail.html',
                    controller: 'CheckInDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'CheckIn', function($stateParams, CheckIn) {
                    return CheckIn.get({id : $stateParams.id});
                }]
            }
        })
        .state('check-in.new', {
            parent: 'check-in',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/check-in/check-in-dialog.html',
                    controller: 'CheckInDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                timestamp: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('check-in', null, { reload: true });
                }, function() {
                    $state.go('check-in');
                });
            }]
        })
        .state('check-in.edit', {
            parent: 'check-in',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/check-in/check-in-dialog.html',
                    controller: 'CheckInDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['CheckIn', function(CheckIn) {
                            return CheckIn.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('check-in', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('check-in.delete', {
            parent: 'check-in',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/check-in/check-in-delete-dialog.html',
                    controller: 'CheckInDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['CheckIn', function(CheckIn) {
                            return CheckIn.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('check-in', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
