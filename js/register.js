// Grab the form
const form = document.getElementById("login-form");

form.addEventListener("submit", function(e){
    e.preventDefault(); // stop page reload

    const user = {
        name: document.getElementById("Name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value, // just demo
        dob: {
            day: document.getElementById("dob-day").value,
            month: document.getElementById("dob-month").value,
            year: document.getElementById("dob-year").value
        }
    };

    // Save data in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Proceed to the next page (like your in.html)
    window.location.href = "in.html"; 
});

