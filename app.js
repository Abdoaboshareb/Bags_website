// ==========================================
// CARRY & CO. - BAG STORE
// ==========================================

// Page Routing Configuration
const ROUTES = {
    home: "Home.html",
    shop: "Shop.html",
    cart: "Cart.html"
};

// Product Database
const PRODUCTS = [
    {
        id: 1,
        name: "The Everyday Tote",
        category: "Tote",
        price: 48,
        color: "Warm Tan",
        tag: "Bestseller",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 2,
        name: "City Shoulder Bag",
        category: "Shoulder",
        price: 62,
        color: "Classic Black",
        tag: "New",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 3,
        name: "Weekend Backpack",
        category: "Backpack",
        price: 74,
        color: "Olive",
        tag: "Popular",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 4,
        name: "Mini Crossbody",
        category: "Crossbody",
        price: 39,
        color: "Sand",
        tag: "Lightweight",
        image: "https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 5,
        name: "Soft Leather Tote",
        category: "Tote",
        price: 89,
        color: "Chocolate",
        tag: "Premium",
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 6,
        name: "Everywhere Sling",
        category: "Crossbody",
        price: 44,
        color: "Stone",
        tag: "Travel Pick",
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 7,
        name: "The Work Edit",
        category: "Shoulder",
        price: 68,
        color: "Caramel",
        tag: "Work Ready",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 8,
        name: "Trail Daypack",
        category: "Backpack",
        price: 57,
        color: "Black",
        tag: "Functional",
        image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=80"
    }
];

// ==========================================
// LOCAL STORAGE
// ==========================================

const CART_KEY = "carryco_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function formatPrice(price) {
    return "$" + price.toFixed(2);
}

// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}

// ==========================================
// PRODUCT CARD
// ==========================================

function createProductCard(product) {
    return `
        <article class="product-card">

            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-tag">${product.tag}</span>
            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <div class="product-meta">
                    <span>${product.category} · ${product.color}</span>
                    <strong>${formatPrice(product.price)}</strong>
                </div>

                <button
                    class="add-button"
                    onclick="addToCart(${product.id}, this)">
                    Add to Bag +
                </button>

            </div>
        </article>
    `;
}

// ==========================================
// FEATURED PRODUCTS - HOME PAGE
// ==========================================

function displayFeaturedProducts() {
    const container = document.getElementById("featured-products");

    if (!container) return;

    container.innerHTML = PRODUCTS
        .slice(0, 4)
        .map(createProductCard)
        .join("");
}

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(productId, button) {

    const cart = getCart();

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart(cart);

    if (button) {
        const originalText = button.textContent;

        button.textContent = "Added Successfully ✓";
        button.classList.add("added");

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("added");
        }, 1000);
    }
}

// ==========================================
// SHOP PAGE
// ==========================================

function displayProducts() {

    const container = document.getElementById("all-products");

    if (!container) return;

    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");

    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "All";
    const selectedSort = sortFilter ? sortFilter.value : "featured";

    let filteredProducts = PRODUCTS.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    const countElement = document.getElementById("product-count");
    if (countElement) {
        countElement.textContent = filteredProducts.length + " products";
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No bags found</h2>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");
}

// ==========================================
// INCREASE / DECREASE QUANTITY
// ==========================================

function changeQuantity(productId, change) {

    let cart = getCart();

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    cart = cart.filter(item => item.quantity > 0);

    saveCart(cart);

    displayCart();
}

// ==========================================
// REMOVE PRODUCT
// ==========================================

function removeFromCart(productId) {

    const updatedCart = getCart().filter(item => item.id !== productId);

    saveCart(updatedCart);

    displayCart();
}

// ==========================================
// CART PAGE
// ==========================================

function displayCart() {

    const container = document.getElementById("cart-content");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Your shopping bag is empty.</h2>
                <p>Discover our collection and find your favorite bag.</p>
                <a href="${ROUTES.shop}" class="btn">
                    Start Shopping ↗
                </a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let cartItemsHTML = "";

    cart.forEach(item => {

        const product = PRODUCTS.find(p => p.id === item.id);

        if (!product) return;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        cartItemsHTML += `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-details">

                    <h3>${product.name}</h3>

                    <p>${product.color}</p>

                    <p>${formatPrice(product.price)}</p>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${product.id}, -1)">−</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${product.id}, 1)">+</button>

                        <button
                            class="remove-button"
                            onclick="removeFromCart(${product.id})">
                            Remove
                        </button>

                    </div>

                </div>

                <strong class="item-total">
                    ${formatPrice(itemTotal)}
                </strong>

            </div>
        `;
    });

    container.innerHTML = `
        <div class="cart-list">
            ${cartItemsHTML}
        </div>

        <aside class="order-summary">

            <h2>Order Summary</h2>

            <div class="summary-line">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
            </div>

            <div class="summary-line">
                <span>Shipping</span>
                <span>Calculated later</span>
            </div>

            <div class="summary-line total">
                <strong>Total</strong>
                <strong>${formatPrice(subtotal)}</strong>
            </div>

            <button class="checkout-button" onclick="checkout()">
                Continue to Checkout ↗
            </button>

            <p class="demo-notice">
                Demo website: no real payment will be processed.
            </p>

        </aside>
    `;
}

// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    if (getCart().length === 0) return;

    alert(
        "Thank you for shopping with Carry & Co.!\n\n" +
        "Your demo checkout has been completed successfully."
    );

    saveCart([]);

    // Redirect to Home after checkout
    window.location.href = ROUTES.home;
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    updateCartCount();

    displayFeaturedProducts();

    displayProducts();

    displayCart();

    // Filters for Shop page
    document.getElementById("search-input")
        ?.addEventListener("input", displayProducts);

    document.getElementById("category-filter")
        ?.addEventListener("change", displayProducts);

    document.getElementById("sort-filter")
        ?.addEventListener("change", displayProducts);
});