document.addEventListener("DOMContentLoaded", function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let userInfoDiv = document.getElementById("user-info");

    if (user) {
      let dashboardLink = user.role === "owner" ? `<a href="../pages/restaurant-dashboard.html" class="btn btn-custom">Dashboard</a>` : "";
      
      userInfoDiv.innerHTML = `
        ${dashboardLink}
        <span>Hi, ${user.name}</span>
        <button id="logout-btn" class="btn btn-outline-danger ms-3">Logout</button>
      `;

      document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.reload();
      });
    } else {
      userInfoDiv.innerHTML = `
        <a class="btn-getstarted" href="../signin.html" id="signin-btn">Sign In</a>
      `;
    }
  });

  

  



 


    

     