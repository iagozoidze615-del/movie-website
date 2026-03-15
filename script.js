// Cart array to hold items
let cart = [];

// Function to update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const total = document.getElementById('total');
    
    // Clear current list
    cartItems.innerHTML = '';
    
    // Add each item
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
    });
    
    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    total.textContent = totalPrice;
}

// Add event listeners to Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productDiv = e.target.closest('.product');
        const id = productDiv.dataset.id;
        const name = productDiv.querySelector('h3').textContent;
        const priceText = productDiv.querySelector('p').textContent;
        const price = parseInt(priceText.replace('Price: $', ''));
        
        // Add to cart
        cart.push({ id, name, price });
        
        // Update display
        updateCart();
    });
});

// Clear cart event
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    updateCart();
});