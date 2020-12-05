/* global $ */
$(document).ready(function(){
    function addTags(insertID, tags){
        let sql = "INSERT INTO posts (post_ID, tag) VALUES";
        let sqlParams = [];
        
        for(let i = 0; i < tags.length; i++){
            sql = sql.concat(" (?,?)");
            if(i + 1 === tags.length) sql = sql.concat(",");
            sqlParams.push(insertID, tags[i]);
        }
        
        sql = sql.concat(";");
        
        console.log(sql);
        console.log(sqlParams);
    }
});