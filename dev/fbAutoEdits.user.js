// ==UserScript==
// @name         fbAutoEdits
// @author       Aaron C
// @match        http://*/default.asp*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include      http://fogbugz/
// @include      http://10.20.1.37/
// @version      1.1.5
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/dev/fbAutoEdits.user.js
// ==/UserScript==

function blockScroll(e, object){
    var scrlAmt = e.originalEvent.deltaY;
    if (scrlAmt < 0 && object.scrollTop() === 0) {
        e.originalEvent.preventDefault();
    } else if (scrlAmt > 0 && object.scrollTop() >= object.prop("scrollHeight") - object.outerHeight()) {
        e.originalEvent.preventDefault();
    }
}

function setPriority(impact, probability) {
    var level = 7;
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
    var levelString = levelDict[level];

    $(".droplist-text:eq(9)").val(levelDict[level]);
    $("#ixPriority option").removeAttr('selected');
    $($("#ixPriority option")[level - 1]).attr('selected', 'selected');
}

function setImpact(impact){
    // console.log("setting impact to:", impact);
    $('#idDropList_customerximpactu43_oText').val(impact);
    $('#customerximpactu43 option').each(function(){
        if ($(this).text() === impact) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

function setProbability(prob) {
    // console.log("setting probability to:", prob);
    $('#idDropList_probabilityxofxoccurrencer04_oText').val(prob);
    $('#probabilityxofxoccurrencer04 option').each(function(){
        if ($(this).text() === prob) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

function setMilestone(milestone){
    // console.log("setting milestone to:", milestone);
    $('#idDropList_ixFixFor_oText').val(milestone);
    $('#ixFixFor').each(function(){
        if ($(this).text() === milestone) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

function assignToUser(user) {
    // console.log("assigning ticket to:", user);
    $('#idDropList_ixPersonAssignedTo_oText').val(user);
    $('#ixPersonAssignedTo option').each(function(){
        if ($(this).text() === " " + user + " ") {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

function setBtnBehavior(className, func) {
    $(className).css(btnCss);
    $(className).click(func);
    $(className).hover(function(){
            $(this).css({"background-color":"#fff", "border-color":"#ddd"});
        }, function(){
            $(this).css({"background-color":"transparent", "border-color":"transparent"});
    });
    $(className).mousedown(function(){
        $(this).css({"background-color":"#ccc"});
    });
    $(className).mouseup(function(){
        $(this).css({"background-color":"#fff"});
    });
}

function appendQuickButtons(){
    $('.toolbar.nextprev').css({"float":"none"});
    $('.toolbar.buttons').css(listCss);
    $('.toolbar.buttons').html(allBtns.join('<p style="margin:0 5px;">|</p>'));
    $.each(allFuncs, function(key, value){
        setBtnBehavior(key, value);
    });
    /*  have to do this because Fogbugz is a steaming pile of steam
        for whatever reason, when you click 'Okay' or 'Cancel', none of the click events work,
        nor can I figure out a reliable way add new listeners without reloading the scripts */
    $('#Button_CancelEdit').click(function(){
        window.location.href = window.location.href.split('#')[0];
    });
    $('#Button_OKEdit').click(function(){
        setTimeout(function(){
            window.location.href = window.location.href.split('#')[0];
        }, 600);
    });
}

var btnCss = {
    "height":"80%",
    "cursor":"pointer",
    "display":"flex",
    "align-items":"center",
    "justify-content":"center",
    "border":"solid 1px transparent",
    "border-radius":"4px",
    "padding":"0 5px",
    "color":"#555",
    "font-size":"13px"
};
var listCss = {
    "display":"flex",
    "align-items":"center",
    "justify-content":"flex-end",
    "margin-top":"-15px"
};
/*  to add a function, you'll need to create a <li>, give it a class name, assign it to a variable,
    and add that variable to the allBtns list. Then, add a new entry to the allFuncs JSON dictionary.
    the class name you gave to the <li> should be the key, and the value should be the function you
    want your button to execute on click. */
var quickBtn1 = '<li class="quickBtn1">Claim</li>';
var quickBtn2 = '<li class="quickBtn2">Incoming</li>';
var quickBtn3 = '<li class="quickBtn3">Do The Needful</li>';
var quickBtn4 = '<li class="quickBtn4">Green</li>';
var quickBtn5 = '<li class="quickBtn5">Yellow</li>';
var quickBtnLast = '<li class="quickBtnLast" style="margin-right:5px;">Red</li>';
var allBtns = [quickBtn1, quickBtn2, quickBtn3, quickBtn4, quickBtn5, quickBtnLast];
var allFuncs = {
    ".quickBtn1":function(){
        // console.log('assigning ticket to you');
        assignToUser($('#username').text());
    },
    ".quickBtn2":function(){
        // console.log('assigning ticket to Incoming, setting priority to "7 - Undecided"');
        assignToUser('Incoming');
        setPriority('--', '--');
    },
    ".quickBtn3":function(){
        // console.log('setting milestone to "Bug Backlog", assignment to "Up For Grabs", and priority to "3 - Green"');
        setMilestone('Bug Backlog');
        assignToUser('Up For Grabs');
        setImpact('Low');
        setProbability('Low');
        setPriority('Low','Low');
    },
    ".quickBtn3":function(){
        // console.log('setting priority to "3 - Green"');
        setImpact('Low');
        setProbability('Low');
        setPriority('Low','Low');
    },
    ".quickBtn4":function(){
        // console.log('setting priority to "2 - Yellow"');
        setImpact('Medium');
        setProbability('Medium');
        setPriority('Medium','Medium');
    },
    ".quickBtnLast":function(){
        // console.log('setting priority to "1 - Red"');
        setImpact('High');
        setProbability('High');
        setPriority('High','High');
    }
};

$(document.body).on('wheel', '#idDropList_ixPersonAssignedTo_oDropList', function(e){
    blockScroll(e, $(this));
});

$(document.body).on('wheel', '#idDropList_ixPersonAssignedToOverrideDropDown_assign0_oDropList', function(e){
    blockScroll(e, $(this));
});

$(document.body).on('wheel', '#idDropList_ixProject_oDropList', function(e){
    blockScroll(e, $(this));
});

$(document.body).on('click', '#idDropList_customerximpactu43_oDropList div', function(){
    setPriority($(this).text(), $(".droplist-text:eq(8)").val());
});

$(document.body).on('click', '#idDropList_probabilityxofxoccurrencer04_oDropList div', function(){
    setPriority($(".droplist-text:eq(7)").val(), $(this).text());
});

$('#edit0').click(function(){
    appendQuickButtons();
});

$('.actionButton2.edit').click(function(){
    appendQuickButtons();
});

$('.actionButton2.reopen').click(function(){
    appendQuickButtons();
});

$('.actionButton2.editClosed').click(function(){
    appendQuickButtons();
});