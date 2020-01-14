<?php

use Illuminate\Http\Request;
use App\Task;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// API routes without user auth
// Tasks
Route::get("task/get", 'TaskController@get_all');
Route::get("task/open", 'TaskController@get_open');
Route::get("task/closed", 'TaskController@get_closed');
Route::get("task/get/{id}", 'TaskController@get_id');
Route::post("task/update", 'TaskController@update');
Route::post("task/close", 'TaskController@close');
Route::delete("task/delete", 'TaskController@delete');

// Tags
Route::get("tag/list", "TagController@list");
Route::post("tag/update", "TagController@update");