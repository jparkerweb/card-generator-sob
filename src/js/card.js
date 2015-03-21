var theTextShadowValue = "1px 1px 12px COLOR, -1px -1px 12px COLOR, 1px -1px 12px COLOR, -1px 1px 12px COLOR";
var theImageShadowValue = "drop-shadow(5px 5px 5px COLOR)";
var cardCount = parseInt($("[data-js='sassVariableCardCount']").css("font-size"), 10);
var fontCount = parseInt($("[data-js='sassVariableFontCount']").css("font-size"), 10);

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;




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
        text.className = "text draggable ";
        text.innerHTML = "<span class=\"text__text custom-font-1\">plain <span class=\"-bold\">bold</span> <span class=\"-italic\">italic</span> <span class=\"-underline\">underline</span></span>";

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


function changeBackground(direction) {
    var next = (direction !== "prev");

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
    if(cardCount > 1) {
        if(currentCardClassNumber == cardCount) {
            if(next) {
                newCardClassNumber = 1;
            } else {
                newCardClassNumber = cardCount - 1;
            }
        } else {
            if(next) {
                newCardClassNumber = currentCardClassNumber + 1;
            } else {
                if(currentCardClassNumber === 1) {
                    newCardClassNumber = cardCount;
                } else {
                    newCardClassNumber = currentCardClassNumber - 1;
                }
            }
        }
    }

    newCardClass = "card-background-" + newCardClassNumber;

    $cardArea
        .removeClass(currentCardClass)
        .addClass(newCardClass);

    var $sourceElement = $(".sourceElement");

    $sourceElement.find('[data-js*="cardBackground"]').appendTo("head");
    $sourceElement.append($('[data-js="cardBackground' + newCardClassNumber + '"]'));
}

function appendHelper($el) {
    $el
        .append(theX)
        .append(theMinus)
        .append(thePlus)
        .append(theRotateLeft)
        .append(theRotateRight)
        .append(theWidthSmaller)
        .append(theWidthLarger)
        .append(theBefore)
        .append(theAfter)
        .append(theText)
        .append(theFont)
        .append(theShadow)
        .append(theShadowColor)
        .append(theColor);
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
    $("body").on("click", "#btnBackgroundPrev", function(){
        changeBackground("prev");
    });
    $("body").on("click", "#btnBackgroundNext", function(){
        changeBackground("next");
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
        }

        if(evt.type === "keydown") {
            detachHelper();
        }

        if(evt.type === "mouseleave") {
            detachHelper();
        }
    });

    // file upload listener
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


    // setup card background assets
    generateCardAssets();
    // set 1st card background
    changeBackground();
}

function generateCardAssets() {
    // get and write card assets
    var c = 0;
    for(var i = 0; i < document.styleSheets.length; i++) {
        if(document.styleSheets[i].href !== null && document.styleSheets[i].href.indexOf("card.css") > -1) {
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            for(var x in rules) {
                if (typeof rules[x].cssText != 'undefined' && rules[x].cssText.indexOf(".card-background-") > -1) {
                    //console.log(rules[x]);
                    c += 1;
                    var cssText = rules[x].cssText.replace(/(url\().*\/(ass)/gmi,"$1$2");
                    var newStyle = $("<style type=\"text/css\" data-js=\"cardBackground" + c + "\">" + cssText + "</style>");
                    $("head").append(newStyle);
                    if(c === cardCount) {
                        return false;
                    }
                }
            }
        }
    }
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
            var $text = $this.parent().find("span.text__text");
            var fontSize = parseInt($text.css("font-size"), 10);
            $text.css({"font-size": fontSize - 5});
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
            var $text = $this.parent().find("span.text__text");
            var fontSize = parseInt($text.css("font-size"), 10);
            $text.css({"font-size": fontSize + 5});
        }
        else {
            var $img = $this.parent().find("img");
            var imgSize = parseInt($img.width(), 10);
            $img.width(imgSize + 10);
        }
    });


var theRotateLeft = $("<div class='theHelper theRotateLeft'>L</div>");
    $("body").on("click", ".theRotateLeft", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");
        var $theObj;

        if(isText) {
            $theObj = $this.parent().find("span.text__text");
        }
        else {
            $theObj = $this.parent().find("img");
        }

        var currentRotate = parseInt(getRotationDegrees($theObj),10);
        $theObj.css({"transform": "rotate(" + (currentRotate - 10).toString() + "deg)"});
    });


var theRotateRight = $("<div class='theHelper theRotateRight'>R</div>");
    $("body").on("click", ".theRotateRight", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");
        var $theObj;

        if(isText) {
            $theObj = $this.parent().find("span.text__text");
        }
        else {
            $theObj = $this.parent().find("img");
        }

        var currentRotate = parseInt(getRotationDegrees($theObj),10);
        $theObj.css({"transform": "rotate(" + (currentRotate + 10).toString() + "deg)"});
    });


var theWidthSmaller = $("<div class='theHelper theWidthSmaller'>W-</div>");
    $("body").on("click", ".theWidthSmaller", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");
        var $theObj;

        if(isText) {
            $theObj = $this.parent().find("span.text__text");
        }
        else {
            $theObj = $this.parent().find("img");
        }

        var currentWidth = parseInt($theObj.width(), 10);
        $theObj.css({"width": (currentWidth - 10).toString() + "px"});
    });


var theWidthLarger = $("<div class='theHelper theWidthLarger'>W+</div>");
    $("body").on("click", ".theWidthLarger", function(){
        var $this = $(this);
        var isText = $this.parent().hasClass("text");
        var $theObj;

        if(isText) {
            $theObj = $this.parent().find("span.text__text");
        }
        else {
            $theObj = $this.parent().find("img");
        }

        var currentWidth = parseInt($theObj.width(), 10);
        $theObj.css({"width": (currentWidth + 10).toString() + "px"});
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


var $hiddenTextSource;
var theText = $("<div class='theHelper theText'>T</div>");
    $("body").on("click", ".theText", function(){
        var $thisParent = $(this).parent();
        var $text = $thisParent.find("span.text__text");
        var textValue = formatText(false, $text.text());
        var $textarea = $("#editText");

        $hiddenTextSource = $text;

        $("body").addClass("-edit-text");
        $textarea.val(textValue).focus();
    });

    $("body").on("click", '[data-js="buttonSave"]', function(){
        var $textarea = $("#editText");
        var newTextValue = formatText(true, $textarea.val());
        $hiddenTextSource.html(newTextValue);

        $textarea.val("");
        $("body").removeClass("-edit-text");
    });

    $("body").on("click", '[data-js="buttonCancel"]', function(){
        var $textarea = $("#editText");

        $textarea.val("");
        $("body").removeClass("-edit-text");
    });


var theFont = $("<div class='theHelper theFont'>F</div>");
    $("body").on("click", ".theFont", function(){
        var $thisText = $(this).parent().find("span.text__text");
        var currentFontNumber;

        var classList = $thisText[0].className.split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('custom-font-') > -1) {
                 currentFontNumber = parseInt(classList[i].replace(/custom\-font\-/g,''), 10);
                 break;
            }
        }

        var newFontNumber;
        if(currentFontNumber === fontCount) {
            newFontNumber = 1;
        }
        else {
            newFontNumber = currentFontNumber + 1;
        }

        $thisText.removeClass("custom-font-" + currentFontNumber);
        $thisText.addClass("custom-font-" + newFontNumber);
    });


var theColor = $("<input type='color' name='theColor' class='theHelper theColor' />");
    $("body").on("change", ".theColor", function(){
        var colorValue = this.value;
        var $thisParent = $(this).parent();

        $thisParent.css({"color": colorValue});
    });


var theShadow = $("<div class='theHelper theShadow'>s</div>");
    $("body").on("click", ".theShadow", function(){
        var $this = $(this),
            $thisParent = $(this).parent(),
            isText = $thisParent.hasClass("text"),
            showShadow;

        if(isText) {
            showShadow = $thisParent.find("span.text__text").css("text-shadow") === "none";
        }
        else {
            showShadow = ($thisParent.find("img").css("-webkit-filter") === "none" && $thisParent.find("img").css("filter") === "none");
        }

        $thisParent.toggleClass("-shadow", showShadow);
        $thisParent.toggleClass("-noshadow", !showShadow);
    });


var theShadowColor = $("<input type='color' name='theShadowColor' class='theHelper theShadowColor' />");
    $("body").on("change", ".theShadowColor", function(){
        var colorValue = this.value,
            $thisParent = $(this).parent(),
            isText = $thisParent.hasClass("text"),
            newFormattedValue;

        if(isText) {
            newFormattedValue = theTextShadowValue.replace(/COLOR/gm, colorValue);
            $thisParent.find("span.text__text").css({"text-shadow": newFormattedValue});
        }
        else {
            newFormattedValue = theImageShadowValue.replace(/COLOR/gm, colorValue);
            $thisParent.find("img").css({
                "filter": newFormattedValue,
                "-webkit-filter": newFormattedValue
            });
        }

    });



$("body").on("click", function(evt){
    console.log("click target:" + evt.target.className);
});



$( document ).ready(function() {
    if(typeof SVGForeignObjectElement !== 'undefined') {
        init();
    }
    else {
        $("<div class=\"browser-support\">Only Chrome & Firefox are Supported</div>").prependTo(".SoB");
    }
});
