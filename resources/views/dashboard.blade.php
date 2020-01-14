@extends('master')

@section('content')
    <div class="row mb-4">
        <div class="col-12">
            <div class="progress">
                <div id="progress_open" class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%" aria-valuemin="0" aria-valuemax="100"></div>
                <div id="progress_close" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    </div>

    <div class="row my-4">
        <div class="col-sm-12 col-md-6">
            <h1 class="text-primary text-center d-inline">
                Open Tasks
            </h1>
            <span id="open_badge" class="badge badge-primary badge-pill align-top">{{ $open_tasks }}</span>
            <button class="btn btn-sm btn-outline-primary" id="add_task">
                <i class="fa fa-plus"></i>
            </button>

            <div class="list-group-flush my-2" id="open_tasks">
            </div>
        </div>

        <div class="col-sm-12 col-md-6">
            <h1 class="text-success text-center d-inline">
                Closed Tasks
            </h1>
            <span id="closed_badge" class="badge badge-success badge-pill align-top">{{ $closed_tasks }}</span>

            <div class="list-group-flush my-2" id="closed_tasks">
            </div>
        </div>
    </div>

    @include('component.addTask')
    @include('component.showTask')
    @include('component.editTags')
    @include('component.alert')
@endsection