// Cart Management
let cart = [];
let cartTotal = 0;

// Initialize cart from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('chisaGrillzCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Menu Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Filter menu items
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    // Add fade in animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Order Now button functionality
    const orderButtons = document.querySelectorAll('.btn');
    orderButtons.forEach(button => {
        if (button.textContent.includes('Order Now') || button.textContent.includes('Call Now')) {
            button.addEventListener('click', function() {
                if (this.textContent.includes('Call Now')) {
                    // Open phone dialer
                    window.location.href = 'tel:0799319173';
                } else if (this.textContent.includes('Order Now') && !this.onclick) {
                    // Open cart or show order form
                    if (cart.length > 0) {
                        toggleCart();
                    } else {
                        alert('Add some items to your cart first, then place your order!');
                        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .feature-card, .contact-card, .special-card, .review-card');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Social media links functionality
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.textContent.toLowerCase();
            
            switch(platform) {
                case 'facebook':
                    window.open('https://facebook.com', '_blank');
                    break;
                case 'instagram':
                    window.open('https://instagram.com', '_blank');
                    break;
                case 'whatsapp':
                    window.open('https://wa.me/27799319173', '_blank');
                    break;
                default:
                    console.log(`${platform} link clicked`);
            }
        });
    });

    // Initialize quantity controls
    initializeQuantityControls();
});

// Search functionality
function searchMenu() {
    const searchInput = document.getElementById('menuSearch');
    const searchTerm = searchInput.value.toLowerCase();
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const itemDescription = item.querySelector('p').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMenu();
            }
        });
        
        // Search as user types (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchMenu, 300);
        });
    }
});

// Quantity control functions
function changeQuantity(button, change) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    if (currentQuantity > 10) currentQuantity = 10; // Max limit
    
    quantitySpan.textContent = currentQuantity;
}

function initializeQuantityControls() {
    // Add event listeners to all quantity buttons
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const change = this.classList.contains('minus') ? -1 : 1;
            changeQuantity(this, change);
        });
    });
}

// Add to cart functionality
function addToCart(button) {
    const menuItem = button.closest('.menu-item');
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('R', ''));
    const quantity = parseInt(menuItem.querySelector('.quantity').textContent);
    const addDrink = menuItem.querySelector('.add-drink')?.checked || false;
    const drinkPrice = addDrink ? parseFloat(menuItem.querySelector('.add-drink').dataset.price) : 0;
    
    const totalItemPrice = (itemPrice + drinkPrice) * quantity;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.name === itemName && item.addDrink === addDrink
    );
    
    if (existingItemIndex > -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].totalPrice = (itemPrice + drinkPrice) * cart[existingItemIndex].quantity;
    } else {
        // Add new item
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            addDrink: addDrink,
            drinkPrice: drinkPrice,
            totalPrice: totalItemPrice
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('chisaGrillzCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show feedback
    showAddToCartFeedback(button);
    
    // Auto-open cart for first item
    if (cart.length === 1) {
        setTimeout(() => {
            toggleCart();
        }, 1000);
    }
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#28a745';
    button.classList.add('btn-loading');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.classList.remove('btn-loading');
    }, 1500);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    // Clear current cart display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        cartCount.textContent = '0';
        cartCount.classList.add('hidden');
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    
    cart.forEach((item, index) => {
        total += item.totalPrice;
        itemCount += item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}${item.addDrink ? ' + Drink' : ''}</p>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">R${item.totalPrice}</div>
                <button class="btn-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(0);
    cartCount.textContent = itemCount;
    cartCount.classList.remove('hidden');
    checkoutBtn.disabled = false;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('chisaGrillzCart', JSON.stringify(cart));
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    
    // Create order summary
    let orderSummary = "Hi! I'd like to place an order:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        orderSummary += `${item.quantity}x ${item.name}`;
        if (item.addDrink) orderSummary += ' + Drink';
        orderSummary += ` - R${item.totalPrice}\n`;
        total += item.totalPrice;
    });
    
    orderSummary += `\nTotal: R${total}\n\nPlease confirm my order. Thank you!`;
    
    // Send via WhatsApp
    const whatsappUrl = `https://wa.me/27799319173?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear cart after order
    // cart = [];
    // localStorage.removeItem('chisaGrillzCart');
    // updateCartDisplay();
    // toggleCart();
}

// Enhanced special offers functionality
document.addEventListener('DOMContentLoaded', function() {
    const specialButtons = document.querySelectorAll('.special-card .btn');
    specialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const specialCard = this.closest('.special-card');
            const specialName = specialCard.querySelector('h3').textContent;
            const specialPrice = specialCard.querySelector('.new-price').textContent;
            
            // Add special to cart
            const specialItem = {
                name: specialName,
                price: parseFloat(specialPrice.replace('R', '')),
                quantity: 1,
                addDrink: false,
                drinkPrice: 0,
                totalPrice: parseFloat(specialPrice.replace('R', ''))
            };
            
            cart.push(specialItem);
            localStorage.setItem('chisaGrillzCart', JSON.stringify(cart));
            updateCartDisplay();
            showAddToCartFeedback(this);
        });
    });
});

// Order tracking functionality (placeholder)
function trackOrder(orderNumber) {
    // This would connect to a real order tracking system
    alert(`Order #${orderNumber} is being prepared. Estimated time: 30-45 minutes.`);
}

// Customer review submission (placeholder)
function submitReview(rating, comment) {
    // This would send to a backend service
    console.log('Review submitted:', { rating, comment });
    alert('Thank you for your review!');
}

// Delivery zone checker
function checkDeliveryZone(area) {
    const deliveryZones = ['nkowankowa', 'polokwane', 'lebowakgomo', 'mankweng'];
    const normalizedArea = area.toLowerCase().trim();
    
    return deliveryZones.some(zone => normalizedArea.includes(zone));
}

// Nutrition information modal (placeholder)
function showNutritionInfo(itemName) {
    // This would show detailed nutrition information
    alert(`Nutrition information for ${itemName} would be displayed here.`);
}

// Loyalty points system (placeholder)
let loyaltyPoints = parseInt(localStorage.getItem('chisaGrillzPoints') || '0');

function addLoyaltyPoints(amount) {
    loyaltyPoints += Math.floor(amount / 10); // 1 point per R10 spent
    localStorage.setItem('chisaGrillzPoints', loyaltyPoints.toString());
    
    if (loyaltyPoints >= 100) {
        alert('Congratulations! You have earned a R20 discount voucher!');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'C' to open cart
    if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            toggleCart();
            event.preventDefault();
        }
    }
    
    // Press 'Escape' to close cart
    if (event.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Performance optimization for scroll events
const debouncedScroll = debounce(function() {
    // Any scroll-based functionality can go here
}, 100);

// Utility function to debounce scroll events
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

window.addEventListener('scroll', debouncedScroll);

// Error handling for failed image loads
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
            // You could set a fallback image here
            // this.src = '/path/to/fallback-image.jpg';
        });
    });
});

// Print receipt functionality
function printReceipt() {
    if (cart.length === 0) return;
    
    let receiptHTML = `
        <div style="font-family: monospace; width: 300px; margin: 0 auto;">
            <h2 style="text-align: center;">CHISA Grillz</h2>
            <p style="text-align: center;">Family favourite grill house</p>
            <hr>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Time: ${new Date().toLocaleTimeString()}</p>
            <hr>
    `;
    
    let total = 0;
    cart.forEach(item => {
        receiptHTML += `
            <p>${item.quantity}x ${item.name}${item.addDrink ? ' + Drink' : ''}</p>
            <p style="text-align: right;">R${item.totalPrice}</p>
        `;
        total += item.totalPrice;
    });
    
    receiptHTML += `
            <hr>
            <p style="font-weight: bold;">Total: R${total}</p>
            <hr>
            <p style="text-align: center;">Thank you for your order!</p>
            <p style="text-align: center;">079 931 9173 | 061 499 4911</p>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
}