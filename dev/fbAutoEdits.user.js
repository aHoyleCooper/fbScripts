// ==UserScript==
// @name         fbAutoEdits
// @author       Aaron C
// @match        http://*/default.asp*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include      http://fogbugz/
// @include      http://10.20.1.37/
// @version      1.0.9
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/dev/fbAutoEdits.user.js
// ==/UserScript==

function setPriority(impact, probability) {
    var level = -1;
    if (impact == "--" || probability == "--") {
        // console.log("Setting priority to Undecided");
        level = 7;
    } else if (impact === "Critical" || impact === "High") {
        if (probability === "Low") {
            // console.log("Setting priority to Yellow");
            level = 2;
        } else if (probability != "--") {
            // console.log("Setting priority to Red");
            level = 1;
        }
    } else if (impact === "Medium") {
        if (probability === "Low") {
            // console.log("Setting priority to Green");
            level = 3;
        } else if (probability != "--") {
            // console.log("Setting priority to Yellow");
            level = 2;
        }
    } else {
        // console.log("Setting priority to Green");
        level = 3;
    }
    var levelDict = {1:"1 - Red", 2:"2 - Yellow", 3:"3 - Green", 7:"7 - Undecided"};
    if (level > -1) {
        return {"level":level, "levelString":levelDict[level]};
    } else {
        return {"level":7, "levelString":"7 - Undecided"};
    }
}

$(document.body).on('click', '#idDropList_customerximpactu43_oDropList div', function(){
    var newPriority = setPriority($(this).text(), $(".droplist-text:eq(8)").val());
    $(".droplist-text:eq(9)").val(newPriority.levelString);
    $("#ixPriority option").removeAttr('selected');
    $($("#ixPriority option")[newPriority.level - 1]).attr('selected', 'selected');
});

$(document.body).on('click', '#idDropList_probabilityxofxoccurrencer04_oDropList div', function(){
    var newPriority = setPriority($(".droplist-text:eq(7)").val(), $(this).text());
    $(".droplist-text:eq(9)").val(newPriority.levelString);
    $("#ixPriority option").removeAttr('selected');
    $($("#ixPriority option")[newPriority.level - 1]).attr('selected', 'selected');
});
$(document.body).on('wheel', '#idDropList_ixPersonAssignedTo_oDropList', function(e){
    var scrlAmt = e.originalEvent.deltaY;
    if (scrlAmt < 0 && $(this).scrollTop() === 0) {
        e.originalEvent.preventDefault();
    } else if (scrlAmt > 0 && $(this).scrollTop() >= $(this).prop("scrollHeight") - $(this).outerHeight()) {
        e.originalEvent.preventDefault();
    }
});

$(document.body).on('wheel', '#idDropList_ixPersonAssignedToOverrideDropDown_assign0_oDropList', function(e){
    var scrlAmt = e.originalEvent.deltaY;
    if (scrlAmt < 0 && $(this).scrollTop() === 0) {
        e.originalEvent.preventDefault();
    } else if (scrlAmt > 0 && $(this).scrollTop() >= $(this).prop("scrollHeight") - $(this).outerHeight()) {
        e.originalEvent.preventDefault();
    }
});

$(document.body).on('wheel', '#idDropList_ixProject_oDropList', function(e){
    var scrlAmt = e.originalEvent.deltaY;
    if (scrlAmt < 0 && $(this).scrollTop() === 0) {
        e.originalEvent.preventDefault();
    } else if (scrlAmt > 0 && $(this).scrollTop() >= $(this).prop("scrollHeight") - $(this).outerHeight()) {
        e.originalEvent.preventDefault();
    }
});