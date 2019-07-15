//DOM Elements
let img = document.querySelector("img");
let para = document.querySelector("p");

// loadJSON("https://randomfox.ca/floof/", gotData);

var images = [];

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    for (let i = 0; i < myObj.count; i++) {
      //Store image_url in array - not working (but console.log is working)
      let url = myObj.recipes[i]["image_url"];
      images.push(url);
      console.log(myObj.recipes[i]["image_url"]);
    }
    para.innerHTML = myObj.recipes[0].image_url;
    // var url = myObj.recipes[1].image_url;
    // images.push(url);
    // for ( in myObj) {
    //     images.push(url)
    // }
  }
};

console.log(images.length);
// for (let i = 0; i < images.length; i++) {
//   console.log(images[i]);
// }

xmlhttp.open(
  "GET",
  "https://www.food2fork.com/api/search?key=19d852284c0af6e8548dbb3aff623650&q=chicken,beef&page=1",
  true
);
xmlhttp.send();
