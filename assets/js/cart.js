document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        let cartCount = document.getElementById("cart-count");
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.innerText = totalItems;
        }
    }

    // // ✅ Function to Add Item to Cart
    // function addToCart(id, name, price) {
    //     let existingItem = cart.find(item => item.id === id);
    
    //     if (existingItem) {
    //         existingItem.quantity += 1;
    //     } else {
    //         cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    //     }
    
    //     localStorage.setItem("cart", JSON.stringify(cart));
    //     updateCartCount();
    //     updateCartDisplay();

    //     // ✅ Toast Notification (Fixed)
    //     Swal.fire({
    //         position: "top-end",
    //         icon: "success",
    //         title: `${name} added to cart!`,
    //         showConfirmButton: false,
    //         timer: 1500
    //     });
    // }


    function addToCart(id, name, price) {
        let existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price: parseFloat(price), quantity: 1 });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    
        // Toast notification style
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    
        Toast.fire({
            icon: 'success',
            title: `${name} added to cart!`
        });
    }
    // ✅ Function to Remove Item from Cart with Confirmation
    function removeFromCart(id) {
        let item = cart.find(item => item.id === id);
        if (!item) return;

        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to remove ${item.name} from the cart?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "No, keep it"
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ Remove Item if Confirmed
                cart = cart.filter(i => i.id !== id);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();

                // ✅ Show Success Message
                Swal.fire({
                    icon: "success",
                    title: "Removed!",
                    text: `${item.name} has been removed from your cart.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    // ✅ Function to Update Quantity (+ / -)
    function updateQuantity(id, change) {
        let item = cart.find(item => item.id === id);
        if (item) {
            if (item.quantity === 1 && change === -1) {
                // If quantity is 1 and user clicks '-', ask for confirmation
                Swal.fire({
                    title: "Are you sure?",
                    text: `Do you want to remove ${item.name} from the cart?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, remove it!",
                    cancelButtonText: "No, keep it"
                }).then((result) => {
                    if (result.isConfirmed) {
                        removeFromCart(id); // Remove if confirmed
                    }
                });
            } else {
                // Otherwise, update the quantity normally
                item.quantity += change;
                
                // ✅ Ensure quantity never goes below 1
                if (item.quantity < 1) {
                    item.quantity = 1;
                }
    
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }
    // ✅ Function to Update the Cart Display
    function updateCartDisplay() {
        let cartList = document.getElementById("cart-list");
        let cartTotal = document.getElementById("cart-total");
        let cartTotalSummary = document.getElementById("cart-total-summary");
        let cartTotalSubtotal = document.getElementById("cart-total-subtotal");
        let cartContainer = document.getElementById("cart-container");
        let cartItemsContainer = document.getElementById("cart-items");
    
        if (!cartList || !cartTotal) return;  // Prevent errors on non-cart pages
    
        cartList.innerHTML = "";
        let total = 0;
    
        if (cart.length === 0) {
            cartContainer.style.display = "block";
            cartItemsContainer.style.display = "none";
        } else {
            cartContainer.style.display = "none";
            cartItemsContainer.style.display = "block";
    
            cart.forEach(item => {
                total += item.price * item.quantity;
                let listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "align-items-center");
    
                listItem.innerHTML = `
                    <div class="cart-item-container d-flex justify-content-between w-100">
                        <!-- ✅ Name on the left -->
                        <div class="cart-item-details flex-grow-1 text-start">
                            <strong>${item.name}</strong>
                        </div>
    
                        <!-- ✅ Quantity Controls in the Center -->
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-danger decrease" data-id="${item.id}">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-success increase" data-id="${item.id}">+</button>
                        </div>
    
                        <!-- ✅ Individual Item Price (Right-Aligned) -->
                        <div class="cart-item-price flex-grow-1 text-center">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
    
                        <!-- ✅ Remove Button on the Right -->
                        <button class="btn btn-sm remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
    
                cartList.appendChild(listItem);
            });
    
            cartTotal.innerText = total.toFixed(2);
            cartTotalSummary.innerText = total.toFixed(2);
            cartTotalSubtotal.innerText = total.toFixed(2);
            // ✅ Attach Event Listeners AFTER Updating Cart UI
            document.querySelectorAll(".increase").forEach(button => {
                button.removeEventListener("click", increaseQuantity);
                button.addEventListener("click", increaseQuantity);
            });
    
            document.querySelectorAll(".decrease").forEach(button => {
                button.removeEventListener("click", decreaseQuantity);
                button.addEventListener("click", decreaseQuantity);
            });
    
            document.querySelectorAll(".remove-item").forEach(button => {
                button.removeEventListener("click", removeItem);
                button.addEventListener("click", removeItem);
            });
        }
    }
    

    // ✅ Separate Functions for Event Listeners
    function increaseQuantity(event) {
        let id = event.target.getAttribute("data-id");
        updateQuantity(id, 1);
    }

    function decreaseQuantity(event) {
        let id = event.target.getAttribute("data-id");
        updateQuantity(id, -1);
    }

    function removeItem(event) {
        let id = event.target.getAttribute("data-id");
        removeFromCart(id);
    }

    // ✅ Attach Event Listeners to "Add to Cart" Buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            let name = this.getAttribute("data-name");
            let price = this.getAttribute("data-price");
            addToCart(id, name, price);
        });
    });

    updateCartCount();
    updateCartDisplay();
});




