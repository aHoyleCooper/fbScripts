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
    var rtfTemplate = "<p>Description:</p><p>Expected behavior:<br>Actual behavior:</p><p>Steps to reproduce:<br>1.<br>2.<br>3.</p><p>Workaround:</p><p>Notify:</p><p>Created using the guidelines found <a href='https://goo.gl/2kC80F' target='_blank'>here</a></p>"
    $('.wideTextareaWrapper textarea').val(template);
    $('.bug-rich-edit').ready(function() {
        $('.bug-rich-edit').innerHTML = rtfTemplate;
    });
    $('#idBugTitleEdit').css("border", "solid 2px red");
    $('#kayakoxticketu55').css("border", "solid 2px red");
    
    $('#idDropList_ixProject_oText').css("border-top", "solid 2px red");
    $('#idDropList_ixProject_oText').css("border-left", "solid 2px red");
    $('#idDropList_ixProject_oText').css("border-bottom", "solid 2px red");
    
    $('#idDropList_ixArea_oText').css("border-top", "solid 2px red");
    $('#idDropList_ixArea_oText').css("border-left", "solid 2px red");
    $('#idDropList_ixArea_oText').css("border-bottom", "solid 2px red");
});