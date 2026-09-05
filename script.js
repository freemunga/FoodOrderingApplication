document.addEventListener("DOMContentLoaded", () => {
  // 1. Admin Login Form Validation & Redirection
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (email === "admin@gmail.com" && password.length >= 6) {
        alert("successfully login!");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid email or password (password must be at least 6 chars).");
      }
    });
  }

  // 2. User Dashboard & Menu Operations
  const foodContainer = document.getElementById("foodContainer");
  if (foodContainer) {
    let cart = [];
    let wishlists = [];
    let allMenuItems = [];

    // Track client hits using localStorage
    let hits = parseInt(localStorage.getItem("app_hits") || "1", 10);
    hits += 1;
    localStorage.setItem("app_hits", hits);
    const hitDisplay = document.getElementById("clientHitDisplay");
    if (hitDisplay) hitDisplay.textContent = `${hits} client hit for this app!`;

    // Logout Button Handler
    document.getElementById("logoutBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Asynchronous Menu Fetching via Fetch API (AJAX)
    const fetchMenu = async () => {
      try {
        const response = await fetch("db.json");
        const data = await response.json();
        allMenuItems = data.menu;
        renderMenu(allMenuItems, "Burger");
      } catch (error) {
        console.warn("db.json fetch fallback to built-in dataset:", error);
        allMenuItems = [
          { id: 1, name: "Cheese Burger", category: "Burger", price: 13, rating: "★ 4.3", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
          { id: 2, name: "Elk Burger", category: "Burger", price: 15, rating: "★ 4.3", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60" },
          { id: 3, name: "Classic Burrito", category: "Burrito", price: 11, rating: "★ 4.5", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60" },
          { id: 4, name: "Glazed Donuts", category: "Donuts", price: 8, rating: "★ 4.8", image: "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=500&auto=format&fit=crop&q=60" },
          { id: 5, name: "Pepperoni Pizza", category: "Pizza", price: 18, rating: "★ 4.6", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60" },
          { id: 6, name: "Chocolate Lava Cake", category: "Desserts", price: 9, rating: "★ 4.9", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60"}
        ];
      
        renderMenu(allMenuItems, "Burger");
      }
    };

    // Render Cards in DOM
    const renderMenu = (items, selectedCategory = "") => {
      foodContainer.innerHTML = "";
      const filtered = selectedCategory
        ? items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase())
        : items;

      if (filtered.length === 0) {
        foodContainer.innerHTML = `<p style="color: #888;">No items found in this category.</p>`;
        return;
      }

      filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
          <div class="card-top-icons">
            <span class="rating-badge">${item.rating}</span>
            <button class="wishlist-btn" onclick="toggleWishlist(${item.id})">🤍</button>
          </div>
          <div class="food-img-wrapper">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <h4 class="food-name">${item.name}</h4>
          <div class="price-row">
            <span class="price-text">Price : $ ${item.price}</span>
            <button class="btn-add-cart" onclick="addToCart(${item.id})">+ Add</button>
          </div>
        `;
        foodContainer.appendChild(card);
      });
    };

    // Global Interactive Functions for Cart and Wishlist
    window.addToCart = (id) => {
      const item = allMenuItems.find((p) => p.id === id);
      if (item) {
        cart.push(item);
        document.getElementById("cartCount").textContent = cart.length;
        document.getElementById("cartSidebarCount").textContent = cart.length;
      }
    };

    window.toggleWishlist = (id) => {
      const index = wishlists.indexOf(id);
      if (index === -1) {
        wishlists.push(id);
      } else {
        wishlists.splice(index, 1);
      }
      document.getElementById("wishlistCount").textContent = wishlists.length;
    };

    // Category Switching Logic
    document.querySelectorAll(".category-item").forEach((cat) => {
      cat.addEventListener("click", () => {
        document.querySelectorAll(".category-item").forEach((c) => c.classList.remove("active"));
        cat.classList.add("active");
        const categoryName = cat.getAttribute("data-category");
        document.getElementById("currentCategoryHeading").textContent = categoryName;
        renderMenu(allMenuItems, categoryName);
      });
    });

    // Real-Time Search Filter
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const matched = allMenuItems.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      renderMenu(matched, "");
    });

    fetchMenu();
  }
});