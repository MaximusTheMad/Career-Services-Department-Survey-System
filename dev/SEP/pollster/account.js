function changepic(){
    $("#ppUpload").click();
}

function getAccountInfo(){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "GET",
        data: ({accountInfo: "yes"}),
        success: function(response){
            var email = response;
            $("#email").val(email);
        },
        error: function(jqxr, status, exception){
            alert("Failing at getAccountInfo() ajax call in account.js: " + exception);
        }
    });
}

function getPP(){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "GET",
        data: ({profpic: "yes"}),
        success: function(response){
            var ppLocation = response;
            $("#ppHolder").html("<img id='profPic' src='" + ppLocation + "' class='profilepic'>");
        },
        error: function(jqxr, status, exception){
            alert("Failing at getPP() ajax call in account.js: " + exception);
        }
    });
    $("#ppUpload").change(function(){
        var file = document.getElementById("ppUpload").files[0];
        var fr = new FileReader();
        var profPic;
        var base64ImageContent;
        fr.onload = function(){
            profPic = new Image();
            profPic.onload = function(){
                base64ImageContent = getBase64Image(profPic);
                var toSend = new FormData();
                toSend.append('profPic', base64ImageContent);
                toSend.append('aType', "POLL");
                setPP(toSend);
            }
            profPic.src = fr.result;
        }
        fr.readAsDataURL(file);
    });
}

function setPP(toSend){
    $.ajax({
        type: "POST",
        processData: false,
        contentType: false,
        data: toSend,
        url: "../index.php",
        success: function(response){
            var ppLocation = response;
            $("#ppHolder").html("Loading...");
            $("#ppHolder").html("<img id='profPic' src='" + ppLocation + "' class='profilepic'>");    
        },
        error: function(jqxr, status, exception){
            alert("Failing at profilePic upload ajax call in account.js: " + exception);
        }
    });
}

function save(){
    if($("#email").val() != ""){
        var email = $("#email").val();
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
            $("#errorMessage").html("Not a valid email");
            return false;
        }
    }
    if($("#password").val() != ""){
        if($("#password").val() != $("#password-confirm").val()){
            $("#errorMessage").html("Passwords must match");
            return false;
        }
    }
    $("#errorMessage").html("");
    return true;
}

function fixForEmbed(){
    $("#accountInfoForm").submit(function(){
        save();
    });
}