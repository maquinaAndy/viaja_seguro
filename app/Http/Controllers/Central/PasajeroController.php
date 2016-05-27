<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\NotificacionController;
use App\Model\Central;
use App\Model\Conductor;
use App\Model\Pasajero;
use App\Model\Rol;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PasajeroController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($conductor_id)
    {
        try{
            $pasajeros = Conductor::find($conductor_id)->pasajeros;
            if(!$pasajeros){
                return response()->json(array('message' => 'El conductor no tiene pasajeros asignados'), 400);
            }else{
                return $pasajeros;
            }

        }catch(\Exception $e){
            return response()->json(array('message' => 'No se encontro ningun dato de consulta'), 400);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $central_id)
    {
        $noty = new NotificacionController();
        $data = $request->json()->all();

        $pasajero = new Pasajero($data);
        $conductor = Conductor::find($data['conductor_id']);
        $conductor->pasajeros()->save($pasajero);
        $mensaje = 'Se te asigno un nuevo pasajero';

        $central = Central::find($central_id);
        if(!$central->pasajeros()->save($pasajero)){
            $pasajero->delete();
            return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
        }
        return JsonResponse::create(array('message' => "Se asigno el pasajero correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $data['conductor_id'], 'Pasajeros')), 200));
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Pasajero::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $data = $request->all();
            $pasajero = Pasajero::find($id);
            $pasajero->identificacion = $data["identificacion"];
            $pasajero->nombres = $data["nombres"];
            $pasajero->telefono = $data["telefono"];
            $pasajero->direccion = $data["direccion"];
//            $pasajero->direccionD = $data["direccionD"];

            if($pasajero->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception"=>$e->getMessage()), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $noty = new NotificacionController();
        try{
            $conductor = Pasajero::find($id)->conductor;
            $pasajero = Pasajero::find($id);
            if (is_null ($pasajero))
            {
                \App::abort(404);
            }else{
                $pasajero->delete();
                $mensaje = 'Se retiro un pasajero que se te habia sido asignado';
                return JsonResponse::create(array('message' => "Pasajero eliminado correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $conductor->id,'Pasajeros')), 200));
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Pasajero", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    public function moverPasajero(Request $request, $pasajero_id){
        $noty = new NotificacionController();
        $pasajero = $this->show($pasajero_id);
        json_decode($noty->enviarNotificacionConductores('Se te fue retirado un pasajero que se te habia asignado', $pasajero->conductor_id, 'Pasajero' ));
        $pasajero->conductor_id = $request->conductor_id;
        if($pasajero->save()){
            return JsonResponse::create(array('message' => 'Se movio el pasajero conrrectamente de conductor.', json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo pasajero', $request->conductor_id, 'Pasajero' ))));
        }
    }


}
