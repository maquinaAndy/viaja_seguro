<?php

namespace App\Http\Controllers;
use App\Events\NuevaSolicitudEvent;
use App\Model\Central;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;
use Illuminate\Routing\Controller;
use Vinkla\Pusher\Facades\Pusher;
use DB;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use Illuminate\Support\Facades\App;
use App\Model\Solicitud;
use App\Model\Ruta;

class PdfController extends Controller
{
    protected $pusher;

    public function __construct(PusherManager $pusher)
    {
        $this->pusher = $pusher;
    }

    public function bar()
    {
        $this->pusher->trigger('solicitudes', 'NuevaSolicitudEvent', ['message' => 'La prueba']);
    }
    public function invoice()
    {
        \App::make('\App\Events\RecargarMarcadorConductorEvent')->enviarNotificacion(5, 10.449391, -73.2592578 );

//        $solicitud = Solicitud::find(18)->first();
//        $solicitud->load('cliente', 'detalles');
//        return $solicitud;
    }
}
