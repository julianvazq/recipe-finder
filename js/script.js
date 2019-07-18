//DOM Elements
let imageElements = document.querySelectorAll("img");
let titleElements = document.querySelectorAll("h3");

let ingredients = [];

function requestData(e) {
  e.preventDefault();

  var xmlhttp = new XMLHttpRequest();

  var imagesURL = [];
  var titles = [];

  addIngredients();
  let url =
    "https://www.food2fork.com/api/search?key=19d852284c0af6e8548dbb3aff623650&q=";

  for (let i = 0; i < ingredients.length; i++) {
    url += ingredients[i] + ",";
  }
  console.log(ingredients);
  console.log(url);

  xmlhttp.open("GET", url, false);

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 200) {
      var myObj = JSON.parse(xmlhttp.responseText);
      if (myObj.count === 0) {
        alert("Sorry, no recipes with these ingredients.");
        return 0;
      }
      console.log(myObj);
      for (let i = 0; i < myObj.count; i++) {
        //Store image_url property in array
        if (myObj.recipes[i].hasOwnProperty("image_url")) {
          imagesURL.push(myObj.recipes[i].image_url);
          titles.push(myObj.recipes[i].title);
        }
      }
    } else {
      alert("There was a problem with the request.");
    }
  };

  xmlhttp.send();

  // Populate images and titles
  for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].src = imagesURL[i];
    titleElements[i].innerHTML = titles[i];
  }

  //Reset ingredients array
  ingredients = [];
}

function addIngredients() {
  if (ingredientInput.length != 0) {
    let ingredientInput = document.querySelector("#ingredientInput").value;
    ingredients.push(ingredientInput);
    // console.log(ingredientInput);
    document.querySelector("form").reset();
    // console.log(ingredients);
  } else {
    alert("Please enter an ingredient.");
  }
}

document.querySelector("#submit").addEventListener("click", requestData);
document.querySelector("#add").addEventListener("click", addIngredients);
document.querySelector("#clear").addEventListener("click", () => {
  ingredients = [];
});
