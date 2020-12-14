/* global $ */
$(document).ready(function() {

    async function displayUserLinks() {
        let response = await fetch(`/api/getPosts`);
        let data = await response.json();
        console.log(response);
        console.log(data);

        $("#results").html("");
        let htmlString = "";

        //builds a htmlString and then displays it within #results div
        data.forEach(function(row) {
            htmlString += '<a href=" ' + row.url + '" target="_blank"  class="card border-dark mb-3 post">';
            htmlString += "<u" + 'style = "display:inline">' + row.title + " (";
            htmlString += row.type + ")</u>";
            htmlString += "<br>" + row.description + "<br></a>";
        });
        console.log(htmlString);
        $("#results").append(htmlString);

    };
    displayUserLinks();
});
