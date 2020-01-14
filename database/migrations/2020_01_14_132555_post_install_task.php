<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PostInstallTask extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('tasks')->insert([
            [
                'title' => 'Welcome!',
                'content' => 'Congratulations! If you are reading this message then Taskello works correctly!',
                'open' => true,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'title' => 'Install Taskello!',
                'content' => 'On this side you will find all the completed tasks, from here you can delete or move them to the open tasks section.',
                'open' => false,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
        ]);

        DB::table('tag_task')->insert([
            [
                "task_id" => 1,
                "tag_id" => 1,
            ],
            [
                "task_id" => 2,
                "tag_id" => 2,
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
        //
    }
}
