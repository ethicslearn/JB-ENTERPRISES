// Admin credentials (In production, this should be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Products storage (In production, this would be a database)
let products = [
    {
        id: 1,
        name: 'Sample Product 1',
        price: 99.99,
        category: 'electronics',
        stock: 50,
        description: 'This is a sample product for demonstration.',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        name: 'Sample Product 2',
        price: 149.99,
        category: 'clothing',
        stock: 30,
        description: 'Another sample product for demonstration.',
        image: 'https://via.placeholder.com/150'
    }
];

let nextProductId = 3;
let editingProductId = null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('admin-dashboard');
const loginContainer = document.querySelector('.login-container');
const errorMessage = document.getElementById('error-message');
const logoutBtn = document.getElementById('logout-btn');
const addProductForm = document.getElementById('add-product-form');
const productsList = document.getElementById('products-list');
const searchInput = document.getElementById('search-products');
const filterCategory = document.getElementById('filter-category');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
addProductForm.addEventListener('submit', handleAddProduct);
searchInput.addEventListener('input', filterProducts);
filterCategory.addEventListener('change', filterProducts);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
});

// Login functionality
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        document.body.style.background = '#f5f5f5';
        errorMessage.textContent = '';
        displayProducts();
    } else {
        errorMessage.textContent = 'Invalid username or password!';
        // Clear the form
        loginForm.reset();
    }
}

// Logout functionality
function handleLogout() {
    loginContainer.style.display = 'block';
    adminDashboard.style.display = 'none';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    loginForm.reset();
    addProductForm.reset();
    editingProductId = null;
}


// Display products
function displayProducts() {
    const filteredProducts = getFilteredProducts();
    
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products found.</p>';
        return;
    }
    
    productsList.innerHTML = filteredProducts.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/150'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                    <strong>$${product.price.toFixed(2)}</strong> | 
                    Category: ${product.category} | 
                    Stock: ${product.stock} units
                </div>
                <div class="product-details">${product.description}</div>
            </div>
            <div class="product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Filter products
function getFilteredProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    
    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
}

function filterProducts() {
    displayProducts();
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    
    // Change form to edit mode
    editingProductId = productId;
    document.querySelector('#add-product-form button').textContent = 'Update Product';
    document.querySelector('.add-product-section h3').textContent = 'Edit Product';
    
    // Scroll to form
    document.querySelector('.add-product-section').scrollIntoView({ behavior: 'smooth' });
}


// Show success message
function showSuccessMessage(message) {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Insert after the form
    const form = document.getElementById('add-product-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// Save products to localStorage (optional persistence)
function saveProductsToStorage() {
    localStorage.setItem('jb-enterprise-products', JSON.stringify(products));
    localStorage.setItem('jb-enterprise-next-id', nextProductId.toString());
}

// Load products from localStorage
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('jb-enterprise-products');
    const savedNextId = localStorage.getItem('jb-enterprise-next-id');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    if (savedNextId) {
        nextProductId = parseInt(savedNextId);
    }
}

// Initialize products from localStorage on page load
// Initialize products from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
    displayProducts();
    saveProductsToStorage(); // Initial save
});

// Update the add/edit handlers to save automatically
function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(addProductForm);
    const productData = {
        name: formData.get('productName'),
        price: parseFloat(formData.get('productPrice')),
        category: formData.get('productCategory'),
        stock: parseInt(formData.get('productStock')),
        description: formData.get('productDescription'),
        image: formData.get('productImage') || 'https://via.placeholder.com/150'
    };
    
    if (editingProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = { ...productData, id: editingProductId };
            showSuccessMessage('Product updated successfully!');
        }
        editingProductId = null;
        document.querySelector('#add-product-form button').textContent = 'Add Product';
        document.querySelector('.add-product-section h3').textContent = 'Add New Product';
    } else {
        // Add new product
        const newProduct = {
            ...productData,
            id: nextProductId++
        };
        products.push(newProduct);
        showSuccessMessage('Product added successfully!');
    }
    
    addProductForm.reset();
    saveProductsToStorage(); // Save after changes
    displayProducts();
}

// Update delete function to save automatically
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProductsToStorage(); // Save after deletion
        displayProducts();
        showSuccessMessage('Product deleted successfully!');
    }
}

// Save products whenever they change
function updateProducts() {
    saveProductsToStorage();
    displayProducts();
}

// Export products to JSON (bonus feature)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jb-enterprise-products.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Add export button functionality (you can add this button to the HTML if needed)
function addExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Products';
    exportBtn.className = 'add-btn';
    exportBtn.style.marginLeft = '1rem';
    exportBtn.onclick = exportProducts;
    
    const productsHeader = document.querySelector('.products-section h3');
    productsHeader.appendChild(exportBtn);
}

