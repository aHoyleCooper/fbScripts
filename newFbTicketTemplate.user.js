// ==UserScript==
// @name         New Ticket Template
// @author       Aaron C
// @match        http://*/default.asp?command=new&pg=pgEditBug
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version      1.0.2
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/newFbTicketTemplate.user.js
// ==/UserScript==

$(function(){
    var template = "Description:\n\n\nExpected behavior: \nActual behavior: \n\nSteps to reproduce:\n1. \n2. \n3. \n\nWorkaround:\n\n\nNotify:\n\n\nCreated using the guidelines found here:\nhttps://goo.gl/2kC80F";
    
    if ($('.virtualLink.bold').text() == "Plain text") {
        $('.wideTextareaWrapper textarea').val(template);
    } else {
        $(".virtualLink")[0].click();
        $('.wideTextareaWrapper textarea').val(template);
        $(".virtualLink")[1].click();
    }

    $('#idBugTitleEdit').css("border", "solid 2px red");
    $('#kayakoxticketu55').css("border", "solid 2px red");
    
    $('#idDropList_ixProject_oText').css("border-top", "solid 2px red");
    $('#idDropList_ixProject_oText').css("border-left", "solid 2px red");
    $('#idDropList_ixProject_oText').css("border-bottom", "solid 2px red");
    
    $('#idDropList_ixArea_oText').css("border-top", "solid 2px red");
    $('#idDropList_ixArea_oText').css("border-left", "solid 2px red");
    $('#idDropList_ixArea_oText').css("border-bottom", "solid 2px red");
});