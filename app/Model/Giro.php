<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Giro extends Model
{
    protected $table = 'giros';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'telefono', 'direccion', 'fechaN'];

    public $timestamps = false;

    public function central()
    {
        return $this->belongsTo(Central::class)->select('id', 'empresa_id', 'direccion', 'telefono');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }
}
