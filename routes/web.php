<?php

use App\Task;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $open_tasks = Task::where("open", true)->count();
    $closed_tasks = Task::where("open", false)->count();

    return view('dashboard', ['open_tasks' => $open_tasks, 'closed_tasks' => $closed_tasks,]);
});