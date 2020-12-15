/* global $ */
$(document).ready(function() {
    $("#alert").hide();
    displayPostInfo();

    async function displayPostInfo() {
        let url = sessionStorage.getItem("lastPostUrl");
        // console.log(url);
        if(url == undefined || url == ""){
            disableForm();
            displayAlert("Sorry! You are only allowed to edit the last post you added.")
            return;
        }
        
        //Get post data from API.
        let response = await fetch(`/api/getPosts?action=url&url=${url}`);
        let data = await response.json();
        console.log(data); //testing
        
        if(data.length == 1){
            $("#url").val(data[0].url);
            $("#title").val(data[0].title);
            $("#description").val(data[0].description);
        } else {
            disableForm();
            displayAlert("Sorry! We were unable to find that post in the database.")
            return;
        }
    };
    
    function disableForm(){
        $("#url").prop("disabled", true);
        $("#title").prop("disabled", true);
        $("#description").prop("disabled", true);
        $("#submitBtn").hide();
    }
    
    function displayAlert(msg){
        $("#alert").text(msg);
        $("#alert").show();
    }
});
