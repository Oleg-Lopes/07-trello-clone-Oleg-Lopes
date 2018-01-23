function makeSortable() {
    $(".column").disableSelection();
    $(".cards").sortable({
        connectWith: ".cards",
        change: function(event, ui) {
            ui.placeholder.css({
                visibility: "visible",
                backgroundColor: "#838c91"
            });
        }
    });
}
$(function() {
    const card_temp =
        "<div class='card ui-sortable-handle'><p>New card</p><i class='fa fa-pencil-square-o hide' aria-hidden='true'></i></div>";
    const column_temp =
        "<div class='column'><h3>New list</h3><div class='cards ui-sortable'></div></div>";

    // localStorage.setItem("array", ["a", "b", "c"]);
    // $.each(localStorage.getItem("array").split(","), function(index, value) {});

    $(document).on("click", "#add-column", function() {
        $(this)
            .siblings("#columns")
            .append(column_temp);
        makeSortable();
    });

    $(document).on("mouseenter mouseleave", ".card", function() {
        $(this)
            .children(".fa-edit")
            .toggleClass("hide");
    });
});
