// ==UserScript==
// @name         fbAutoEdits
// @author       Aaron C
// @match        http://*/default.asp*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include      http://fogbugz/
// @include      http://fogbugz.ia.local/
// @include      http://10.20.1.37/
// @version      1.1.15
// @updateURL    https://github.com/aHoyleCooper/fbScripts/raw/master/dev/fbAutoEdits.user.js
// ==/UserScript==

/***************************************** Functions *****************************************/

/*  Function: blockScroll
    Args:
        e (event) - scroll event
        object (DOM object) - the DOM object that has the scrollbar
    Desc:
        Default scroll behavior once the hovered object hits it scroll min or max
        is to transfer any additional scroll delta to the parent container. Since scroll acceleration
        is so common, and since these dropdown lists are narrow but very long, I block any scroll past
        the min or max for any dropdown list with a scrollbar while hovered.
*/
function blockScroll(e, object){
    var scrlAmt = e.originalEvent.deltaY;
    if (scrlAmt < 0 && object.scrollTop() === 0) {
        e.originalEvent.preventDefault();
    } else if (scrlAmt > 0 && object.scrollTop() >= object.prop("scrollHeight") - object.outerHeight()) {
        e.originalEvent.preventDefault();
    }
}

/*  Function: setPriority
    Args:
        impact (string) - the string value of the 'Customer Impact' field ('--', 'Low', 'Medium', 'High', 'Critical', 'Feature')
        probability (string) - the string value of the 'Probability of Occurrence' field ('--', 'Low', 'Medium', 'High', 'Unknown')
    Desc:
        Sets the value of the Priority dropdown based on the imact and probability for a case. I use impact and probability
        as inputs, rather than just the desired impact so I can automatically set them if a user sets/changes the impact or probability
        on a ticket automatically, as well as set the priority on demand.
*/
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

/*  Function: setImpact
    Args:
        impact (string) - the string value of the desired customer impact ('--', 'Low', 'Medium', 'High', 'Critical', 'Feature'). Case sensitive.
    Desc:
        Sets the value of the 'Customer Impact' field to the value of the supplied impact argument. Must match a legitimate impact value
        described above. Setting the impact in this manner will not trigger an automatic priority update.
*/
function setImpact(impact){
    // console.log("setting impact to:", impact);
    $('#idDropList_customerximpactu43_oText').val(impact);
    $('#customerximpactu43 option').each(function(){
        if ($(this).text().indexOf(impact) >= 0) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

/*  Function: setProbability
    Args:
        prob (string) - the string value of the desired probability of occurrence ('--', 'Low', 'Medium', 'High', 'Unknown'). Case sensitive.
    Desc:
        Sets the value of the 'Probability of Occurrence' field to the value of the supplied prob argument. Must match a legitimate
        probability value described above. Setting the probability in this manner will not trigger an automatic priority update.
*/
function setProbability(prob) {
    // console.log("setting probability to:", prob);
    $('#idDropList_probabilityxofxoccurrencer04_oText').val(prob);
    $('#probabilityxofxoccurrencer04 option').each(function(){
        if ($(this).text().indexOf(prob) >= 0) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

/*  Function: setMilestone
    Args:
        milestone (string) - the string value of the desired milestone. See Fogbugz for legitimate milestones. Case sensitive.
    Desc:
        Sets the value of the 'Milestone' field to the value of the supplied milestone argument. Must match a legitimate
        milestone value described above.
*/
function setMilestone(milestone){
    // console.log("setting milestone to:", milestone);
    $('#ixFixFor option').each(function(){
        if ($(this).text().indexOf(milestone) >= 0) {
            $('#idDropList_ixFixFor_oText').val($(this).text());
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

/*  Function: assignToUser
    Args:
        user (string) - the string value of the desired user. See Fogbugz for legitimate usernames. Case sensitive.
    Desc:
        Sets the value of the 'Assigned To' field to the value of the supplied user argument. Must match a legitimate
        user account.
*/
function assignToUser(user) {
    // console.log("assigning ticket to:", user);
    $('#ixPersonAssignedTo option').each(function(){
        if ($(this).text().indexOf(user) >= 0) {
            $('#idDropList_ixPersonAssignedTo_oText').val($(this).text());
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

/*  Function: setCategory
    Args:
        category (string) - the string value of the desired category. Legitimate categories include: 'Bug', 'Feature', and 'Refactor'
    Desc:
        Sets the value of the 'Category' field to the value of the supplied user argument. Must match a legitimate user account
*/
function setCategory(category) {
    // console.log("setting category to:", category);
    $('#idDropList_ixCategory_oText').val(category);
    $('#ixCategory option').each(function(){
        if ($(this).text().indexOf(category) >= 0) {
            $(this).attr('selected', 'selected');
        } else {
            $(this).removeAttr('selected');
        }
    });
}

/*  Function: setBtnBehavior
    Args:
        className (string) - the string value of the class name for the button your are configuring
        func (function) - the function for the button to perform on click
    Desc:
        Sets the behavior of the quick buttons so they are positioned correctly, have hover and click effects,
        and run the appropriate functions when clicked. This is primarily used in appendQuickButtons, but I
        left it separate to support the case where buttons could get injected into the page after the fact
*/
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

/*  Function: appendQuickButtons
    Args:
        btnList (string list) - list of HTML strings that make up each button to be injected. Should be HTML list items, each with a class set
        funcList (JSON dictionary) - dictionary with the class name of the button as the key, and the function to run on button click as the value
    Desc:
        This function iterates through the btnList variable, uses setBtnBehavior() in combination with the allFuncs
        dictionary to set the behavior of each quick button, then finally inject the buttons into the FogBugz case header.
*/
function appendQuickButtons(btnList, funcList, newPage){
    var listCss = {
        "display":"flex",
        "align-items":"center",
        "justify-content":"flex-end",
    };
    if(newPage){
        listCss["min-height"] = "32px";
    } else {
        listCss["margin-top"] = "-15px";
    }
    $('.toolbar.nextprev').css({"float":"none"});
    $('.toolbar.buttons').css(listCss);
    $('.toolbar.buttons').html(btnList.join('<p style="margin:0 5px;">|</p>'));
    $.each(funcList, function(key, value){
        setBtnBehavior(key, value);
    });
    /*  have to do this because Fogbugz is a steaming pile of steam
        for whatever reason, when you click 'Okay' or 'Cancel', none of the click events work,
        nor can I figure out a reliable way add new listeners without reloading the scripts
    */
    $('#Button_CancelEdit').click(function(){
        window.location.href = window.location.href.split('#')[0];
    });
    $('#Button_OKEdit').click(function(){
        setTimeout(function(){
            window.location.href = window.location.href.split('#')[0];
        }, 600);
    });
}


/***************************************** Variables *****************************************/

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
/*  to add a function, you'll need to create a <li>, give it a class name (this injects a row of
    buttons along the top and bottom borders of the case, so stick to classes please), assign it to a
    variable, and add that variable to the allBtns list. Then, add a new entry to the allFuncs JSON
    dictionary. The class name you gave to the <li> should be the key, and the value should be the function you
    want your button to execute on click.
*/
var claimQuickBtn = '<li class="claimQuickBtn">Claim</li>';
var incomingQuickBtn = '<li class="incomingQuickBtn">Incoming</li>';
var featurizeQuickBtn = '<li class="featurizeQuickBtn">Featurize</li>';
var greenQuickBtn = '<li class="greenQuickBtn">Green</li>';
var yellowQuickBtn = '<li class="yellowQuickBtn">Yellow</li>';
var redQuickBtn = '<li class="redQuickBtn" style="margin-right:5px;">Red</li>';
var allBtns = [claimQuickBtn, incomingQuickBtn, featurizeQuickBtn, greenQuickBtn, yellowQuickBtn, redQuickBtn];
var allFuncs = {
    ".claimQuickBtn":function(){
        // console.log('assigning ticket to you');
        assignToUser($('#username').text());
    },
    ".incomingQuickBtn":function(){
        // console.log('assigning ticket to Incoming, setting priority to "7 - Undecided"');
        assignToUser('Incoming');
        setPriority('--', '--');
    },
    ".featurizeQuickBtn":function(){
        // console.log('setting Milestone to "Features - Minor", Category to "Feature", Impact to "Feature", Probability to "--" and Priority to "3 - Green"')
        setMilestone('Features - Minor');
        assignToUser('Up For Grabs');
        setCategory('Feature');
        setImpact('Feature');
        setProbability('--');
        setPriority('Low', 'Low');
    },
    ".greenQuickBtn":function(){
        // console.log('setting assignment to "Up For Grabs", priority to "3 - Green"');
        setMilestone('Bug Backlog');
        assignToUser('Up For Grabs');
        setImpact('Low');
        setProbability('Low');
        setPriority('Low','Low');
    },
    ".yellowQuickBtn":function(){
        // console.log('setting assignment to "Up For Grabs", priority to "2 - Yellow"');
        setMilestone('Bug Backlog');
        assignToUser('Up For Grabs');
        setImpact('Medium');
        setProbability('Medium');
        setPriority('Medium','Medium');
    },
    ".redQuickBtn":function(){
        // console.log('setting priority to "1 - Red"');
        setMilestone('Bug Backlog');
        assignToUser('Up For Grabs');
        setImpact('High');
        setProbability('High');
        setPriority('High','High');
    }
};


/***************************************** DOM Events *****************************************/

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

$(document.body).ready(function(){
    //console.log("document body ready " + window.location.href);
    if(window.location.href.indexOf("command=new")>-1){
        appendQuickButtons(allBtns, allFuncs, true);
    }
});

$('#edit0').click(function(){
    appendQuickButtons(allBtns, allFuncs, false);
});

$('.actionButton2.edit').click(function(){
    appendQuickButtons(allBtns, allFuncs, false);
});

$('.actionButton2.reopen').click(function(){
    appendQuickButtons(allBtns, allFuncs, false);
});

$('.actionButton2.editClosed').click(function(){
    appendQuickButtons(allBtns, allFuncs, false);
});
