<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return ('welcome');
});

Route::post('/api/login', 'LoginController@autenticarUsuario');

include 'Routes/Conductores.php';
include 'Routes/Vehiculos.php';
include 'Routes/Clientes.php';

include('Routes/Empresas.php');
include('Routes/ServiciosEmpresa.php');
