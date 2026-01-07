 // Get user info from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Check if user data exists
if(user){
    document.getElementById("name").textContent = user.name;
    document.getElementById("email").textContent = user.email;
    document.getElementById("dob").textContent = `${user.dob.day} ${user.dob.month}, ${user.dob.year}`;
} else {
    // If no data, maybe redirect to Get Started
    console.log("No user data found.");
}
