<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{
    public function list() {
        $tags = Tag::all();

        return response()->json($tags, 200);
    }

    public function update(Request $request) {
        $data = $request->validate([
            'id' => 'exists:tags',
            'title' => 'required|max:100'
        ]);

        $tag = Tag::find($data["id"]);
        $tag->title = $data["title"];
        $tag->save();

        return response()->json($tag, 200);
    }
}
