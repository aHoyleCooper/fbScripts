// ==UserScript==
// @name         New Ticket Template
// @author       Aaron C
// @match        http://*/default.asp?command=new&pg=pgEditBug
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include      http://fogbugz/
// @include      http://10.20.1.37/
// @version      1.0.7
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/newFbTicketTemplate.user.js
// ==/UserScript==

$(function(){
    var template = "Description: \n\nVersion: \n\nExpected behavior: \nActual behavior: \n\nSteps to reproduce:\n1. \n2. \n3. \n\nWorkaround:\n\n\nNotify:\n\n\nCreated using the guidelines found here:\nhttps://confluence.ia.local:8443/display/SUP/Writing+An+Effective+Bug+Report";
    
    if ($('.virtualLink.bold').text() == "Plain text") {
        $('.wideTextareaWrapper textarea').val(template);
    } else if ($('.virtualLink.bold').text() == "Rich text") {
        setTimeout(function() {
            $(".virtualLink")[0].click();
            $('#sEventEdit').val(template);
            setTimeout(function() {
                $(".virtualLink")[1].click();
            }, 250);
        }, 250);
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