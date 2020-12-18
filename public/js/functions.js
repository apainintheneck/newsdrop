/* global $ */
$(document).ready(function() {
    async function displayUserLinks(searchterm, sort) {
        var endpoint = `/api/getPosts?action=all`;
        if(searchterm || sort) {
            endpoint = `/api/getPosts?action=search`;
        }
        if(searchterm) {
            endpoint += '&searchterm='+searchterm;
        }
        if(sort) {
            endpoint += '&sort='+sort;
        }
        let response = await fetch(endpoint);
       
        let data = await response.json();
        // console.log(response); //testing
        // console.log(data); //testing

        $("#results").html("");
        let htmlString = "";

        //builds a htmlString and then displays it within #results div
        data.forEach(function(row) {
            var visited = localStorage.getItem('visited');
            var visitedClass = "";
            if(visited) {
                visited = JSON.parse(visited);
                if($.inArray(row.id.toString(), visited) !== -1) {
                    visitedClass = "visited";
                }
            }
            htmlString += '<a href=" ' + row.url + '" target="_blank"  class="card border-dark mb-3 post '+visitedClass+'" id="'+row.id+'">';
            htmlString += '<div class="card-header text-center">';
            // htmlString += "<u" + 'style = "display:inline">' + row.title + " (";
            // htmlString += row.type + ")</u>";
            htmlString += '<span class="text-dark">' + row.title +'</span>';
            htmlString += '</div>';
            htmlString += '<div class="card-body text-dark">' + row.description + "</div>";
            htmlString += '<div class="card-footer text-dark">' + 'Type: ' + '<span class="badge badge-secondary">' + row.type +'</span>' + "</div>";
            htmlString += "</a>";
        });
        // console.log(htmlString); //testing
        $("#results").append(htmlString);
        

    };
    displayUserLinks();
    
    $('#results').on('click', 'a', function(){
        $(this).addClass('visited');    
       var visited = localStorage.getItem('visited');

       if(visited) {
            visited = JSON.parse(visited);
            if($.inArray($(this).attr('id'), visited) === -1) {
                visited.push($(this).attr('id'));
                localStorage.setItem('visited', JSON.stringify(visited));
            } 
       } else {
           localStorage.setItem('visited', JSON.stringify([$(this).attr("id")]));
       }
      
    });
    
    $('#search').on('submit', function(e){
        e.preventDefault();
        displayUserLinks($('#search-input').val(), $("input[name='sortby']:checked").val());
        
    })
});
