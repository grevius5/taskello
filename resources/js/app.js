require('./bootstrap');
import SlimSelect from 'slim-select';

var open = 0;
var closed = 0;
var tag_selector;

// Init all the functionality
$(document).ready(function () {
    // Get open and closed tasks
    get_open_tasks();
    get_closed_tasks();

    update_progress();

    // Init the tag select component
    init_tags();

    // Button click to show modal
    $("#add_task").click(function () {
        $("#add_modal").modal();
    });

    // Clean modal data on close
    $('#add_modal').on('hidden.bs.modal', function (e) {
        clean_modal();
    });

    $('#show_modal_tags').click(function () {
        show_modal_tags();
    });

    $('.container').on("click", ".tag", function () {
        update_tag($(this).val());
    })

    // Save button in modal
    $("#save_task").click(function () {
        save_task($(this).val());
    });

    // Connect remove callback
    $(".container").on("click", ".remove", function () {
        remove_action($(this).val());
    });

    // Connect edit callback
    $(".container").on("click", ".edit", function () {
        edit_action($(this).val());
    });

    // Close task callback
    $(".container").on("click", ".check, .uncheck", function () {
        close_action($(this).val());
    });

    // Preview task callback
    $(".container").on("click", ".view", function () {
        preview_action($(this).val());
    });
});

function init_tags() {
    $.ajax({
        type: "get",
        url: "api/tag/list",
        dataType: "json",
        success: function (response) {
            let tags = [];
            $.each(response, function (index, obj) {
                tags.push({
                    text: obj.title,
                    value: obj.id.toString()
                });
            });

            tag_selector = new SlimSelect({
                select: ".tags",
                data: tags,
                placeholder: "Tags"
            });
        }
    });
}

/**
 * Save the task with a given id
 * @param {int} id Id of the task
 */
function save_task(id) {
    // Close modal
    $("#add_modal").modal('hide');

    // Ajax save data
    let data = {
        "title": $("#task_title").val(),
        "content": $("#task_content").val(),
        "tags": tag_selector.selected(),
    };

    if (id) {
        data["id"] = id;
    }

    $.ajax({
        type: "post",
        url: "api/task/update",
        data: data,
        dataType: "json",
        complete: function (response) {
            let data = response.responseJSON;
            if (!has_error(data)) {
                get_open_tasks();
                update_progress();
            }
        }
    });
}

/**
 * Get all opened task and create the relative element in open tasks container
 */
function get_open_tasks() {
    fill_task_list($("#open_tasks"));
}

/**
 * Get all closed task
 */
function get_closed_tasks() {
    fill_task_list($("#closed_tasks"), true);
}

/**
 * Function to fill open/closed tasks list
 * @param {jQuery DOM} list_parent List container
 * @param {bool} is_closed Tell if is the closed or open list
 */
function fill_task_list(list_parent, is_closed = false) {
    list_parent.empty();

    $.ajax({
        type: "get",
        url: "api/task/" + (is_closed ? "closed" : "open"),
        dataType: "json",
        success: function (response) {
            if (is_closed) {
                closed = response.length;
            } else {
                open = response.length;
            }
            $("#" + (is_closed ? "closed" : "open") + "_badge").text(response.length);

            $.each(response, function (index, obj) {
                let date_diff = Date.dateDiff('d', new Date(obj.created_at), new Date());

                list_parent.append(
                    `<div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${obj.title}</h5>
                    ${ date_diff > 0 ?
                        `<small>${date_diff} days ago</small>` :
                        `<small>${Date.dateDiff('h', new Date(obj.created_at), new Date())} hours ago</small>`
                    }
                        </div>
                    ${
                    Object.keys(obj.tags).map(function (key) {
                        return `<span class="badge mr-2 badge-primary ${obj.tags[key].color}">${obj.tags[key].title}</span>`
                    }).join("")
                    }
                        <p class="mb-1">${obj.content}</p>
                        <small>${Date.getFormatDate(obj.created_at)}</small>
                        <div class="clearfix">
                            <div class="float-right">
                                <button value="${obj.id}" class="btn btn-sm btn-outline-secondary view">
                                    <i class="fa fa-eye"></i>
                                </button>
                    ${
                    is_closed ?
                        `<button value="${obj.id}" class="btn btn-sm btn-outline-primary uncheck">
                            <i class="fa fa-list"></i>
                        </button>`
                        :
                        `<button value="${obj.id}" class="btn btn-sm btn-outline-info edit">
                            <i class="fa fa-pencil-alt"></i>
                        </button>
                        <button value="${obj.id}" class="btn btn-sm btn-outline-success check">
                            <i class="fa fa-check-circle"></i>
                        </button>`
                    }
                                <button value="${obj.id}" class="btn btn-sm btn-outline-danger remove">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>`
                );
            });

            update_progress();
        }
    });
}

/**
 * Delete the task with the given id
 * @param {int} id Task id
 */
function remove_action(id) {
    $.ajax({
        type: "delete",
        url: "api/task/delete",
        data: { "id": id },
        dataType: "json",
        complete: function (response) {
            let data = response.responseJSON;

            if (data.success) {
                get_open_tasks();
                get_closed_tasks();

                update_progress();
            }
        }
    });
}

/**
 * Open the edit modal fot the task with the given id
 * @param {int} id Task id
 */
function edit_action(id) {
    $.ajax({
        type: "get",
        url: "api/task/get/" + id,
        complete: function (response) {
            let data = response.responseJSON;
            if (!has_error(data)) {
                // Update modal values
                $("#save_task").val(id);
                $("#task_title").val(data.title);
                $("#task_content").val(data.content);

                let tags = [];
                $.each(data["tags"], function (index, obj) {
                    tags.push(obj.id);
                });
                tag_selector.set(tags);

                // Show modal
                $("#add_modal").modal();
            }
        }
    });
}

/**
 * Preview of the task with the given id
 * @param {int} id Task id
 */
function preview_action(id) {
    $.ajax({
        type: "get",
        url: "api/task/get/" + id,
        complete: function (response) {
            let data = response.responseJSON;
            if (!has_error(data)) {
                // Update modal values
                $("#modal_show_title").text(data.title);
                $("#modal_show_content").text(data.content);
                $("#modal_show_date").text(Date.getFormatDate(data.created_at));

                $("#modal_show_tags").html("");
                $.each(data.tags, function (index, obj) {
                    $("#modal_show_tags").append(
                        `<span class="badge mr-2 badge-primary ${obj.color}">${obj.title}</span>`
                    );
                });

                // Show modal
                $("#modal_show_task").modal();
            }
        }
    });
}

/**
 * Set the task with the given id as closed
 * @param {int} id Task id
 */
function close_action(id) {
    $.ajax({
        type: "post",
        url: "api/task/close",
        data: { "id": id },
        complete: function (response) {
            let data = response.responseJSON;
            if (!has_error(data)) {
                get_open_tasks();
                get_closed_tasks();
            }
        }
    });
}

/**
 * Update the lists of open and closed tasks and clean the modal for edit/add new task
 */
function update_and_clean() {
    get_open_tasks();

    clean_modal();
}

/**
 * Clean all the data from the modal for edit/add task
 */
function clean_modal() {
    $("#save_task").val("");
    $("#task_title").val("");
    $("#task_content").val("");
    tag_selector.set([]);
}

/**
 * Utility to check if the response has some errors
 * @param {JSON} data JSON response from ajax
 */
function has_error(data) {
    if (data["message"]) {
        $.each(data.errors, function (indexInArray, valueOfElement) {
            $("#error_area").append(
                `<div class="alert fade show alert-warning" role="alert" id="alert_error">
                    <button type="button" class="close" aria-label="Close" data-dismiss="alert">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>${indexInArray}:</strong> ${valueOfElement}
                </div>`
            );
        });

        setTimeout(function () {
            $(".alert").alert("close");
        }, 5000);

        return true;
    }
    return false;
}

/**
 * Update the top progress bar for open/closed tasks
 */
function update_progress() {
    let tot = open + closed;

    $("#progress_open").css("width", (open * 100 / tot) + "%");
    $("#progress_close").css("width", (closed * 100 / tot) + "%");
}

/**
 * Show the modal for editing tags
 */
function show_modal_tags() {
    $.ajax({
        type: "get",
        url: "api/tag/list",
        success: function (response) {
            $("#modal_tags_body").empty();

            $("#modal_tags_body").append(
                `<table class="table table-light">
                <tbody>
                ${
                Object.keys(response).map(function (key) {
                    return `<tr>
                        <td class="w-75">
                            <input class="form-control" type="text" name="" value="${response[key].title}" id="tag_title_${response[key].id}">
                        </td>
                        <td class="w-25 mx-2 my-2">
                            <button type="" button class="btn w-100 ${response[key].color}"></button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-outline-success tag" value="${response[key].id}">
                                <i class="fa fa-save"></i>
                            </button>
                        </td>
                    </tr>`;
                }).join("")
                }
                </tbody>
            </table>
            `);

            $("#modal_tags").modal();
        }
    });
}

/**
 * Update the title of the tag with the given id
 * @param {int} id tag id
 * @param {string} title tag title
 */
function update_tag(id, title) {
    $.ajax({
        type: "post",
        url: "api/tag/update",
        data: { "id": id, "title": $("#tag_title_" + id).val() },
        complete: function (response) {
            let data = response.responseJSON;
            if (!has_error(data)) {
                // Update tasks
                get_open_tasks();
                get_closed_tasks();

                // update tags list
                tag_selector.destroy();
                init_tags();

                // close modal
                $("#modal_tags").modal('hide');
            }
        }
    });
}

/**
 * Utility function to get the formatted data
 */
Date.getFormatDate = function (date) {
    return new Date(date).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
};

/**
 * Utility function to get the difference between 2 date in weeks, days, hours, minutes and seconds (w,d,h,n,s)
 */
Date.dateDiff = function (datepart, fromdate, todate) {
    datepart = datepart.toLowerCase();
    var diff = todate - fromdate;
    var divideBy = {
        w: 604800000,
        d: 86400000,
        h: 3600000,
        n: 60000,
        s: 1000
    };

    return Math.floor(diff / divideBy[datepart]);
};
