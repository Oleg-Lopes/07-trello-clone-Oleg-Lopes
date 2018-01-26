function sortInit() {
    // making columns and cards sortable
    // also showing drop placeholder
    $("#columns").disableSelection();
    $(".cards").sortable({
        connectWith: ".cards",
        tolerance: "pointer",
        helper: "clone",
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        over: function(event, ui) {
            $(".ui-state-highlight").addClass(ui.item.attr("class"));
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#838c91",
                border: "none",
                height: ui.item.height() + 16
            });
        }
    });
    $("#columns").sortable({
        tolerance: "pointer",
        helper: "clone",
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        over: function(event, ui) {
            $(".ui-state-highlight").addClass(ui.item.attr("class"));
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#026aa7",
                border: "none",
                height: ui.item.height() + 30
            });
        },
        scroll: false
    });
}

function saveColumn(column_name) {
    let column_name_new = $("#column-edit-name-input").val(); // getting new name
    $("#column-edit-name").replaceWith(column_name[0]); // getting column name back
    column_name.text(column_name_new); // inserting new name
    column_name = null;
}

function saveCard(card_backup, cards) {
    let card_name_new = $("#card-edit-name-textarea").val(); // getting new name
    if (!card_name_new.trim()) {
        $("#card-edit-name-textarea")
            .focus()
            .effect("shake", { distance: 5 }); // if its empty - focus on textarea again
    } else {
        $("#card-edit-name").replaceWith(card_backup[0]); // getting card back
        card_backup.children("p").text(card_name_new); // inserting new name
        card_backup.children("i").addClass("hide"); // hiding icon
        card_backup = null;

        cards[
            "card" +
                parseInt(
                    $(".card:last")
                        .attr("id")
                        .split("card")[1]
                )
        ] = {
            name: $(".card:last")
                .children("p")
                .text()
                .trim(),
            column: $(".card:last")
                .closest(".column")
                .attr("id")
                .split("column")[1],
            description: "Here's some default description.",
            deadline: "none"
        };
    }
}

function cancelCard(card_backup) {
    $("#card-edit-name").replaceWith(card_backup[0]);
    card_backup.children("i").addClass("hide");
    card_backup = null; // resetting card var
}

function preventEmptyCard(card_backup) {
    if ($("#card-edit-name").length) {
        $("#card-edit-name").replaceWith(card_backup[0]); // replacing cards name changing with card itslef
        card_backup.children("i").addClass("hide"); // hiding icon
        if (!card_backup.children("p").text()) {
            card_backup.remove(); // if card was empty before (newly created) and still is - delete it
        }
        card_backup = null; // resetting card var
    }
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

$(function() {
    var cards = {};
    $(".card").each(function() {
        cards[
            "card" +
                parseInt(
                    $(this)
                        .attr("id")
                        .split("card")[1]
                )
        ] = {
            name: $(this)
                .children("p")
                .text()
                .trim(),
            column: $(this)
                .closest(".column")
                .attr("id")
                .split("column")[1],
            description: "Here's some default description.",
            deadline: "none"
        };
    }); // loading hardcoded cards into array

    console.log(cards);

    sortInit(); // making things sortable
    $("#add-column").trigger("click");
    $(".column:last > .add-card").trigger("click");
    var column_name = null;
    var card_last_id = parseInt(
        $(".card:last")
            .attr("id")
            .split("card")[1]
    );
    var column_last_id = parseInt(
        $(".column:last")
            .attr("id")
            .split("column")[1]
    );
    var card_backup = null;
    var card_dialog = null;
    var card_id = null;
    var dialog = $("#card-dialog");
    var tabs = $("#card-dialog-tabs");

    ////////////////////////////
    ////////// DIALOG //////////
    ////////////////////////////
    $("#card-dialog").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        width: 750,
        minHeight: 600,
        position: {
            at: "center top",
            my: "center"
        },
        close: function() {
            $("#overlay").addClass("hide");
        }
    });
    $(document).on("click", ".card", function(e) {
        if (!$(e.target).hasClass("fa-edit")) {
            if (card_backup != null) {
                preventEmptyCard(card_backup);
                cancelCard(card_backup);
            } // resetting if edit is open
            dialog.dialog("open");
            $("#overlay").removeClass("hide");
            card_dialog = $(this);
            card_id =
                "card" + parseInt(card_dialog.attr("id").split("card")[1]);

            dialog.children("h2").text(card_dialog.children("p").text());
            dialog.children("span").html(
                "in column <span id='column-info-name'>" +
                    card_dialog
                        .parent()
                        .siblings(".column-name")
                        .text() +
                    "</span>"
            );
            tabs.tabs({ active: 0 });

            $("#datepicker").datepicker({
                onSelect: function(date) {
                    cards[card_id].deadline = date;
                }
            });
            $("#description p").text(cards[card_id].description);
            $("#deadline p input").val(cards[card_id].deadline);
        }
        $("#overlay").click(function() {
            dialog.dialog("close");
        });
    });
    ////////////////////////////
    ////////// DIALOG //////////
    ////////////////////////////

    // handling all clicks off the targets, to close dialogs/input and etc.
    $(document).on("click", function(e) {
        if (
            !$(e.target).closest(".ignore").length &&
            !$(e.target).hasClass("ignore")
        ) {
            preventEmptyCard(card_backup);

            if ($("#column-edit-name").length) {
                saveColumn(column_name); // saving column name when clicking somewhere else on the screen
            }
        }
    });

    $(document).on("keydown", function(e) {
        if (e.which == 27) {
            if (dialog.dialog("isOpen")) {
                dialog.dialog("close");
            }
        }
    });

    // changing column name
    $(document).on("click", ".column-name", function() {
        if (column_name != null) {
            saveColumn(column_name);
        } // saving an open column name, before editing another one

        preventEmptyCard(card_backup); // closing cards name editing if it was open

        // show column name editing field
        column_name = $(this); // saving column name object
        let column_name_old = column_name.text().trim(); // saving old column name
        $(this).replaceWith(
            "<div id='column-edit-name' class='dialog ignore'>" +
                "<input type='text' id='column-edit-name-input' value='" +
                column_name_old +
                "' maxlength='29'></div>"
        ); // showing input with old column name in it
        $("#column-edit-name-input").select(); // selecting text, ~qol

        $("#column-edit-name-input").keydown(function(e) {
            if (e.which == 13 || e.which == 27) {
                saveColumn(column_name); // saving column-name on pressing Enter or Esc
            }
        });
    });

    // changing card name
    $(document).on("click", ".fa-edit", function(e) {
        if (card_backup != null) {
            preventEmptyCard(card_backup);
            cancelCard(card_backup);
        } // resetting if another edit is open

        if ($("#column-edit-name").length) {
            saveColumn(column_name); // saving column name first if it was open
        }

        // show card name editing field
        card_backup = $(this).parent(); // saving card object
        let card_name_old = card_backup.text().trim(); // saving cards name
        $(this)
            .parent()
            .replaceWith(
                "<div id='card-edit-name' class='dialog ignore'>" +
                    "<textarea id='card-edit-name-textarea' maxlength='200'>" +
                    card_name_old +
                    "</textarea>" +
                    "<br>" +
                    "<button id='card-edit-name-save'>Save</button>" +
                    "</div>"
            ); // showing textarea with old name in it
        $("#card-edit-name-textarea").select(); // selecting text, ~qol

        $("#card-edit-name-textarea").keydown(function(e) {
            if (e.which == 13) {
                saveCard(card_backup, cards); // saving card on pressing Enter
            } else if (e.which == 27) {
                // if Esc pressed
                $("#card-edit-name").replaceWith(card_backup[0]); // replacing cards name changing with card itslef
                card_backup.children("i").addClass("hide"); // hiding icon
                if (!card_backup.children("p").text()) {
                    card_backup.remove(); // if card was empty before (newly created) and still is - delete it
                }
                card_backup = null; // resetting card var
            }
        });

        $("#card-edit-name-save").click(function() {
            saveCard(card_backup, cards); // saving card on pressing save button
        });
    });

    $(document).on(
        {
            mouseenter: function() {
                $(this)
                    .children(".fa-edit")
                    .removeClass("hide"); // show icons for card name editing
            },
            mouseleave: function() {
                $(this)
                    .children(".fa-edit")
                    .addClass("hide"); // hide icons for cards name editing
            }
        },
        ".card"
    );

    $(document).on("click", "#add-column", function() {
        column_last_id++;
        // column mockup
        let column_temp =
            "<div class='column' id='column" +
            column_last_id +
            "'>" +
            "<h3 class='column-name ignore'>New list</h3>" +
            "<div class='cards'></div>" +
            "<button class='add-card ignore'>Add a card...</button>" +
            "</div>";
        $(this)
            .siblings("#columns")
            .append(column_temp)
            .children(".column:last")
            .children(".column-name")
            .trigger("click"); // creating new column with insta popup to name it
        sortInit(); // adding more columns and making them sortable
    });

    $(document).on("click", ".add-card", function() {
        card_last_id++;
        // card mockup
        let card_temp =
            "<div class='card' id='card" +
            card_last_id +
            "'>" +
            "<p></p>" +
            "<i class='fa fa-edit ignore hide'></i>" +
            "</div>";
        $(this)
            .siblings(".cards")
            .append(card_temp)
            .children(".card:last")
            .children(".fa-edit")
            .trigger("click"); // creating new card with insta popup for name
    });

    // playing with localStorage
    // localStorage.setItem("array", ["a", "b", "c"]);
    // $.each(localStorage.getItem("array").split(","), function(index, value) {});
});
