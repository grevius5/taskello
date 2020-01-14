<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'content', 'open',];
    protected $casts = ['open' => 'boolean'];

    /****************************************
     * Escape HTML text for security reason *
     ****************************************/
    public function setContentAttribute($value) {
        return $this->attributes["content"] = e($value);
    }

    public function setTitletAttribute($value) {
        return $this->attributes["title"] = e($value);
    }

    /**
     * Get all tags relative to the task
     */
    public function tags() {
        return $this->belongsToMany('App\Tag');
    }
}
