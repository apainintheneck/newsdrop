
import reddit from './redditapi.js';

const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e => {
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById('limit').value;
  // Get search
  const searchTerm = searchInput.value;
  // Check for input
  if (searchTerm == '') {
    // Show message
    showMessage('Please add a search term', 'alert-danger');
  }
  // Clear field
  searchInput.value = '';

  // Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    console.log(results);
    results.forEach(post => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
      output += `
      <div class="card mb-2">
      <img class="card-img-top" src="${image}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${truncateString(post.selftext, 100)}</p>
        <a href="${post.url}" target="_blank
        " class="btn btn-primary">Read More</a>
        <hr>
        <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span> 
        <span class="badge badge-dark">Score: ${post.score}</span>
      </div>
    </div>
      `;
    });
    output += '</div>';
    document.getElementById('results').innerHTML = output;
  });

  e.preventDefault();
=======
/* global $ */
$(document).ready(function() {

    async function displayUserLinks() {
        let response = await fetch(`/api/getPosts?action=all`);
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
            htmlString += "<u" + 'style = "display:inline">' + row.title + " (";
            htmlString += row.type + ")</u>";
            htmlString += "<br>" + row.description + "<br></a>";
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

});
