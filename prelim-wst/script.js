let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = 0;

function addToCart(itemName, itemPrice, itemImage) {
    const defaultImage = 'images/cpu1.webp'; // Placeholder image path
    const existingItem = cart.find(item => item.name === itemName);
    const image = itemImage || defaultImage; // Use default image if no itemImage is provided

    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1,
            image: image // Use provided or default image
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification('Item added to cart'); // Show notification
}

 function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (cartItems) {
        cartItems.innerHTML = '';
        totalPrice = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">₱${item.price}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-button" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-button" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="delete-button" onclick="deleteItem('${item.name}')">Delete</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(li);
            totalPrice += item.price * item.quantity;
        });
        
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}


function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change); 
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function deleteItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hidden');
        }, 2000); 
    }
}

document.getElementById('checkout')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert(`Checking out! Total price: ₱${totalPrice.toFixed(2)}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
});

window.onload = updateCart;
