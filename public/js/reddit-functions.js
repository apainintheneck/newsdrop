import reddit from './reddit-api.js';

const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

searchReddit("tech", "10", "hot"); //Shows latest news when the page is first loaded.

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById('limit').value;
  // Get search
  const searchTerm = searchInput.value;
  // Check for input
  if (searchTerm == '') {
    // Show alert if there is no search term.
    showMessage('Please add a search term', 'alert-danger');
  } else {
    // Otherwise search Reddit.
    searchReddit(searchTerm, searchLimit, sortBy);
  }
  // Clear field
  searchInput.value = '';
});

// Show Message Function
function showMessage(message, className) {
  // Return if alert is already displayed.
  if(document.querySelector('.alert')) return;
  
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const mainContainer = document.getElementById('main-container');
  // Get form
  // const search = document.getElementById('search');
  const search = document.getElementById('results');
  
  // Insert alert
  mainContainer.insertBefore(div, search);

  // Timeout after 3 sec
  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 6000);
}

// Truncate String Function
function truncateString(myString, limit) {
  const shortened = myString.indexOf(' ', limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}

// Search reddit and update results.
function searchReddit(searchTerm, searchLimit, sortBy){
  // Check if on home feed
  var isHomeFeed = false;
  if(document.getElementById("home-feed")) {
    isHomeFeed = true;
  }
  // Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    if(isHomeFeed) {
      output = '';
    }
    // console.log(results); // testing
    results.forEach(post => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
      output += `
      <div class="card mb-3">
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
    
    if(!isHomeFeed) {
      output += '</div>';
    }
    
    if(isHomeFeed) {
      document.getElementById('results').innerHTML += output;
    } else {
      document.getElementById('results').innerHTML = output;
    }
  });
}