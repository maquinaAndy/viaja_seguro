(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .service('planillasService', planillasService);

    function planillasService($http, authService, API){
        this.getPagoPlanilla = function(){
            var req = $http.get(API+'/api/centrales/'+authService.currentUser().central.id+'/planillas');
            return req;
        }

        this.getPlanilla = function(viaje){
            return $http.get(API+ '/api/empresa/pagos/planilla/'+viaje);
        }

        this.getDeducciones = function(){
            return $http.get(API + '/api/empresas/'+ authService.currentUser().central.empresa.id+'/deducciones');
        }
    }
})();
