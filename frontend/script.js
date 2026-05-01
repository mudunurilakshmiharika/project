const API_URL = "https://project-7-zgr1.onrender.com/api/products";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let allProducts = [];

async function fetchProducts() {
  const container = document.getElementById("products-container");
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch products");
    
    allProducts = await response.json();
    
    if (allProducts.length === 0) {
      container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 2rem;'>No products found in the database. Please run the seed script.</p>";
    } else {
      displayProducts(allProducts);
    }
    updateCounts();
  } catch (error) {
    console.error("Error fetching products:", error);
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #fee2e2; border-radius: 1rem; color: #991b1b;">
          <p><strong>Connection Error:</strong> Could not connect to the backend server.</p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Make sure your backend is running at https://project-7-zgr1.onrender.com</p>
        </div>
      `;
    }
  }
}

function displayProducts(products) {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";

  products.forEach(product => {
    const isWishlisted = wishlist.some(item => item._id === product._id);
    const card = document.createElement("div");
    card.className = "product-card";
    
    card.innerHTML = `
      <div class="product-image-container" onclick="showProductDetails('${product._id}')">
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product._id}', event)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="dots-container">
          <div class="dot active"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="product-card-info">
        <div class="info-left" onclick="showProductDetails('${product._id}')">
          <h3>${product.name}</h3>
          <p class="price">RS. ${product.price.toLocaleString()}</p>
        </div>
        <button class="btn-add-quick" onclick="addToCart('${product._id}')">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login is required to access this feature.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function showProductDetails(id) {
  if (!checkLogin()) return;

  const product = allProducts.find(p => p._id === id);
  if (!product) return;

  const listView = document.getElementById("product-list-view");
  const detailsView = document.getElementById("product-details-view");
  const content = document.getElementById("product-details-content");

  listView.style.display = "none";
  detailsView.style.display = "block";

  const isWishlisted = wishlist.some(item => item._id === product._id);

  content.innerHTML = `
    <div class="details-container">
      <img src="${product.image}" alt="${product.name}" class="details-image">
      <div class="details-info">
        <p class="product-category">${product.category || 'General'}</p>
        <h1>${product.name}</h1>
        <p class="details-price">₹${product.price}</p>
        <p class="details-description">${product.description || 'No description available for this premium item.'}</p>
        
        <div class="actions" style="margin-top: 2rem;">
          <button class="btn-primary" style="padding: 1.25rem; font-size: 1.125rem;" onclick="addToCart('${product._id}')">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="btn-secondary" style="padding: 1.25rem; font-size: 1.125rem;" onclick="buyNow('${product._id}')">
            Buy Now
          </button>
          <button class="btn-secondary ${isWishlisted ? 'active' : ''}" style="padding: 1.25rem;" onclick="toggleWishlist('${product._id}', event)">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  showSimilar(product.category, product._id);
}

function backToList() {
  document.getElementById("product-list-view").style.display = "block";
  document.getElementById("product-details-view").style.display = "none";
  document.getElementById("similar-section").style.display = "none";
}

async function addToCart(id) {
  if (!checkLogin()) return;

  const product = allProducts.find(p => p._id === id);
  if (product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounts();
    alert(`${product.name} added to cart!`);
  }
}

async function buyNow(id) {
  if (!checkLogin()) return;

  const product = allProducts.find(p => p._id === id);
  if (product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounts();
    window.location.href = "cart.html";
  }
}

async function toggleWishlist(id, event) {
  if (event) event.stopPropagation();
  if (!checkLogin()) return;

  const product = allProducts.find(p => p._id === id);

  const index = wishlist.findIndex(item => item._id === id);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateCounts();
  
  if (document.getElementById("product-details-view").style.display === "block") {
    showProductDetails(id);
  } else {
    displayProducts(allProducts);
  }
}

function showSimilar(category, currentId) {
  const similar = allProducts.filter(p => p.category === category && p._id !== currentId);
  const section = document.getElementById("similar-section");
  const container = document.getElementById("similar-container");
  
  if (similar.length > 0) {
    section.style.display = "block";
    container.innerHTML = "";
    similar.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-container" onclick="showProductDetails('${product._id}')">
          <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="product-card-info">
          <div class="info-left" onclick="showProductDetails('${product._id}')">
            <h3>${product.name}</h3>
            <p class="price">RS. ${product.price.toLocaleString()}</p>
          </div>
          <button class="btn-add-quick" onclick="addToCart('${product._id}')">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } else {
    section.style.display = "none";
  }
}

function updateCounts() {
  document.getElementById("cart-count").innerText = cart.length;
  document.getElementById("wishlist-count").innerText = wishlist.length;
}

function checkAuth() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const loginLink = document.getElementById("login-link");
    const signupLink = document.getElementById("signup-link");
    const logoutLink = document.getElementById("logout-link");
    const userName = document.getElementById("user-name");

    if (!loginLink || !signupLink || !logoutLink || !userName) return;

    if (user && user.name) {
      loginLink.style.display = "none";
      signupLink.style.display = "none";
      logoutLink.style.display = "inline";
      userName.innerText = `Hi, ${user.name.split(' ')[0]}`;
    } else {
      loginLink.style.display = "inline";
      signupLink.style.display = "inline";
      logoutLink.style.display = "none";
      userName.innerText = "";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("user"); // Clear malformed data
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart"); // Clear cart on logout for security
  localStorage.removeItem("wishlist");
  window.location.reload();
}

checkAuth();
fetchProducts();