<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    private $content_chars = 100;

    /**
     * Return all tasks
     */
    public function get_all() {
        return Task::all();
    }

    /**
     * Return all open tasks
     */
    public function get_open() {
        $tasks = Task::where('open', true)->orderBy('created_at', 'DESC')->get();
        
        foreach ($tasks as $task) {
            $task->content = Str::limit($task->content, $this->content_chars);
            $task->tags = $task->tags()->orderBy("title")->get();
        }

        return response()->json($tasks, 200);
    }

    /**
     * Return all closed tasks
     */
    public function get_closed() {
        $tasks = Task::where('open', false)->orderBy('created_at', 'DESC')->get();
        
        foreach ($tasks as $task) {
            $task->content = Str::limit($task->content, $this->content_chars);
            $task->tags = $task->tags()->orderBy("title")->get();
        }

        return response()->json($tasks, 200);
    }

    /**
     * Return task with given id
     */
    public function get_id($id) {
        $task = Task::find($id);
        // Get all the tag associated
        $task->tags = $task->tags()->orderBy("title")->get();
        return $task;
    }

    /**
     * Create new task
     */
    public function update(Request $request) {
        $data = $request->validate([
            'id' => 'filled|exists:tasks',
            'title' => 'required|max:100',
            'content' => 'required',
            'tags' => 'required|array',
            'tags.*' => 'exists:tags,id'
        ]);

        // Update or create task
        if (!array_key_exists("id", $data)) {
            $result = Task::create($data);
        }
        else {
            $result = Task::find($data["id"]);
            // Update only the open task
            if ($result->open){
                $result->title = $data["title"];
                $result->content = $data["content"];
                $result->save();
            }
        }

        // Connect tags
        $result->tags()->sync($data["tags"]);
        
        return response()->json($result, 200);
    }

    /**
     * Close a task
     */
    public function close(Request $request) {
        $data = $request->validate([
            'id' => 'required|exists:tasks'
        ]);

        $task = Task::find($data["id"]);
        $task->open = !$task->open;
        $task->save();

        return response()->json($task, 200);
    }

    /**
     * Remove given task
     */
    public function delete(Request $request) {
        $data = $request->validate([
            'id' => 'required|exists:tasks'
        ]);

        Task::find($data["id"])->delete();

        return response()->json(["success"=>true], 200);
    }
}
