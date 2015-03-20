var theTextShadowValue = "1px 1px 12px COLOR, -1px -1px 12px COLOR, 1px -1px 12px COLOR, -1px 1px 12px COLOR";
var theImageShadowValue = "drop-shadow(5px 5px 5px COLOR)";
var cardCount = parseInt($("[data-js='sassVariableCardCount']").css("font-size"), 10);


function drawIt() {
    var $sourceElement = $(".sourceElement");
    var elemWidth = parseInt($sourceElement.css("width"),10);
    var elemHeight = parseInt($sourceElement.css("height"),10);
    var $sourceHTML = $sourceElement.html();

    var canv = document.createElement("canvas");
        canv.width = elemWidth;
        canv.height = elemHeight;
        canv.id = "canvas";

    var saveCardText = "<span class=\"save-card\">Right click and \"Save Image\"</span>";

    $(".card-output")
        .html(canv)
        .append(saveCardText);

    var canvas = document.getElementById('canvas');
    $(".SoB").addClass("-drawing");
    rasterizeHTML.drawHTML($sourceHTML, canvas)
        .then(function success(renderResult) {
            $(".SoB").removeClass("-drawing");
        }, function error(e) {
            console.log("error");
            $(".SoB").removeClass("-drawing");
        });
    console.log("after");
}

function initDraggable() {
    $(".draggable").draggable({
        containment: 'parent'
    });
}

function addTextElement() {
    var text = document.createElement("div");
        text.className = "text draggable -noshadow";
        text.innerHTML = "new text";
        text.contentEditable = "true";

    $(text)
        .appendTo(".card-input")
        .draggable();
}

function formatText(encode, someText) {
    var re,
        str = someText,
        subst;

    // ---------------
    // -- BOLD Text --
    // ---------------
    if(encode) {
        re = /\*\*([^\*{2}]*)\*\*/gm;
        subst = '<span class="-bold">$1</span>';

        str = str.replace(re, subst);
    }
    else {
        re = /<span class="-bold">([^<]*)<\/span>/gm;
        subst = '**$1**';

        str = str.replace(re, subst);
    }
    // ------------------
    // -- Itallic Text --
    // ------------------
    if(encode) {
        re = /\+\+([^\+{2}]*)\+\+/gm;
        subst = '<span class="-italic">$1</span>';

        str = str.replace(re, subst);
    }
    else {
        re = /<span class="-italic">([^<]*)<\/span>/gm;
        subst = '++$1++';

        str = str.replace(re, subst);
    }
    // --------------------
    // -- Underline Text --
    // --------------------
    if(encode) {
        re = /\_\_([^\_{2}]*)\_\_/gm;
        subst = '<span class="-underline">$1</span>';

        str = str.replace(re, subst);
    }
    else {
        re = /<span class="-underline">([^<]*)<\/span>/gm;
        subst = '__$1__';

        str = str.replace(re, subst);
    }

    return str;
}

function changeBackground() {
    var $cardArea = $(".card-input"),
        currentCardClass = "",
        currentCardClassNumber,
        newCardClassNumber,
        newCardClass;

    var classList = $cardArea[0].className.split(/\s+/);
    for (var i = 0; i < classList.length; i++) {
        if (classList[i].indexOf("card-background-") > -1) {
            currentCardClass = classList[i];
        }
    }
    if(currentCardClass === "") {
        currentCardClass = "card-background-1";
    }

    currentCardClassNumber = parseInt(currentCardClass.replace(/card\-background\-/gi,""), 10);
    if(currentCardClassNumber == cardCount) {
        newCardClassNumber = 1;
    } else {
        newCardClassNumber = currentCardClassNumber + 1;
    }

    newCardClass = "card-background-" + newCardClassNumber;

    $cardArea
        .removeClass(currentCardClass)
        .addClass(newCardClass);
}

function appendHelper($el) {
    $el
        .append(theX)
        .append(theMinus)
        .append(thePlus)
        .append(theRotateLeft)
        .append(theRotateRight)
        .append(theShadow)
        .append(theShadowColor)
        .append(theColor)
        .append(theBefore)
        .append(theAfter);
}

function detachHelper() {
    $(".theHelper").detach();
}

function init() {
    // make elements draggable
    initDraggable();

    // listeners
    $("body").on("click", "#btnDrawit", function(){
        drawIt();
    });
    $("body").on("click", "#btnAddText", function(){
        addTextElement();
    });
    $("body").on("click", "#btnAddImage", function(){
        $("#file-input").click();
    });
    $("body").on("click", "#btnBackground", function(){
        changeBackground();
    });
    $("body").on("mouseenter mouseleave keydown", ".draggable", function(evt) {
        var $target = $(evt.target),
            targetType = "";

        if($target.hasClass("text")) { targetType = "text"; }
        else if($target.hasClass("image")) { targetType = "image"; }

        if(evt.type === "mouseenter") {
            if( $(evt.currentTarget).find("theX").length === 0 ) {
                appendHelper($(evt.currentTarget));
            }

            if(targetType === "text") {
                $target.attr({"contenteditable": "true"});
            }

            $target = $(evt.target);
            if($target.hasClass("text")) {
                $target.html(formatText(false, $target.html()));
            }
        }

        if(evt.type === "keydown") {
            detachHelper();
        }

        if(evt.type === "mouseleave") {
            detachHelper();

            if(targetType === "text") {
                $target.attr({"contenteditable": "false"});
            }

            if($target.hasClass("text")) {
                $target.html(formatText(true, $target.html()));
            }
        }
    });

    document.getElementById('file-input').onchange = function (evt) {
        window.URL = window.URL || window.webkitURL;
        var img = document.createElement("img");
        img.src = window.URL.createObjectURL(evt.target.files[0]);

        $("<div class='image draggable -noshadow'>").append(img)
            .appendTo(".card-input")
            .draggable();

        // clear input form so we can upload the same image again
        $(this).val("");
    };
}

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform")    ||
        obj.css("-ms-transform")     ||
        obj.css("-o-transform")      ||
        obj.css("transform");

    var angle;
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else {
        angle = 0;
    }
    return (angle < 0) ? angle + 360 : angle;
}

var theX = $("<div class='theHelper theX'>X</div>");
    $("body").on("click", ".theX", function(){
        var $this = $(this);
        $this.parent().detach();
    });

var theMinus = $("<div class='theHelper theMinus'>-</div>");
    $("body").on("click", ".theMinus", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");

        if (isText) {
            var fontSize = parseInt($this.parent().css("font-size"), 10);
            $this.parent().css({"font-size": fontSize - 5});
        }
        else {
            var $img = $this.parent().find("img");
            var imgSize = parseInt($img.width(), 10);
            $img.width(imgSize - 10);
        }
    });

var thePlus = $("<div class='theHelper thePlus'>+</div>");
    $("body").on("click", ".thePlus", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");

        if (isText) {
            var fontSize = parseInt($this.parent().css("font-size"), 10);
            $this.parent().css({"font-size": fontSize + 5});
        }
        else {
            var $img = $this.parent().find("img");
            var imgSize = parseInt($img.width(), 10);
            $img.width(imgSize + 10);
        }
    });

var theRotateLeft = $("<div class='theHelper theRotateLeft'>L</div>");
    $("body").on("click", ".theRotateLeft", function(){
        console.log("WTF");
        var $this = $(this);

        var $theObj = $this.parent();
        var currentRotate = parseInt(getRotationDegrees($theObj),10);
        console.log("currentRotate: " + currentRotate);
        $theObj.css({"transform": "rotate(" + (currentRotate - 10).toString() + "deg)"});
    });

var theRotateRight = $("<div class='theHelper theRotateRight'>R</div>");
    $("body").on("click", ".theRotateRight", function(){
        console.log("WTF");
        var $this = $(this);

        var $theObj = $this.parent();
        var currentRotate = parseInt(getRotationDegrees($theObj),10);
        console.log("currentRotate: " + currentRotate);
        $theObj.css({"transform": "rotate(" + (currentRotate + 10).toString() + "deg)"});
    });

var theBefore = $("<div class='theHelper theBefore'>&laquo;</div>");
    $("body").on("click", ".theBefore", function(){
        var $thisParent = $(this).parent();
        var $before = $thisParent.prev();

        $thisParent.insertBefore($before);
    });

var theAfter = $("<div class='theHelper theAfter'>&raquo;</div>");
    $("body").on("click", ".theAfter", function(){
        var $thisParent = $(this).parent();
        var $after = $thisParent.next();

        $thisParent.insertAfter($after);
    });

var theColor = $("<input type='color' name='theColor' class='theHelper theColor' />");
    $("body").on("change", ".theColor", function(){
        var colorValue = this.value;
        var $thisParent = $(this).parent();

        $thisParent.css({"color": colorValue});
    });

var theShadowColor = $("<input type='color' name='theShadowColor' class='theHelper theShadowColor' />");
    $("body").on("change", ".theShadowColor", function(){
        var colorValue = this.value,
            $thisParent = $(this).parent(),
            isText = $thisParent.hasClass("text"),
            newFormattedValue;

        if(isText) {
            newFormattedValue = theTextShadowValue.replace(/COLOR/gm, colorValue);
            $thisParent.css({"text-shadow": newFormattedValue});
        }
        else {
            newFormattedValue = theImageShadowValue.replace(/COLOR/gm, colorValue);
            $thisParent.find("img").css({
                "filter": newFormattedValue,
                "-webkit-filter": newFormattedValue
            });
        }

    });

var theShadow = $("<div class='theHelper theShadow'>s</div>");
    $("body").on("click", ".theShadow", function(){
        var $this = $(this),
            $thisParent = $(this).parent(),
            isText = $thisParent.hasClass("text"),
            showShadow;

        if(isText) {
            showShadow = $thisParent.css("text-shadow") === "none";
        }
        else {
            showShadow = ($thisParent.find("img").css("-webkit-filter") === "none" && $thisParent.find("img").css("filter") === "none");
        }

        $thisParent.toggleClass("-shadow", showShadow);
        $thisParent.toggleClass("-noshadow", !showShadow);
    });

$("body").on("click", function(evt){
    console.log("click target:" + evt.target.className);
});



$( document ).ready(function() {
    init();
});