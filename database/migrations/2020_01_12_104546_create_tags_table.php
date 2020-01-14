<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 20) ->default('');
            $table->string('color', 10)->default('blue');
        });

        // Insert some stuff
        DB::table('tags')->insert([
            [
                'title' => 'Personal',
                'color' => 'blue'
            ],
            [
                'title' => 'Work',
                'color' => 'red'
            ],
            [
                'title' => 'Important',
                'color' => 'orange'
            ],
            [
                'title' => 'To do',
                'color' => 'yellow'
            ],
            [
                'title' => 'Done',
                'color' => 'green'
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tags');
    }
}
