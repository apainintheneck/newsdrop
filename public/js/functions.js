  /* global $ */
 $(document).ready(function() {
  
  async function displayUserLinks(){
  let response = await fetch(`/api/getUserFavorites`);
  let data = await response.json();
  console.log(response);
  console.log(data);
  
  $("#results").html("");
  let htmlString = "";


  data.forEach(function(row){
   //htmlString += "<a href=" + row.url + "target="_blank" class="card border-dark mb-3 post">";
   htmlString += '<a href=" ' + row.url + '" target="_blank"  class="card border-dark mb-3 post">';
   htmlString += "<u" + 'style = "display:inline">' + row.title  + " (";
   htmlString +=  row.type + ")</u>";
   
   //htmlString +=  row.url + "<br>";
   
   htmlString += "<br>" + row.description + "<br></a>";
   //htmlString += row.datetime + "<br><hr>";
 });

console.log(htmlString);

 $("#results").append(htmlString);
 
};
displayUserLinks();

/*

   async function updateFavorite(action){
        let url = `/api/getUserFavorites`
        await fetch(url);
    }
    */
});
