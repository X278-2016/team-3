(function() {
    'use strict';

    angular
        .module('manateeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('quickinfo', {
            parent: 'entity',
            url: '/quickinfo',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Quickinfos'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/quickinfo/quickinfos.html',
                    controller: 'QuickinfoController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('quickinfo-detail', {
            parent: 'entity',
            url: '/quickinfo/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Quickinfo'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/quickinfo/quickinfo-detail.html',
                    controller: 'QuickinfoDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Quickinfo', function($stateParams, Quickinfo) {
                    return Quickinfo.get({id : $stateParams.id});
                }]
            }
        })
        .state('quickinfo.new', {
            parent: 'quickinfo',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quickinfo/quickinfo-dialog.html',
                    controller: 'QuickinfoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                mrn: null,
                                name: null,
                                roomNum: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('quickinfo', null, { reload: true });
                }, function() {
                    $state.go('quickinfo');
                });
            }]
        })
        .state('quickinfo.edit', {
            parent: 'quickinfo',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quickinfo/quickinfo-dialog.html',
                    controller: 'QuickinfoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Quickinfo', function(Quickinfo) {
                            return Quickinfo.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('quickinfo', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('quickinfo.delete', {
            parent: 'quickinfo',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quickinfo/quickinfo-delete-dialog.html',
                    controller: 'QuickinfoDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Quickinfo', function(Quickinfo) {
                            return Quickinfo.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('quickinfo', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
