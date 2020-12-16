//Save entered url in a local session variable.
let postUrl = document.getElementById("url").getAttribute("href");
sessionStorage.setItem("lastPostUrl", postUrl);
// console.log(sessionStorage.getItem("lastPostUrl")); //testing