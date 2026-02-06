// tracker.js
// Saves last visited page automatically

(function () {

    // Get current page file name
    const currentPage = window.location.pathname.split("/").pop();

    // Pages we DON'T want to track
    const ignorePages = [
        "login.html",
        "signup.html",
        "register.html"
    ];

    // Only save if page is valid
    if (currentPage && !ignorePages.includes(currentPage)) {
        localStorage.setItem("lastPage", currentPage);
        console.log("📌 Last page saved:", currentPage);
    }

})();
