// Get user's name when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Retrieve the user data from localStorage
    const userDataString = localStorage.getItem('userData');
    
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userName = userData.firstName || 'User';
        
        // Update the dropdown button label with the user's first name
        const dropdownLabel = document.querySelector('.dropdown-btn');
        if (dropdownLabel) {
            dropdownLabel.textContent = userName;
        }
    }
});

function openModal() {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("page-content").classList.add("blur");
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("page-content").classList.remove("blur");
}

function logout() {
    // Clear all user data from storage
    localStorage.removeItem('userData');
    localStorage.removeItem('thinkative_user');
    localStorage.removeItem('courseStats');
    
    alert("Logged out!");
    
    // Redirect to login page or home page
    window.location.href = 'login.html';
}