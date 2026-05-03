const API_URL = window.location.hostname === "project-7-zgr1.onrender.com" 
    ? "https://project-7-zgr1.onrender.com/api/products" 
    : "http://localhost:5000/api/products";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let allProducts = [];

// 👉 Fallback data in case the backend is unreachable (e.g. CORS issues with file://)
const FALLBACK_PRODUCTS = [
  { _id: "f1", name: "Premium Leather Jacket", price: 12999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", category: "Men's Fashion", description: "Authentic black leather jacket displayed on a professional mannequin." },
  { _id: "f2", name: "Slim Fit Denim Jeans", price: 3499, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", category: "Men's Fashion", description: "Classic dark blue slim-fit denim, mannequin display." },
  { _id: "f3", name: "Cotton Crew Neck T-Shirt", price: 999, image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800", category: "Men's Fashion", description: "Soft 100% cotton t-shirt, studio mannequin shot." },
  { _id: "f4", name: "Formal White Shirt", price: 2499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", category: "Men's Fashion", description: "Crisp white button-down shirt for a sharp look." },
  { _id: "f5", name: "Casual Bomber Jacket", price: 5999, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", category: "Men's Fashion", description: "Versatile olive green bomber on display." },
  { _id: "f6", name: "Chino Trousers", price: 2799, image: "https://images.unsplash.com/photo-1594932224012-c59d04584999?w=800", category: "Men's Fashion", description: "Smart-casual beige chinos, catalog style." },
  { _id: "f7", name: "Knitted Sweater", price: 3999, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", category: "Men's Fashion", description: "Warm grey knitted sweater, mannequin fit." },
  { _id: "f8", name: "Chelsea Boots", price: 8999, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800", category: "Men's Fashion", description: "Stylish brown suede Chelsea boots." },
  { _id: "f9", name: "Canvas Sneakers", price: 4499, image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800", category: "Men's Fashion", description: "Minimalist white canvas sneakers." },
  { _id: "f10", name: "Premium Wool Coat", price: 15999, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", category: "Men's Fashion", description: "Luxurious charcoal wool overcoat on mannequin." },
  { _id: "f11", name: "Premium Wireless Headphones", price: 24999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", category: "Electronics", description: "High-quality noise-canceling headphones." },
  { _id: "f12", name: "Modern Smartwatch", price: 15999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", category: "Electronics", description: "A sleek smartwatch." },
  { _id: "f13", name: "Bluetooth Speaker", price: 7999, image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800", category: "Audio", description: "Compact speaker with rich sound." },
  { _id: "f14", name: "Gaming Mouse", price: 5499, image: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800", category: "Electronics", description: "Ergonomic gaming mouse." }
];

async function fetchProducts() {
  const container = document.getElementById("products-container");
  try {
    console.log("Fetching products from:", API_URL);
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    allProducts = await response.json();
    console.log("Products loaded:", allProducts.length);
    
    if (allProducts.length === 0) {
      container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 2rem;'>No products found in the database. Please run the seed script.</p>";
    } else {
      displayProducts(allProducts);
    }
    updateCounts();
  } catch (error) {
    console.error("Error fetching products:", error);
    console.log("Using fallback local data...");
    allProducts = FALLBACK_PRODUCTS;
    displayProducts(allProducts);
    updateCounts();
    
    if (container && allProducts.length === 0) {
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
        <p class="details-price">RS. ${product.price.toLocaleString()}</p>
        <p class="details-description">${product.description || 'No description available for this premium item.'}</p>
        
        <div class="actions">
          <button class="btn-primary" onclick="addToCart('${product._id}')">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="btn-secondary" onclick="buyNow('${product._id}')">
            Buy Now
          </button>
          <button class="btn-secondary ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product._id}', event)">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-bookmark"></i>
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