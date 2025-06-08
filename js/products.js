// Products Page JavaScript - JB ENTERPRISE

// Global Variables
let currentProducts = [];
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 12;
let currentCategory = 'all';
let currentSort = 'name';
let currentView = 'grid';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const productsContainer = document.getElementById('productsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const productModal = document.getElementById('productModal');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const viewBtns = document.querySelectorAll('.view-btn');
const categoryCards = document.querySelectorAll('.category-card');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Sample Products Data
const productsData = [
    {
        id: 1,
        name: "Professional Hammer Set",
        category: "hand-tools",
        price: 1599,
        originalPrice: 1999,
        description: "High-quality steel hammer set with ergonomic handles. Perfect for construction and repair work.",
        image: "hammer.jpg",
        badge: "Sale",
        rating: 4.5,
        reviews: 24,
        specifications: [
            "Material: High-grade steel",
            "Handle: Anti-slip rubber grip",
            "Weight: 450g",
            "Length: 32cm",
            "Warranty: 2 years"
        ],
        inStock: true,
        popular: true
    },
    {
        id: 2,
        name: "Cordless Drill Machine",
        category: "power-tools",
        price: 4599,
        originalPrice: 5499,
        description: "Powerful 18V cordless drill with lithium-ion battery. Includes multiple drill bits and carrying case.",
        image: "drill.jpg",
        badge: "Bestseller",
        rating: 4.8,
        reviews: 156,
        specifications: [
            "Voltage: 18V",
            "Battery: Lithium-ion",
            "Chuck Size: 13mm",
            "Torque: 50Nm",
            "Speed: 0-1500 RPM",
            "Warranty: 3 years"
        ],
        inStock: true,
        popular: true
    },
    {
        id: 3,
        name: "LED Bulb 12W Pack of 4",
        category: "electrical",
        price: 399,
        originalPrice: 599,
        description: "Energy-efficient LED bulbs with warm white light. Long-lasting and eco-friendly.",
        image: "led-bulb.jpg",
        badge: "New",
        rating: 4.3,
        reviews: 89,
        specifications: [
            "Wattage: 12W",
            "Lumens: 1200lm",
            "Color Temperature: 3000K",
            "Base: B22",
            "Lifespan: 25,000 hours",
            "Warranty: 2 years"
        ],
        inStock: true,
        popular: false
    },
    {
        id: 4,
        name: "PVC Pipe 1 inch - 6 feet",
        category: "plumbing",
        price: 89,
        originalPrice: 120,
        description: "High-quality PVC pipe for plumbing applications. Corrosion-resistant and durable.",
        image: "pvc-pipe.jpg",
        badge: "Sale",
        rating: 4.1,
        reviews: 67,
        specifications: [
            "Material: PVC",
            "Diameter: 1 inch",
            "Length: 6 feet",
            "Pressure Rating: 150 PSI",
            "Temperature Range: -40°C to 60°C",
            "Warranty: 5 years"
        ],
        inStock: true,
        popular: false
    },
    {
        id: 5,
        name: "Wall Paint 1 Liter",
        category: "paint",
        price: 249,
        originalPrice: 299,
        description: "Premium quality interior wall paint. Available in multiple colors with excellent coverage.",
        image: "wall-paint.jpg",
        badge: "Sale",
        rating: 4.4,
        reviews: 112,
        specifications: [
            "Type: Emulsion",
            "Coverage: 120 sq ft",
            "Finish: Matt",
            "Drying Time: 2-4 hours",
            "VOC: Low",
            "Warranty: 1 year"
        ],
        inStock: true,
        popular: false
    },
    {
        id: 6,
        name: "Screw Set - Mixed Sizes",
        category: "hardware",
        price: 199,
        originalPrice: 249,
        description: "Comprehensive set of screws in various sizes. Includes Phillips and flathead screws.",
        image: "screw-set.jpg",
        badge: "Sale",
        rating: 4.2,
        reviews: 43,
        specifications: [
            "Material: Stainless steel",
            "Quantity: 100 pieces",
            "Sizes: 6mm to 50mm",
            "Head Types: Phillips, Flathead",
            "Coating: Zinc plated",
            "Storage: Plastic organizer box"
        ],
        inStock: true,
        popular: false
    },
    {
        id: 7,
        name: "Adjustable Wrench 10 inch",
        category: "hand-tools",
        price: 299,
        originalPrice: 399,
        description: "Heavy-duty adjustable wrench with chrome finish. Perfect for plumbing and mechanical work.",
        image: "wrench.jpg",
        badge: "Sale",
        rating: 4.6,
        reviews: 78,
        specifications: [
            "Length: 10 inches",
            "Material: Chrome vanadium steel",
            "Jaw Capacity: 0-30mm",
            "Finish: Chrome plated",
            "Weight: 340g",
            "Warranty: 1 year"
        ],
        inStock: true,
        popular: true
    },
    {
        id: 8,
        name: "Angle Grinder 4 inch",
        category: "power-tools",
        price: 2199,
        originalPrice: 2599,
        description: "Powerful angle grinder for cutting and grinding applications. Includes safety guard and handle.",
        image: "grinder.jpg",
        badge: "Bestseller",
        rating: 4.7,
        reviews: 134,
        specifications: [
            "Power: 850W",
            "Disc Size: 4 inches",
            "Speed: 11,000 RPM",
            "Spindle Thread: M14",
            "Cable Length: 2m",
            "Warranty: 2 years"
        ],
        inStock: true,
        popular: true
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    initializeEventListeners();
    initializeNavigation();
    updateCartUI();
    initializeAnimations();
});

// Initialize products
function initializeProducts() {
    allProducts = [...productsData];
    currentProducts = [...allProducts];
    displayProducts();
}

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', handleSort);
    }

    // View toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', handleCategoryCardClick);
    });

    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }

    // Cart functionality
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }

    if (document.getElementById('closeCart')) {
        document.getElementById('closeCart').addEventListener('click', closeCart);
    }

    // Modal functionality
    if (document.querySelector('.close-modal')) {
        document.querySelector('.close-modal').addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
        if (e.target === cartSidebar) {
            closeCart();
        }
    });

    // Quantity controls in modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            handleQuantityChange(e);
        }
    });
}

// Initialize navigation
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            header.style.backdropFilter = 'none';
        }
    });
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.category-card, .product-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Display products
function displayProducts() {
    if (!productsContainer) return;

    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    const productsToShow = currentProducts.slice(startIndex, endIndex);

    if (currentPage === 1) {
        productsContainer.innerHTML = '';
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });

    // Show/hide load more button
    if (loadMoreBtn) {
        if (endIndex >= currentProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Trigger animations for new products
    setTimeout(() => {
        initializeAnimations();
    }, 100);
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-price', product.price);
    card.setAttribute('data-name', product.name.toLowerCase());
    card.setAttribute('data-popular', product.popular);

    const badgeClass = product.badge === 'Sale' ? 'sale' : 
                     product.badge === 'New' ? 'new' : 
                     product.badge === 'Bestseller' ? 'bestseller' : '';

    const stars = generateStars(product.rating);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    card.innerHTML = `
        <div class="product-image" onclick="openProductModal(${product.id})">
            <div class="placeholder-icon">
                <i class="fas fa-tools"></i>
            </div>
            ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
        </div>
        <div class="product-content">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">₹${product.price}</span>
                ${product.originalPrice > product.price ? 
                    `<span class="original-price">₹${product.originalPrice}</span>
                     <span class="discount">${discount}% OFF</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="openProductModal(${product.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `;

    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        'hand-tools': 'Hand Tools',
        'power-tools': 'Power Tools',
        'electrical': 'Electrical',
        'plumbing': 'Plumbing',
        'paint': 'Paint & Supplies',
        'hardware': 'Hardware'
    };
    return categoryNames[category] || category;
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        currentProducts = [...allProducts];
    } else {
        currentProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    applyFiltersAndSort();
    currentPage = 1;
    displayProducts();
}

// Category filter
function handleCategoryFilter() {
    currentCategory = categoryFilter.value;
    applyFiltersAndSort();
    currentPage = 1;
    displayProducts();
}

// Category card click
function handleCategoryCardClick(e) {
    const category = e.currentTarget.getAttribute('data-category');
    currentCategory = category;
    categoryFilter.value = category;
    applyFiltersAndSort();
    currentPage = 1;
    displayProducts();
    
    // Smooth scroll to products section
    document.querySelector('.products-grid').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Sort functionality
function handleSort() {
    currentSort = sortFilter.value;
    applyFiltersAndSort();
    currentPage = 1;
    displayProducts();
}

// Apply filters and sorting
function applyFiltersAndSort() {
    let filteredProducts = [...allProducts];
    
    // Apply search if active
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentCategory
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.rating - a.rating;
            });
            break;
        default:
            break;
    }
    
    currentProducts = filteredProducts;
}

// View toggle
function handleViewToggle(e) {
    const view = e.currentTarget.getAttribute('data-view');
    currentView = view;
    
    viewBtns.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    productsContainer.className = `products-container ${view}-view`;
}

// Load more products
function loadMoreProducts() {
    currentPage++;
    displayProducts();
}

// Open product modal
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !productModal) return;
    
    // Populate modal with product details
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `₹${product.price}`;
    
    if (product.originalPrice > product.price) {
        document.getElementById('modalProductOriginalPrice').textContent = `₹${product.originalPrice}`;
        document.getElementById('modalProductOriginalPrice').style.display = 'inline';
    } else {
        document.getElementById('modalProductOriginalPrice').style.display = 'none';
    }
    
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductRating').innerHTML = generateStars(product.rating);
    
    // Set product image
    const modalImage = document.getElementById('modalProductImage');
    modalImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    modalImage.alt = product.name;
    
    // Populate specifications
    const specsList = document.getElementById('modalProductSpecs');
    specsList.innerHTML = '';
    product.specifications.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
    // Set up add to cart button
    const addToCartBtn = productModal.querySelector('.add-to-cart-btn');
    addToCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(productId, quantity);
    };
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeModal() {
    if (productModal) {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle quantity change
function handleQuantityChange(e) {
    const action = e.target.getAttribute('data-action');
    const quantityInput = document.getElementById('quantity');
    let currentQuantity = parseInt(quantityInput.value);
    
    if (action === 'increase') {
        quantityInput.value = currentQuantity + 1;
    } else if (action === 'decrease' && currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

// Add to cart
function addToCart(productId, quantity = 1) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showAddToCartNotification(product.name);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    displayCartItems();
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            displayCartItems();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
        cartTotal.textContent = totalPrice;
    }
    
    displayCartItems();
}

// Display cart items
function displayCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px 0;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-tools"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem; padding: 5px;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Toggle cart sidebar
function toggleCart() {
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

// Close cart sidebar
function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        "${productName}" added to cart!
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.openProductModal = openProductModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.closeModal = closeModal;

