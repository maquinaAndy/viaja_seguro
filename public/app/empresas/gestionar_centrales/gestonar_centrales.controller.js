/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .controller('CentralesController', CentralesController);

    function CentralesController(centralesService, authService) {
        var vm = this;
        vm.editMode = false;

        vm.actualizar = actualizar;
        vm.guardar = guardar;
        vm.generarDatosAcceso = generarDatosAcceso;
        vm.nuevo = nuevo;
        vm.update = update;
        vm.eliminar = eliminar;
        vm.agregarDireccion = agregarDireccion;
        vm.openCiudades = openCiudades;
        vm.openCiudades = openCiudades;
        vm.selecionarCiudad = selecionarCiudad;

        loadCentrales();

        function nuevo(){
            vm.selectedCentral = {};
            vm.selectedCentral.usuario = {};
            vm.nombreForm = "Nueva Central";
            vm.active = "";
            vm.editMode = false;
            $("#modalNuevaCentral").openModal();
            ubicacionActual();
        }

        function guardar(){
            centralesService.post(vm.selectedCentral).then(success, error);
            function success(p) {

                $("#modalNuevaCentral").closeModal();
                vm.selectedCentral = p.data;
                vm.centrales.push(vm.selectedCentral);
                init();
                Materialize.toast('Registro guardado correctamente', 5000);
            }
            function error(error) {
                console.log('Error al guardar', error);
            }
        }

        function generarDatosAcceso(){
            vm.selectedCentral.usuario.nombre = (
            authService.currentUser().empresa.nombre.toLowerCase()+
            '_'+vm.selectedCentral.ciudad.nombre.toLowerCase()+
            '_'+Math.floor((Math.random() * (999 - 101 + 1)) + 101)).replace(/\s+/g, '');
            vm.selectedCentral.usuario.contrasena = vm.selectedCentral.usuario.nombre;
        }

        function actualizar(central){
            vm.selectedCentral = central;
            vm.editMode = true;
            vm.nombreForm = "Modificar Central";
            vm.active = "active";
            $("#modalNuevaCentral").openModal();
            cargarLocalizacion(central);
        }

        function update(){
            centralesService.put(vm.selectedCentral, vm.selectedCentral.id).then(success, error);
            function success(p) {
                $("#modalNuevaCentral").closeModal();
                loadCentrales();
                vm.editMode = false;
                Materialize.toast('Registro modificado correctamente', 5000);
            }
            function error(error) {
                console.log('Error al actualizar', error);
            }
        }

        function eliminar(id){
            if(confirm('¿Deseas eliminar el registro?') ==true) {
                centralesService.delete(id).then(success, error);
            }
            function success(p) {
                loadCentrales()
                Materialize.toast('Registro eliminado', 5000);
            }
            function error(error) {
                console.log('Error al eliminar', error);
            }
        }

        function agregarDireccion() {
            if(vm.selectedCentral.ciudad.nombre == ''){
                Materialize.toast('No ha seleccionado ninguna ciudad', '5000', 'rounded');
            }else{
                var direccion = vm.selectedCentral.ciudad.nombre + " " + vm.selectedCentral.direccion;
                if (direccion !== '') {
                    crearDireccion(direccion, function(marker) {
                        vm.selectedCentral.miDireccionLa = marker.latitude;
                        vm.selectedCentral.miDireccionLo = marker.longitude;
                        console.log(vm.selectedCentral.miDireccionLo)
                    });
                }
            }
        };

        function openCiudades(){
            if(!vm.editMode) {
                loadCiudades();
                $("#modalSeleccionarCiudad").openModal();
            }
        }

        function selecionarCiudad(ciudad){
            vm.selectedCentral.ciudad = ciudad;
            $("#modalSeleccionarCiudad").closeModal();
        }

        function loadCiudades(){
            if(!vm.ciudades) {
                centralesService.getCiudades().then(success, error);
            }
            function success(p) {vm.ciudades = p.data;}
            function error(error) {console.log('Error al cargar la ciudades', error);}
        }

        function loadCentrales(){
            vm.centrales = [];
            centralesService.getAll().then(success, error);
            function success(p) {
                vm.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar datos', error);
            }
        }

        function cargarLocalizacion(central){
            vm.map = {
                center: new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo),
                zoom: 15,
                markers: [],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var coordenada1 = new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo);
            var map = new google.maps.Map($("#dvMap")[0], vm.map);
            var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:"Tu direcion"});
        }

        function crearDireccion(direccion) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : direccion}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var firstAddress = results[0];
                    var latitude = firstAddress.geometry.location.lat();
                    var longitude = firstAddress.geometry.location.lng();
                    vm.selectedCentral.miDireccionLa = latitude;
                    vm.selectedCentral.miDireccionLo = longitude;
                    vm.map = {
                        center: new google.maps.LatLng(latitude, longitude),
                        zoom: 15,
                        markers: [],
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var coordenada1 = new google.maps.LatLng(latitude, longitude);
                    var map = new google.maps.Map($("#dvMap")[0], vm.map);
                    var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:direccion});
                    return coordenada1;
                } else {
                    alert("Dirección desconocida: " + direccion);
                }
            });
        }

        function ubicacionActual() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    vm.selectedCentral.miDireccionLa = position.coords.latitude;
                    vm.selectedCentral.miDireccionLo = position.coords.longitude;
                    vm.map = {
                        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        zoom: 15,
                        markers: [],
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var coordenada1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var map = new google.maps.Map($("#dvMap")[0], vm.map);
                    var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:"Tu direcion"});
                });
            } else {
                alert('No se pudo localizar su posicion');
            }
        }
    }
})();