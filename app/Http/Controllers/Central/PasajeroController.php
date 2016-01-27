<?php

namespace App\Http\Controllers\Central;

use App\Model\Central;
use App\Model\Pasajero;
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
    public function index($central_id)
    {
        try{
            $pasajeros = Central::find($central_id)->pasajeros;
            $pasajeros->load('central');
            return $pasajeros;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
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
        try{
            $data = $request->json()->all();

            $pasajero = new Pasajero($data);
            if(!Central::find($central_id)->pasajeros()->save($pasajero)){
                return response()->json(['mensajeError' => 'No se ha posido registrar al pasajero'], 400);
            }
            return response()->json($pasajero, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
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
            $pasajero = Pasajero::select("*")
                ->where("identificacion", $id)
                ->first();
            $pasajero->identificacion = $data["identificacion"];
            $pasajero->nombres = $data["nombres"];
            $pasajero->apellidos = $data["apellidos"];
            $pasajero->telefono = $data["telefono"];

            $pasajero->origen = $data["origen"];
            $pasajero->direccionO = $data["direccionO"];
            $pasajero->destino = $data["destino"];

            $pasajero->direccionD = $data["direccionD"];
            $pasajero->vehiculo = $data["vehiculo"];
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
        try{
            $pasajero = Pasajero::find($id);
            if (is_null ($pasajero))
            {
                \App::abort(404);
            }else{
                $pasajero->delete();
                return JsonResponse::create(array('message' => "Cleinte eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Pasajero", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
}