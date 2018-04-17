function showPinsAndGroups(pin){
    var html =  constructInitialGroupPinHTML(pin, "General");
    $("#pinsandgroups").append(html);
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function constructInitialGroupPinHTML(pin, groupName){
    var html =  "<table class='qTable' id='pinTable'>\
                    <tr>\
                        <th class='center-th'>Group Name</th>\
                        <th class='center-th'>PIN</th>\
                        <th class='center-th'>Generate New</th>\
                        <th class='center-th'>Add/Remove</th>\
                    </tr>\
                    <tr>\
                        <th class='center-th' style='padding-right: 10px'><input class='form-control qChoice' value='" + groupName + "' placeholder='Enter Group Name' type='text'></th>\
                        <th class='center-th pinHolder'>" + pin + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice-disabled'>&#10799</span></th>\
                    </tr>\
                </table>";
    return html;
}

function showPinsAndGroupsFilled(surveyName, surveyText){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "POST",
        data: ({manageSurveyEditPins: "filler", surText: surveyText, surName: surveyName, aType: "POLL"}),
        success: function(response){
            var pinGroupArray = JSON.parse(response);
            var html = constructInitialGroupPinHTML(pinGroupArray[0].pin, pinGroupArray[0].groupName);
            $("#pinsandgroups").append(html);
            for(var i = 1; i < pinGroupArray.length; i++){
                $('.qTable').append(constructGroupPinHTML(pinGroupArray[i].pin, pinGroupArray[i].groupName));
            }
            $(".refreshPin").each(function(i, ele){
                $(ele).unbind('click');
                $(ele).on('click', function(){
                    refreshPin(ele);
                });
            });
            $(".add-choice").each(function(i, ele){
                $(ele).unbind('click');
                $(ele).on("click", function(){
                    addGroup(ele);
                });
            });
            $(".remove-choice").each(function(i, ele){
                $(ele).unbind('click');
                $(ele).on("click", function(){
                    removeGroup(ele);
                });
            });
        },
        error: function(jqxr, status, exception){
            alert("Failing at showPinsAndGroupsFilled() ajax call in manageSurvey.js: " + exception);
        }
    });
}

function refreshPin(ele){
    $(ele).parent().parent().find(".pinHolder").html(Math.floor(Math.random()*(9999-1001)+1000));
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function addGroup(ele){
    $(ele).parent().parent().parent().append(constructGroupPinHTML(Math.floor(Math.random()*(9999-1000+1)+1000), ""));
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function removeGroup(ele){
    $(ele).parent().parent().remove();
}

function constructGroupPinHTML(pin, groupName){
    var toReturn =  "<tr>\
                        <th class='center-th' style='padding-right: 10px'><input class='form-control qChoice' value='" + groupName + "' placeholder='Enter Group Name' type='text'></th>\
                        <th class='center-th pinHolder'>" + pin + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
    return toReturn;
}

function showResources(){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "POST",
        data: ({manageSurveyInitial: "showResources", aType: "POLL"}),
        success: function(response){
            for(var i = 1; i < response; i++){
                $("#resources").append(constructResourceHTML(i, ""));
                var selector = ".mdhtmlform-md[data-mdhtmlform-group='" + (i-1) + "']";
                new MdHtmlForm($(selector));
                $(".btn-bold").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        embolden(ele);
                    });
                });
                $(".btn-italic").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        italicize(ele);
                    });
                });
                $(".btn-link").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        showLink(ele);
                    });
                });
                $(".btn-bullets").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        bullet(ele);
                    });
                });
            }
        },
        error: function(jqxr, status, exception){
            alert("Failing at showResources() ajax call in manageSurvey.js");
        }
    });
}

function parseResource(resourceText){
    var doc = new DOMParser().parseFromString(resourceText.substring(59), 'text/html');
    return doc.body.textContent || "";
}

function showResourcesFilled(surveyName){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "POST",
        data: ({manageSurveyEditResources: "showResources", surName: surveyName, aType: "POLL"}),
        success: function(response){
            var resourceArray = JSON.parse(response);
            for(var i = 0; i < resourceArray.length; i++){
                $("#resources").append(constructResourceHTML(i+1, parseResource(resourceArray[i].resources)));
                var selector = ".mdhtmlform-md[data-mdhtmlform-group='" + i + "']";
                new MdHtmlForm($(selector));
                alert("here");
                $(".btn-bold").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        embolden(ele);
                    });
                });
                $(".btn-italic").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        italicize(ele);
                    });
                });
                $(".btn-link").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        showLink(ele);
                    });
                });
                $(".btn-bullets").each(function(i, ele){
                    $(ele).unbind('click');
                    $(ele).on("click", function(){
                        bullet(ele);
                    });
                });
                $("textarea").each(function(i, ele){
                    $(ele).focus();
                });
            }
        },
        error: function(jqxr, status, exception){
            alert("Failing at showResourcesFilled() ajax call in manageSurvey.js: " + exception);
        }
    });
}

function replaceSelectedText(ele, text, start, end) {
    var original = $(ele).val();
    var replaced = original.slice(0, start) + text + original.slice(end);
    $(ele).val(replaced);
}

function embolden(ele){
    var textarea = $(ele).parent().parent().find(".resource");
    var selected = $(textarea).getSelection();
    var original = selected.text;
    var start = selected.start;
    var end = selected.end;
    var emboldened = "**" + original + "**";
    replaceSelectedText(textarea, emboldened, start, end);
    $(textarea).focus();
}

function italicize(ele){
    var textarea = $(ele).parent().parent().find(".resource");
    var selected = $(textarea).getSelection();
    var original = selected.text;
    var start = selected.start;
    var end = selected.end;
    var italicized = "*" + original + "*";
    replaceSelectedText(textarea, italicized, start, end);
    $(textarea).focus();
}

function showLink(ele){
    var textarea = $(ele).parent().parent().find(".resource");
    var selected = $(textarea).getSelection();
    var url = window.prompt("Please enter the url for the link: ");
    if(url != null){
        var name = window.prompt("Please enter the text you want the link to show: ");
        if(name != null){
            var linkText = "[" + name + "](" + url + ")";
            var start = selected.start;
            var end = selected.end;
            replaceSelectedText(textarea, linkText, start, end);
            $(textarea).focus();
        }
    }
}

function bullet(ele){
    var textarea = $(ele).parent().parent().find(".resource");
    var selected = $(textarea).getSelection();
    var start = selected.start;
    var end = selected.end;
    var replaced = "*  bullet\n*  bullet\n*  bullet\n*  bullet";
    replaceSelectedText(textarea, replaced, start, end);
    $(textarea).focus();
}

function constructResourceHTML(level, resourceText){
    var toReturn =  "<div>\
                        <h3>Section " + level + ":</h3>\
                        <div class='button-bar'>\
                            <span class='edit-btn btn-bold'><b>&#x1d400</b></span>\
                            <span class='edit-btn btn-italic'><i>𝐴</i></span>\
                            <span class='edit-btn btn-link'><b>&#x1f517</b></span>\
                            <span class='edit-btn btn-bullets'>&#x2022</span>\
                        </div>\
                    <br/>\
                        <textarea class='form-control resource mdhtmlform-md' data-mdhtmlform-group='" + (level-1) + "' placeholder='End of Survey Resources/Links'>" + resourceText + "</textarea>\
                    <br/>\
                        <div class='preview mdhtmlform-html' data-mdhtmlform-group='" + (level-1) + "'>\
                        </div>\
                    </div>"
    return toReturn;
}

function checkInputs(){
    $("textarea").each(function(i,ele){
        if($(ele).val() == ""){
            return false;
        }
    });
    $(".qChoice").each(function(i,ele){
        if($(ele).val() == ""){
            return false;
        }
    });
    return true;
}

function resourceFormat(text){
    var str = "<h3>Here are some further resources you can check out:</h3>" + text;
    return str;
}

function save(){
    if(checkInputs()){
        var resourceArray = [];
        $(".preview").each(function(i,ele){
            resourceArray.push(resourceFormat($(ele).html()));
        });
        var pinArray = [];
        $(".pinHolder").each(function(i,ele){
            pinArray.push($(ele).html());
        });
        var groupArray = [];
        $(".qChoice").each(function(i,ele){
            groupArray.push($(ele).val());
        });
        post(resourceArray, pinArray, groupArray);
    }
}

function post(resourceArray, pinArray, groupArray){
    var resources = JSON.stringify(resourceArray);
    var pins = JSON.stringify(pinArray);
    var groups = JSON.stringify(groupArray);
    var form =  $( "<form action='../index.php' method='POST'>\
                        <input type='hidden' name='resources' value='" + resources + "'>\
                        <input type='hidden' name='pins' value='" + pins + "'>\
                        <input type='hidden' name='groups' value='" + groups + "'>\
                        <input type='hidden' value='POLL' name='aType'>\
                    </form>");
    $("body").append(form);
    $(form).submit();
}