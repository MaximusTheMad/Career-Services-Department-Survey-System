var questions;
var checkboxArray = [];
var radioArray = [];
var curLevel = 1;
var rLevelArray = new Array(7).fill(0);;

function getQuestionString(qNum, qText, rLevelClass){
    var toReturn = "<h3 class='question " + rLevelClass + "'>" + qNum + ") " + qText + "</h3>";
    return toReturn;
}

function getCheckboxString(ansOne, ansTwo, ansThree, ansFour, qNum, rLevelClass, rLevel){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="checkbox" level="' + rLevel + '" name="' + qNum + '" value="' + ansOne + '">' + ansOne + '</label>' + 
                    '<label class="question ' + rLevelClass + '"><input type="checkbox" level="' + rLevel + '" name="' + qNum + '" value="' + ansTwo + '">' + ansTwo + '</label>';
    if(ansThree != null){
        toReturn += '<label class="question ' + rLevelClass + '"><input type="checkbox" level="' + rLevel + '" name="' + qNum + '" value="' + ansThree + '">' + ansThree + '</label>';
    }
    if(ansFour != null){
        toReturn += '<label class="question ' + rLevelClass + '"><input type="checkbox" level="' + rLevel + '" name="' + qNum + '" value="' + ansFour + '">' + ansFour + '</label>';
    }
    return toReturn;
}

function getMultipleChoiceString(ansOne, ansTwo, ansThree, ansFour, qNum, rLevelClass, rLevel){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="' + ansOne + '">' + ansOne + '</label>' + 
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="' + ansTwo + '">' + ansTwo + '</label>';
    if(ansThree != null){
        toReturn += '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="' + ansThree + '">' + ansThree + '</label>';
    }
    if(ansFour != null){
        toReturn += '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="' + ansFour + '">' + ansFour + '</label>';
    }
    return toReturn;
}

function getScaleString(qNum, rLevelClass, rLevel){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="sta">Strongly Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="a">Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="sla">Slightly Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="sld">Slightly Disagree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="d">Disagree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="std">Strongly Disagree</label>';
    return toReturn;
}

function getTrueFalseString(qNum, rLevelClass, rLevel){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="t">True</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" level="' + rLevel + '" name="' + qNum + '" value="f">False</label>';
    return toReturn;
}

function showQuestions(){
    $(document).ready(function(){
        $.ajax({
            url:'uSurvey.php',
            cache:false,
            success:function(data){
                questions = JSON.parse(data);
                var index = "I";
                var rLevelClass;
                for(i=0; i<Object.keys(questions).length; i++){
                    var rLevel = questions[index]["rLevel"];
                    rLevelArray[rLevel]++;
                    switch(rLevel){
                        case 1:
                            rLevelClass = "iiiiii";
                            break;
                        case 2:
                            rLevelClass = "iiiii";
                            break;
                        case 3:
                            rLevelClass = "iiii";
                            break;
                        case 4:
                            rLevelClass = "iii";
                            break;
                        case 5:
                            rLevelClass = "ii";
                            break;
                        case 6:
                            rLevelClass = "i";
                    }
                    $('#questions-wrapper').append(getQuestionString(questions[index]["qNum"], questions[index]["qText"], rLevelClass));
                    var qNum = questions[index]["qNum"];
                    var qType= questions[index]["qType"];
                    var questionBody;
                    switch(qType){
                        case "chk":
                            questionBody = getCheckboxString(questions[index]["ansOne"], questions[index]["ansTwo"], questions[index]["ansThree"], questions[index]["ansFour"], qNum, rLevelClass, rLevel);
                            break;
                        case "mc":
                            questionBody = getMultipleChoiceString(questions[index]["ansOne"], questions[index]["ansTwo"], questions[index]["ansThree"], questions[index]["ansFour"], qNum, rLevelClass, rLevel);
                            break;
                        case "s":
                            questionBody = getScaleString(qNum, rLevelClass, rLevel);
                            break;
                        case "tf":
                            questionBody = getTrueFalseString(qNum, rLevelClass, rLevel);
                            break;
                        default:
                            alert("Uh oh. Something went wrong");
                    }
                    index = index + "I";
                    $('#questions-wrapper').append(questionBody);
                }
                $('#questions-wrapper').append("<input type='submit' id='submit' value='Submit Survey' class='question btn btn-primary btn-survey " + rLevelClass + "'>");
                $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">');
                document.getElementById("continue").onclick = function(){loadNext();};
                $('[type="checkbox"]').each(function(i, ele){
                    $(ele).on("click", function(){
                        updateCheckboxes(ele);
                    });
                });
                $('[type="radio"]').each(function(i, ele){
                    $(ele).on("click", function(){
                        updateRadioButtons(ele);
                    });
                });
            }
        });
    });
}

function loadNext(){
    if(checkAnswers()){
        $('.question').each(function(i, ele){
            ele.className += "i";
        });
        if($('#submit').is(':visible')){
            $('#continue').css('display', 'none');
        }
        if($("#back").length > 0){
            $('#back').css('display', 'block');
        }
        else{
            $('#questions-wrapper').append('<input type="button" value="Back" id="back" class="btn btn-survey">');
            document.getElementById("back").onclick = function(){loadLast();};
        }
        var numOfQuestions = 0;
        for(i = 1; i <= curLevel; i++){
            numOfQuestions += rLevelArray[i];
        }
        if(checkboxArray.length + radioArray.length != numOfQuestions){
            document.getElementById('errorMessage').innerHTML = "Please answer all questions";
            return false;
        }
        document.getElementById('errorMessage').innerHTML = "";
        curLevel++;
    }
}

function loadLast(){
    $('.question').each(function(i, ele){
        ele.className = ele.className.slice(0, -1);
    });
    if(!$('#submit').is(':visible')){
        $('#continue').css('display', 'block');
    }
    if(!($(".iiiiiii").length > 0)){
        $('#back').css('display', 'none');
    }
    curLevel--;
    $(".question input").each(function(i, ele){
        if($(ele).attr("level") > curLevel){
            $(ele).prop("checked", false);
        }
    });
    for(i = 0; i < checkboxArray.length; i++){
        if(checkboxArray[i].rLevel > curLevel){
            checkboxArray.splice(i,1);
        }
    }
    for(i = 0; i < radioArray.length; i++){
        if(radioArray[i].rLevel > curLevel){
            radioArray.splice(i,1);
            i--;
        }
    }
    document.getElementById('errorMessage').innerHTML = "";
}

function checkForEmpty(){
    var numOfQuestions = 0;
    for(i = 1; i <= curLevel; i++){
        numOfQuestions += rLevelArray[i];
    }
    if(checkboxArray.length + radioArray.length != numOfQuestions){
        document.getElementById('errorMessage').innerHTML = "Please answer all questions";
        return false;
    }
    return true;
}

function checkAnswers(){
    if(!checkForEmpty()){
        return false;
    }
    for(i = 0; i < radioArray.length; i++){
        var index = "";
        var qNum = radioArray[i].name;
        var ans = radioArray[i].value;
        for(j=0; j<qNum; j++){
            index += "I";
        }
        if(ans != questions[index]["qAns"] && questions[index]["qWeight"] == 2){
            document.getElementById("submit").click();
        }
    }
    for(i=0; i<checkboxArray.length; i++){
        var index = "";
        var qNum = checkboxArray[i].name;
        var ans = "";
        for(j=0; j < checkboxArray.length; j++){
            if(checkboxArray[j].name == qNum){
                ans += checkboxArray[j].value;
            }
        }
        for(j=0; j < qNum; j++){
            index += "I";
        }
        if(ans != questions[index]["qAns"] && questions[index]["qWeight"] == 2){
            document.getElementById("submit").click();
        }
    }
    return true;
}

function updateCheckboxes(sender){
    var exists = false;
    var sameName = false;
    var entry = {
        value: $(sender).attr("value"),
        name: $(sender).attr("name"),
        rLevel: $(sender).attr("level")
    };
    for(i = 0; i < checkboxArray.length; i++){
        if(checkboxArray[i].value == entry.value && checkboxArray[i].name == entry.name){
            exists = true;
            checkboxArray.splice(i, 1);
        }
        else if(checkboxArray[i].name == entry.name){
            sameName = true;
            checkboxArray[i].value = checkboxArray[i].value + entry.value;
        }
    }
    if(!exists && !sameName){
        checkboxArray.push(entry);
    }
}

function updateRadioButtons(sender){
    var entry = {
        value: $(sender).attr("value"),
        name: $(sender).attr("name"),
        rLevel: $(sender).attr("level")
    };
    for(i = 0; i < radioArray.length; i++){
        if(radioArray[i].name == entry.name){
            radioArray.splice(i, 1);
        }
    }
    radioArray.push(entry);
}