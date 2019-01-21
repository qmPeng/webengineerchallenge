/**
 * Created by Peng on 2019/1/9.
 */
var json;
var favouritelist = [];
var j = new Array();

function  init(){
    var input  = document.getElementById("userInput");
    if(input.value == ''){
        //console.log("123");
        $('#result').empty();
    }
}

function getData(){
    $.ajax({
        url: "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000",
        dataType: "text",
        success: function(data) {

            json = $.parseJSON(data);

        }
    });
}

function search(){
    $('#result').empty();
    var input  = document.getElementById("userInput");
    if(input.value == ''){
        return;
    }
    var results = [];

    for(var i in json){

        var rel = getRelevance(json[i].keywords,input.value);

        if(rel==0){
            continue;
        }
        results.push({relevance:rel,entry:json[i]});

    }

    results.sort(compareRelevance) // sort by relevance

    //var j = new Array(results.length);
    for(var a=0;a<results.length;a++){
        j.push(0);
    }

    for(i=0;i<results.length;i++){
        //results[i] = results[i].entry // remove relevance since it is no longer needed

        $('#result').append('<tr>'+'<td width="5%" style="padding-left: 1.5%">'+'<img src="style/star.png" class="star" id="f'+i+'">'+'</td>'+'<td width="20%">'+results[i].entry.title+'</td>'+'<td id="body'+i+'" width="40%">'+'</td>'+'</tr>');

        if(results[i].entry.body.indexOf("&lt;ul&gt;")==0){
            document.getElementById("body"+i).innerHTML = results[i].entry.body;
            var decoded = document.getElementById("body"+i).innerText;
            document.getElementById("body"+i).innerHTML = decoded;
        }
        else{
            var str1 = "&lt;ul&gt; \n &lt;li&gt;";
            var str2 = "&lt;/li&gt; \n&lt;/ul&gt;"
            document.getElementById("body"+i).innerHTML = str1 + results[i].entry.body + str2;
            var decoded = document.getElementById("body"+i).innerText;
            document.getElementById("body"+i).innerHTML = decoded;
        }


        document.getElementById("f"+i).onclick=function () {
              //console.log(j[i]);
              var index = parseInt(this.id.charAt(1));
              j[index] = j[index] + 1;

              if(j[index]%2==1){
                  this.src = "style/starg.png";
                  favouritelist.push({index:index,entry:results[index].entry});
                  createFlist();
              }
              else{
                  this.src = "style/star.png";
                  deleteFlist(results[index]);
                  createFlist();
              }

        };

    }
}

function getRelevance(value, keyword){
    var value = value.toLowerCase();
    var keyword = keyword.toLowerCase();
    //console.log(keyword);

    var index = value.indexOf(keyword);
    var  word_index = value.indexOf(' '+keyword);

    if(index == 0){
        return 3;
    }else if(word_index != -1){
        return 2;
    }else if(index!=-1){
        return 1;
    }else{
        return 0;
    }
}

function compareRelevance(a, b) {
    return b.relevance - a.relevance
}

function createFlist(){
    $('#favourite').empty();
    for(var i = 0; i<favouritelist.length; i++){
        $('#favourite').append('<tr>'+'<td width="5%" style="padding-left: 1.5%">'+'<img src="style/starg.png" id="ico'+i+'">'+'</td>'+'<td width="20%">'+favouritelist[i].entry.title+'</td>'+'<td id="fbody'+i+'" width="40%">'+'</td>'+'</tr>');

        if(favouritelist[i].entry.body.indexOf("&lt;ul&gt;")==0){
            document.getElementById("fbody"+i).innerHTML = favouritelist[i].entry.body;
            var decoded = document.getElementById("fbody"+i).innerText;
            document.getElementById("fbody"+i).innerHTML = decoded;
        }
        else{
            var str1 = "&lt;ul&gt; \n &lt;li&gt;";
            var str2 = "&lt;/li&gt; \n&lt;/ul&gt;";
            document.getElementById("fbody"+i).innerHTML = str1 + favouritelist[i].entry.body + str2;
            var decoded = document.getElementById("fbody"+i).innerText;
            document.getElementById("fbody"+i).innerHTML = decoded;
        }


        document.getElementById("ico"+i).onclick = function(){
            var index = parseInt(this.id.charAt(3));
            var n = favouritelist[index].index;
            document.getElementById("f"+n).src = "style/star.png";
            j[n]=j[n]+1;
            deleteFlist(favouritelist[index]);
            createFlist();

        };
    }
    return;

}

function deleteFlist(value){
    var title = value.entry.title;
    for(var i = 0; i<favouritelist.length; i++){
        if(favouritelist[i].entry.title == title){
            favouritelist.splice(i,1);
        }
    }
    return;

}