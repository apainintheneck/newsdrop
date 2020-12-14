/* global $ */
$(document).ready(function() {
    console.log($("#url").attr("href"));
    sessionStorage.setItem("lastPostUrl", $("#url").attr("href"));
});
