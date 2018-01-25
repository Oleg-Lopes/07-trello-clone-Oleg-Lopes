function makeSortable() {
    $("#columns").disableSelection();
    $(".cards").sortable({
        connectWith: ".cards",
        change: function(event, ui) {
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#838c91"
            });
        }
    });
    $("#columns").sortable({
        change: function(event, ui) {
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#838c91"
            });
        }
    });
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
    makeSortable(); // making things sortable
    var card = null;

    // card mockup
    const card_temp =
        "<div class='card ui-sortable-handle'><p></p><i class='fa fa-edit ignore hide'></i></div>";

    // column mockup
    const column_temp =
        "<div class='column'><h3>New list</h3><div class='cards'></div><button class='add-card ignore'>Add a card...</button></div>";

    $(document).on("click", function(e) {
        if (
            !$(e.target).closest(".ignore").length &&
            !$(e.target).hasClass("ignore")
        ) {
            if ($("#card-edit-desc").show()) {
                $("#card-edit-desc").replaceWith(card[0]); // replacing cards description changing with card itslef
                card.children("i").addClass("hide"); // hiding icon
                if (!card.children("p").text()) {
                    card.remove(); // if card was empty before (newly created) and still is - delete it
                }
                card = null; // resetting card var
            }
        }
    });

    // TO BE EDITED
    $(document).on("keydown", function(e) {
        if (e.which == 27) {
            // if Esc pressed
            if ($("#card-edit-desc").show()) {
                $("#card-edit-desc").replaceWith(card[0]); // replacing cards description changing with card itslef
                card.children("i").addClass("hide"); // hiding icon
                if (!card.children("p").text()) {
                    card.remove(); // if card was empty before (newly created) and still is - delete it
                }
                card = null; // resetting card var
            }
        }
    }); // TO BE EDITED

    $(document).on("click", ".fa-edit", function(e) {
        if (card != null) {
            $("#card-edit-desc").replaceWith(card[0]);
            card.children("i").addClass("hide");
            card = null; // resetting card var
        } // resetting if another edit is open

        // show edit card description
        card = $(this).parent(); // saving card
        let card_desc_old = $.trim(card.text()); // saving cards description
        $(this)
            .parent()
            .replaceWith(
                "<div id='card-edit-desc' class='dialog ignore'><textarea id='card-edit-desc-textarea'>" +
                    card_desc_old +
                    "</textarea><br><button id='card-edit-desc-save'>Save</button></div>"
            ); // showing textarea with old description in it
        $("#card-edit-desc-textarea").select(); // selecting text, ~qol

        $("#card-edit-desc-textarea").keydown(function(e) {
            if (e.which == 13) {
                saveCard(card); // saving card on pressing Enter
            }
        });

        $("#card-edit-desc-save").click(function() {
            saveCard(card); // saving card on pressing save button
        });
    });

    // playing with localStorage
    // localStorage.setItem("array", ["a", "b", "c"]);
    // $.each(localStorage.getItem("array").split(","), function(index, value) {});

    $(document).on("click", "#add-column", function() {
        $(this)
            .siblings("#columns")
            .append(column_temp);
        makeSortable(); // adding more columns and making them sortable
    });

    $(document).on("click", ".add-card", function() {
        $(this)
            .siblings(".cards")
            .append(card_temp)
            .children(".card:last")
            .children(".fa-edit")
            .trigger("click"); // creating new card with insta popup for description
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
});
