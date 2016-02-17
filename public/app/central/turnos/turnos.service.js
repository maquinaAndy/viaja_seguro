(function() {
    'use strict';

    angular
        .module('app.centrales.turnos')
        .service('turnosService', turnosService);

    function turnosService($http, authService, API){
        this.getConductoresEnRuta = function(ruta_id){
            return $http.get(API + '/conductores/ruta/'+ruta_id);
        }

        this.getRutasCentral = function () {
            return $http.get(API + '/centrales/'+authService.currentUser().central.id+'/rutas');
        }

        this.updateTurnos = function (ruta_id, turnos) {
            return $http.put(API + '/rutas/'+ruta_id+'/turnos', turnos);
        }

        this.getTurno = function(ruta_id){
            return $http.get(API + '/rutas/'+ruta_id+'/turnos');
        }

        this.eliminarTurno = function(obj){
            return $http.post(API +'/rutas/turnos/conductor', obj);
        }

        this.cargarVehiculoConductor = function(id){
            return $http.get(API + '/conductores/'+id+'/vehiculo');
        }

        this.updateCuposVehiculo = function(id, cupo){
            return $http.put(API + '/vehiculos/'+id,cupo);
        }

        //pasajeros
        this.refrescarPasajeros = function (id) {
            return $http.get(API+'/centrales/'+id+'/pasajeros');
        }

        this.asignarPasajero = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/pasajeros', object);
        }

        this.modificarPasajero = function(id, object) {
            return $http.put(API + '/pasajeros/' + id, object);
        }

        this.eliminarPasajero = function(pasajero_id){
            return $http.delete(API + '/pasajeros/'+ pasajero_id);
        }

        //giros
        this.refrescarGiros = function (id) {
            return $http.get(API+'/centrales/'+id+'/giros');
        }

        this.asignarGiro = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/giros', object);
        }

        this.modificarGiro = function(id, object) {
            return $http.put(API + '/giros/' + id, object);
        }

        this.eliminarGiro = function(giro_id){
            return $http.delete(API + '/giros/'+ giro_id);
        }

        //paquetes
        this.refrescarPaquetes = function (id) {
            return $http.get(API+'/centrales/'+id+'/paquetes');
        }

        this.asignarPaquete = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/paquetes', object);
        }

        this.modificarPaquete = function(id, object) {
            return $http.put(API + '/paquetes/' + id, object);
        }

        this.eliminarPaquete = function(paquete_id){
            return $http.delete(API + '/paquetes/'+ paquete_id);
        }
    }
})();
