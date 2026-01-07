// CRUD ===> Create , Retrive ( Display ) , Update , Delete

// DOM
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productDescription = document.getElementById("productDescription");
var productImage = document.getElementById("productImage");
var row = document.getElementById("row");
var btnAdd = document.getElementById("btnAdd");
var btnUpdate = document.getElementById("btnUpdate");
var products = [];
var regex = {
  productName: /^[A-Z].{3,20}$/,
  productPrice: /\b([1-9][0-9]{2}|[1-9][0-9]{3}|[1-9][0-9]{4}|100000)\b/,
  productCategory: /^(TV|Mobile|Screens|Electronic)$/i,
  productDescription: /^.{1,100}$/,
  productImage: /\.(jpg|png|jpeg|svg|webp)$/i,
};
var globalIndex;
// if Local Storage Have pervios Data
if (localStorage.getItem("market")) {
  products = JSON.parse(localStorage.getItem("market"));
  displayProducts(products);
}

// Create
function createProduct() {
  // create product
  if (
    validateInput(productName) &
    validateInput(productPrice) &
    validateInput(productCategory) &
    validateInput(productDescription) &
    validateInput(productImage)
  ) {
    // Read the image file as base64
    var file = productImage.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var product = {
        // Get Values
        p_name: productName.value,
        p_price: productPrice.value,
        p_category: productCategory.value,
        p_desc: productDescription.value,
        p_img: e.target.result.split(',')[1], // base64 data
        p_img_type: file.type,
      };
      // add the product in array [ products ]
      products.push(product);
      console.log(products);
      // Add products in local storage
      localStorage.setItem("market", JSON.stringify(products));
      // Set Values = make them empty
      clear();
      displayProducts(products);
    };
    reader.readAsDataURL(file);
  }
}

function clear() {
  // Set Values = make them empty
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDescription.value = "";
  productImage.value = "";
  // Remove valid Sign
  productName.classList.remove("is-valid");
  productPrice.classList.remove("is-valid");
  productCategory.classList.remove("is-valid");
  productDescription.classList.remove("is-valid");
  productImage.classList.remove("is-valid");
}

function displayProducts(data) {
  var box = ``;
  // for Loop to Get Products from Array ( products ) ==> to Display them in Html
  for (var i = 0; i < data.length; i++) {
    box += `
    <div class="col-12 col-sm-12 col-md-4 col-lg-4 p-3">
      <h1 class="bg-info text-center rounded-3"> ${i} </h1>
      <div class="product bg-light p-3 rounded-3 ">
        <div class="product-image d-flex justify-content-center">
          <img class="d-block w-50" src="data:${data[i].p_img_type};base64,${data[i].p_img}" alt="">
        </div>
        <div class="product-body">
          <h2 class="h3">Name: <span>${data[i].p_name}</span></h2>
          <h2 class="h3">Price: <span>${data[i].p_price}</span></h2>
          <h3 class="h4">Category: <span>${data[i].p_category}</span></h3>
          <p class="lead"><span>Description:</span>${data[i].p_desc}</p>
          <div class="product-btns">
            <button onclick="setFormToUpdate(${i})" class="btn btn-outline-warning my-2 w-100">Update Product 🔧</button>
            <button onclick="deleteProduct(${i})" class="btn btn-outline-danger my-2 w-100">Delete Product 🗑️</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  // add values in the box to ignore repeat items problem
  row.innerHTML = box;
}

function deleteProduct(elementIndex) {
  products.splice(elementIndex, 1);
  // Update products in local storage
  localStorage.setItem("market", JSON.stringify(products));

  console.log(products);
  displayProducts(products);
}

function setFormToUpdate(elementIndex) {
  // give HTML the index
  globalIndex = elementIndex;
  // Switch Buttons
  btnAdd.classList.add("d-none");
  btnUpdate.classList.remove("d-none");

  // Move values to can Change them
  productName.value = products[elementIndex].p_name;
  productPrice.value = products[elementIndex].p_price;
  productCategory.value = products[elementIndex].p_category;
  productDescription.value = products[elementIndex].p_desc;
  // Note: Image input cannot be pre-filled for security reasons. User must re-select if updating image.
}

function updateProduct() {
  // Switch Buttons
  btnUpdate.classList.add("d-none");
  btnAdd.classList.remove("d-none");
  // give HTML the Global Index
  products[globalIndex].p_name = productName.value;
  products[globalIndex].p_price = productPrice.value;
  products[globalIndex].p_category = productCategory.value;
  products[globalIndex].p_desc = productDescription.value;
  // if image file in Update Case is Empty
  if (productImage.files[0]) {
    var file = productImage.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      products[globalIndex].p_img = e.target.result.split(',')[1];
      products[globalIndex].p_img_type = file.type;
      // refresh the Local Storage
      localStorage.setItem("market", JSON.stringify(products));
      // Clear the inputs
      clear();
      // Display the New Product
      displayProducts(products);
    };
    reader.readAsDataURL(file);
  } else {
    // refresh the Local Storage
    localStorage.setItem("market", JSON.stringify(products));
    // Clear the inputs
    clear();
    // Display the New Product
    displayProducts(products);
  }
}

function searchForProduct(searchKey) {
  // Real time Search
  var searchData = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].p_name.toLowerCase().includes(searchKey.toLowerCase())) {
      searchData.push(products[i]);
    }
  }
  displayProducts(searchData);
}

function validateInput(p_input) {
  if (regex[p_input.id].test(p_input.value)) {
    p_input.classList.remove("is-invalid");
    p_input.classList.add("is-valid");
    p_input.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    p_input.classList.remove("is-valid");
    p_input.classList.add("is-invalid");
    p_input.nextElementSibling.classList.remove("d-none");
    return false;
  }
}
