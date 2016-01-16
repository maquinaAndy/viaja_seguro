app.controller('VehiculosController', function ($scope, VehiculoServicio) {
    $scope.Vehiculos = [];
    $scope.vehiculo = {};

    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarVehiculos();

    function initialize(){
        $scope.vehiculo = {
            placa: "",
            modelo: ""
        }
    }

    function cargarVehiculos() {
        var promiseGet = VehiculoServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Vehiculos = pl.data;
            Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
        },function (errorPl) {
            Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
        });
    }

    $scope.nuevoVehiculo = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Vehiculo = {};
        $scope.titulo = "Registrar nuevo vehiculo";
        $("#modalNuevoVehiculo").openModal();
    }

    $scope.buscarConductor = function(){
        $scope.titulo = "Registrar vehiculo";
        $("#modalBuscarconductor").openModal();
    }

    $scope.modificar = function  (vehiculo) {
        $scope.editMode = true;
        $scope.titulo = "Modificar vehiculo"
        $scope.active = "active";
        $scope.Vehiculo = vehiculo;
        $("#modalNuevoVehiculo").openModal();
    };

    $scope.selectConductor = function (conductor){
        $scope.Vehiculo.conductor = conductor.id;
        $scope.Vehiculo.nombreConductor = conductor.nombres + " " + conductor.apellidos;
        $scope.active = 'active';
        $("#modalBuscarconductor").closeModal();
    }

    $scope.eliminar = function (deduccion){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            success(1);
            //centralesService.delete(codigo).then(success, error);
        }
        function success(p) {
            //init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            cconsole.log('Error al eliminar', error);
        }
    }
})