let ingredients = [];

function requestData() {
  var xmlhttp = new XMLHttpRequest();

  var imagesURL = [];
  var titles = [];
  var sourceURL = [];

  if (!addIngredients()) {
    return;
  }

  clearIngredientList();
  clearRecipes();

  let url =
    "https://www.food2fork.com/api/search?key=19d852284c0af6e8548dbb3aff623650&q=";

  for (let i = 0; i < ingredients.length; i++) {
    url += ingredients[i] + ",";
  }

  xmlhttp.open("GET", url, false);

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === xmlhttp.DONE && xmlhttp.status === 200) {
      var myObj = JSON.parse(xmlhttp.responseText);
      if (myObj.hasOwnProperty("error")) {
        alert("Sorry, exceeded allowed API calls for the day.");
        return 0;
      }
      var results = document.querySelector("#results");
      if (myObj.count === 0) {
        results.innerHTML = "No recipes found with these ingredients.";
        alert("Sorry, no recipes with these ingredients.");
        ingredients = [];
        return 0;
      }
      results.innerHTML = myObj.count;
      for (let i = 0; i < myObj.count; i++) {
        //Store image_url property in array
        if (myObj.recipes[i].hasOwnProperty("image_url")) {
          imagesURL.push(myObj.recipes[i].image_url);
          titles.push(myObj.recipes[i].title);
          sourceURL.push(myObj.recipes[i].source_url);
        }
      }
      // Populate images and titles
      populate(myObj.count, imagesURL, titles, sourceURL);
    } else {
      alert("There was a problem with the request.");
    }
  };

  xmlhttp.send();
}

function populate(count, imagesURL, titles, sourceURL) {
  for (let i = 0; i < count; i++) {
    //Create elements and add classes
    var li = document.createElement("li");
    li.className = "card";
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    var div = document.createElement("div");
    div.className = "bottom-card";
    var title = document.createElement("h3");
    var anchor = document.createElement("a");
    anchor.className = "btn";

    //Populate elements
    img.src = imagesURL[i];
    title.innerHTML = titles[i];
    anchor.innerHTML = "View recipe";
    anchor.href = sourceURL[i];

    //Add elements to document
    figure.appendChild(img);
    div.appendChild(title);
    div.appendChild(anchor);
    li.appendChild(figure);
    li.appendChild(div);

    document.querySelector(".cards").appendChild(li);

    document.querySelector("main").scrollIntoView();
  }

  //Display recipe ingredients and reset ingredients array

  if (document.querySelector("main h2") != null) {
    document
      .querySelector("main")
      .removeChild(document.querySelector("main h2"));
  }
  let ingredientDisplay = document.createElement("h2");
  ingredientDisplay.innerHTML = "Ingredients: ";
  for (let i = 0; i < ingredients.length; i++) {
    ingredientDisplay.innerHTML += ingredients[i];
    if (ingredients.length > 1 && i < ingredients.length - 1) {
      ingredientDisplay.innerHTML += ", ";
    }
  }
  document
    .querySelector("main")
    .insertBefore(ingredientDisplay, document.querySelector(".cards"));
  ingredients = [];
}

function clearIngredientList() {
  let ingredientList = document.querySelectorAll(".ingredient-list li");
  for (let i = 0; i < ingredientList.length; i++) {
    document.querySelector(".ingredient-list").removeChild(ingredientList[i]);
  }
}

function clearRecipes() {
  let list = document.querySelector(".cards");
  let anchors = document.querySelectorAll(".card");
  for (let i = 0; i < anchors.length; i++) {
    list.removeChild(anchors[i]);
  }
}

function addIngredients(e) {
  let ingredientInput = document.querySelector("#ingredientInput").value;
  if (ingredientInput.length > 0) {
    //IF input not empty, push to array and return true
    if (!ingredients.includes(ingredientInput)) {
      ingredients.push(ingredientInput);
      document.querySelector("form").reset();
      //Create li (ingredient name + delete button)
      let ingredientElem = document.createElement("li");
      ingredientElem.innerHTML =
        ingredientInput +
        '<button class="delete reset"><i class="fas fa-minus-square"></i></button>';
      document.querySelector(".ingredient-list").appendChild(ingredientElem);
    } else {
      document.querySelector("#ingredientInput").value = "";
      alert("Ingredient you are trying to add is already in the list.");
    }
    return true;
  } else if (ingredientInput.length == 0 && ingredients.length > 0) {
    //If user try to add with empty input, return false
    if (e != undefined) {
      alert("Please enter an ingredient.");
      return false;
    }
    return true;
  } else {
    alert("Please enter an ingredient.");
    return false;
  }
}

function deleteIngredient(e) {
  e.preventDefault();

  let ingredientText = "";
  //Visually deletes ingredient from ingredient list
  if (e.target.className == "fas fa-minus-square") {
    ingredientText = e.target.parentElement.previousSibling.data;
    let li = e.target.parentElement.parentElement;
    document.querySelector(".ingredient-list").removeChild(li);
  }
  //Deletes ingredient from ingredients array
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i] == ingredientText) {
      ingredients.splice(i, 1);
    }
  }
}

document.querySelector("#submit").addEventListener("click", requestData);
document.querySelector("#add").addEventListener("click", addIngredients);
document.querySelector("#clear").addEventListener("click", () => {
  clearIngredientList();
  ingredients = [];
});
document
  .querySelector(".ingredient-list")
  .addEventListener("click", deleteIngredient);
