function sortInit() {
    // making columns and cards sortable
    // also showing drop placeholder
    $("#columns").disableSelection();
    $(".cards").sortable({
        connectWith: ".cards",
        change: function(event, ui) {
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#838c91",
                height: ui.item.height()
            });
        },
        tolerance: "pointer"
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
        }
    });
}

function saveColumn(column_name) {
    let column_name_new = $("#column-edit-name-input").val(); // getting new name
    $("#column-edit-name").replaceWith(column_name[0]); // getting column name back
    column_name.text(column_name_new); // inserting new name
    $("#column-edit-name-input").unbind(); // unbinding event listeners
    column_name = null;
}

function saveCard(card) {
    let card_desc_new = $("#card-edit-desc-textarea").val(); // getting new description
    if (!card_desc_new.trim()) {
        $("#card-edit-desc-textarea").focus(); // if its empty - focus on textarea again
    } else {
        $("#card-edit-desc").replaceWith(card[0]); // getting card back
        card.children("p").text(card_desc_new); // inserting new description
        card.children("i").addClass("hide"); // hiding icon
        $("#card-edit-desc-save, #card-edit-desc-textarea").unbind(); // unbinding event listeners
        card = null;
    }
}

$(function() {
    sortInit(); // making things sortable
    $("#add-column").trigger("click");
    $(".column:last > .add-card").trigger("click");
    var card = null;
    var column_name = null;

    // card mockup
    const card_temp =
        "<div class='card ui-sortable-handle'>" +
        "<p></p>" +
        "<i class='fa fa-edit ignore hide'></i>" +
        "</div>";

    // column mockup
    const column_temp =
        "<div class='column'>" +
        "<h3 class='column-name ignore'>New list</h3>" +
        "<div class='cards'></div>" +
        "<button class='add-card ignore'>Add a card...</button>" +
        "</div>";

    // handling all clicks off the targets, to close dialogs/input and etc.
    $(document).on("click", function(e) {
        if (
            !$(e.target).closest(".ignore").length &&
            !$(e.target).hasClass("ignore")
        ) {
            if ($("#card-edit-desc").length) {
                $("#card-edit-desc").replaceWith(card[0]); // replacing cards description changing with card itslef
                card.children("i").addClass("hide"); // hiding icon
                if (!card.children("p").text()) {
                    card.remove(); // if card was empty before (newly created) and still is - delete it
                }
                card = null; // resetting card var
            }
            if ($("#column-edit-name").length) {
                saveColumn(column_name); // saving column name when clicking somewhere else on the screen
            }
        }
    });

    // to be used later
    // $(document).on("keydown", function(e) {
    //     if (e.which == 27) {
    //     }
    // });

    // changing column name
    $(document).on("click", ".column-name", function() {
        if (column_name != null) {
            saveColumn(column_name);
        } // saving an open column name, before editing another one

        // show column name editing field
        column_name = $(this); // saving column name object
        let column_name_old = $.trim(column_name.text()); // saving old column name
        $(this).replaceWith(
            "<div id='column-edit-name' class='dialog ignore'>" +
                "<input type='text' id='column-edit-name-input' value='" +
                column_name_old +
                "'></div>"
        ); // showing input with old column name in it
        $("#column-edit-name-input").select(); // selecting text, ~qol

        $("#column-edit-name-input").keydown(function(e) {
            if (e.which == 13 || e.which == 27) {
                saveColumn(column_name); // saving column-name on pressing Enter or Esc
            }
        });
    });

    // changing card description
    $(document).on("click", ".fa-edit", function(e) {
        if (card != null) {
            $("#card-edit-desc").replaceWith(card[0]);
            card.children("i").addClass("hide");
            card = null; // resetting card var
        } // resetting if another edit is open

        // show card description editing field
        card = $(this).parent(); // saving card object
        let card_desc_old = $.trim(card.text()); // saving cards description
        $(this)
            .parent()
            .replaceWith(
                "<div id='card-edit-desc' class='dialog ignore'>" +
                    "<textarea id='card-edit-desc-textarea'>" +
                    card_desc_old +
                    "</textarea>" +
                    "<br>" +
                    "<button id='card-edit-desc-save'>Save</button>" +
                    "</div>"
            ); // showing textarea with old description in it
        $("#card-edit-desc-textarea").select(); // selecting text, ~qol

        $("#card-edit-desc-textarea").keydown(function(e) {
            if (e.which == 13) {
                saveCard(card); // saving card on pressing Enter
            } else if (e.which == 27) {
                // if Esc pressed
                $("#card-edit-desc").replaceWith(card[0]); // replacing cards description changing with card itslef
                card.children("i").addClass("hide"); // hiding icon
                if (!card.children("p").text()) {
                    card.remove(); // if card was empty before (newly created) and still is - delete it
                }
                card = null; // resetting card var
            }
        });

        $("#card-edit-desc-save").click(function() {
            saveCard(card); // saving card on pressing save button
        });
    });

    $(document).on(
        {
            mouseenter: function() {
                $(this)
                    .children(".fa-edit")
                    .removeClass("hide"); // show icons for card description editing
            },
            mouseleave: function() {
                $(this)
                    .children(".fa-edit")
                    .addClass("hide"); // hide icons for cards description editing
            }
        },
        ".card"
    );

    $(document).on("click", "#add-column", function() {
        $(this)
            .siblings("#columns")
            .append(column_temp);
        sortInit(); // adding more columns and making them sortable
    });

    $(document).on("click", ".add-card", function() {
        $(this)
            .siblings(".cards")
            .append(card_temp)
            .children(".card:last")
            .children(".fa-edit")
            .trigger("click"); // creating new card with insta popup for description
    });

    // playing with localStorage
    // localStorage.setItem("array", ["a", "b", "c"]);
    // $.each(localStorage.getItem("array").split(","), function(index, value) {});
});
