<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    public $timestamps = false;
    protected $fillable = ['title'];

    /****************************************
     * Escape HTML text for security reason *
     ****************************************/
    public function setTitletAttribute($value) {
        return $this->attributes["title"] = e($value);
    }
}
