// ==UserScript==
// @name         fbAutoEdits
// @author       Aaron C
// @match        http://*/default.asp*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version      1.0.3
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/dev/fbAutoEdits.user.js
// ==/UserScript==

var oldVals = [];
var newVals = [];

var checkDropdownValues = function () {
    var urlCheck = window.location.href;
    if (urlCheck.indexOf("edit") > -1) {
        oldVals = newVals;
        newVals = [$(".droplist-text:eq(7)").val(), $(".droplist-text:eq(8)").val()];
        if (oldVals[0] !== newVals[0] || oldVals[1] !== newVals[1] && (newVals[0] !== undefined && newVals[1] !== undefined)) {
            // console.log("Priority updating");
            var level = -1;
            var priority = $(".droplist-text:eq(9)");
            if (newVals[0] === "Critical" || newVals[0] === "High") {
                if (newVals[1] === "Low") {
                    // console.log("Setting priority to Yellow");
                    level = 2;
                } else {
                    // console.log("Setting priority to Red");
                    level = 1;
                }
            } else if (newVals[0] === "Medium") {
                if (newVals[1] === "Low") {
                    // console.log("Setting priority to Green");
                    level = 3;
                } else {
                    // console.log("Setting priority to Yellow");
                    level = 2;
                }
            } else if (newVals[0] == "--" || newVals[1] == "--") {
                // console.log("Setting priority to Undecided")
                level = 7;
            } else {
                // console.log("Setting priority to Green");
                level = 3;
            }
            var levelDict = {1:"1 - Red", 2:"2 - Yellow", 3:"3 - Green", 7:"7 - Undecided"};
            if (level > -1) {
                // console.log("Attempting to set Priority to:", levelDict[level]);
                priority.val(levelDict[level]);
                $($("#ixPriority option")[level - 1]).attr('selected', 'selected');
            }
        }
    }
};

$(document).ready(function() {
    setInterval(checkDropdownValues, 1000);
});

// testing auto-update