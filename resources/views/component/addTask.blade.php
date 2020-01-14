<div id="add_modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <input id="task_title" class="form-control" type="text" name="title" placeholder="Title">
                <button class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <select id="task_tags" class="tags mb-2" multiple></select>

                    <textarea id="task_content" class="form-control" name="content" rows="5" placeholder="Content"></textarea>

                    <div class="my-2 float-right" role="group">
                        <button id="save_task" class="btn btn-outline-success">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
