// Store data
let products = [
  {
    id: "cropTopHoodie",
    image: "./images/crop-hoodie.jpg",
    title: "Crop Top Hoodie",
    price: 49.99,
    inCart: 0,
  },
  {
    id: "cropTop",
    image: "./images/crop-top.jpg",
    title: "Crop Top",
    price: 29.99,
    inCart: 0,
  },
  {
    id: "mensHoodie",
    image: "./images/mens-hoodie.jpg",
    title: "Mens Hoodie",
    price: 49.99,
    inCart: 0,
  },
  {
    id: "mensSweatshirt",
    image: "./images/mens-sweatshirt.jpg",
    title: "Mens Sweatshirt",
    price: 39.99,
    inCart: 0,
  },
];
let shoppingCart = [];

// Cart Elements
let thead = document.querySelector("thead");
let tbody = document.querySelector("tbody");
let tfoot = document.querySelector("tfoot");
let tableBody = document.getElementById("cart-content");
let trHead = document.createElement("tr");
let trBody = document.createElement("tr");
let trFooter = document.createElement("tr");

// Helpers
const createCart = () => {
  trHead.innerHTML = `
  <th>items in cart</th>
  <th>Qty</th>
  <th>cost</th>
  <th></th>
  <th></th>
  `;

  thead.appendChild(trHead);
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(price);

const calculateQty = (qty, price) => qty * price;

const getCartTotal = () =>
  shoppingCart
    .map((item) => {
      return calculateQty(item.inCart, item.price);
    })
    .reduce((acc, curVal) => acc + curVal, 0);

const setCartTotal = () => {
  const cartTotal = getCartTotal();
  const totalPrice = formatPrice(cartTotal);

  trFooter.innerHTML = `
  <td>Total</td>
  <td></td>
  <td>${totalPrice}</td>
  `;

  tfoot.appendChild(trFooter);
};

const removeCartItem = (e) => {
  const id = e.target.parentElement.id;
  const inCartValue = document.getElementById("qty" + id);
  let indexToUpdate = shoppingCart.findIndex((product) => product.id === id);
  const cartRowId = "cartRow" + shoppingCart[indexToUpdate].id;
  const productId = shoppingCart[indexToUpdate].id;
  inCartValue.innerHTML = --shoppingCart[indexToUpdate].inCart;
  const removeItem = () => {
    e.target.parentElement.parentElement.parentElement.remove();
    shoppingCart.splice(
      shoppingCart.findIndex((product) => product.id === productId),
      1
    );
    console.log(shoppingCart.length);
  };

  if (shoppingCart[indexToUpdate].inCart === 0) removeItem();
  setCartTotal();
};

const increaseCartItemQuantity = (id) => {
  const inCartValue = document.getElementById("qty" + id);
  const indexToUpdate = shoppingCart.findIndex((product) => product.id === id);
  const updatedValue = ++shoppingCart[indexToUpdate].inCart;
  inCartValue.innerHTML = updatedValue;
  setCartTotal();
};

const addItemToCart = (item) => {
  const { id, productName, price, inCart } = item;
  let tableRef = tableBody.getElementsByTagName("tbody")[0];
  const formattedPrice = formatPrice(price);
  tableRef.id = "cartRow" + id;
  tableRef.insertRow().innerHTML = `
    <td>${productName}</td>
    <td id=${"qty" + id}>${inCart}</td>
    <td>${formattedPrice}</td>
    <td>
      <button id=${id} class="minus-button" name="decreaseQuantity"><i class="fas fa-minus-square" ></i></button>
    </td>
    <td>
      <button id=${id} name="increaseQuantity"><i class="fas fa-plus-square" ></i></button>
    </td>
    `;

  shoppingCart.push(item);
  setCartTotal();
};

// Populate Store
let card = document.createElement("div");

let cardDetails = products.map((productData) => {
  const { id, image, title, price } = productData;
  const formattedPrice = formatPrice(price);

  return `
  <div id="${id}" class="card">
    <img src="${image}" alt="${title}" class="product-image" />
    <p class="product-title">${title}</p>
    <div class="card-footer">
      <p id=${price} >${formattedPrice}</p>
      <button id="addToCart" name="addToCart">
        <i class="fas fa-cart-plus"></i>
      </button>
    </div>
  </div>
  `;
});

card.innerHTML = cardDetails.join("");

card.classList.add("featured-products-list");
document.getElementById("productDisplay").appendChild(card);

// Event Handlers
const handleAddToCart = (e) => {
  const cartItem = {};
  const id = e.target.parentElement.parentElement.parentElement.id;
  const title =
    e.target.parentElement.parentElement.previousElementSibling.textContent;
  const price = parseFloat(
    e.target.parentElement.parentElement.firstElementChild.id
  );

  cartItem.id = id;
  cartItem.productName = title;
  cartItem.price = price;
  cartItem.inCart = 1;

  if (!shoppingCart.length) createCart();
  shoppingCart.some((item) => item.id === id)
    ? increaseCartItemQuantity(id)
    : addItemToCart(cartItem);
  console.log(shoppingCart);
};

const handleAddOrRemoveFromCart = (e) => {
  const action = e.target.parentElement.name;
  const itemId = e.target.parentElement.id;
  console.log(shoppingCart);
  action === "decreaseQuantity"
    ? removeCartItem(e)
    : increaseCartItemQuantity(itemId);
};

// Selectors
document
  .getElementById("productDisplay")
  .addEventListener("click", handleAddToCart);
tableBody.addEventListener("click", handleAddOrRemoveFromCart);
