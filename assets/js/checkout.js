document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        let cartList = document.getElementById("cart-list");
        let cartTotal = document.getElementById("cart-total");
        cartList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartList.innerHTML = "<li class='list-group-item text-center'>Your cart is empty.</li>";
            document.getElementById("cart-total").innerText = "0.00";
        } else {
            cart.forEach(item => {
                let li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
                `;
                cartList.appendChild(li);
                total += item.price * item.quantity;
            });
            cartTotal.innerText = total.toFixed(2);
        }
    }

    document.getElementById("checkout-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let address = document.getElementById("address").value;
        let payment = document.getElementById("payment").value;

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let orderDetails = {
            name,
            email,
            address,
            payment,
            cart,
            total: document.getElementById("cart-total").innerText
        };

        console.log("Order Placed:", orderDetails);
        alert("Thank you for your order! Your food will be delivered soon.");
        
        localStorage.removeItem("cart");  // Clear the cart after purchase
        window.location.href = "../index.html"; // Redirect to homepage
    });

    renderCart();
});
