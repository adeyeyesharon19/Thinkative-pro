// js/dashboard.js — Unified dashboard + courses sidebar control (JS only)

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 🎬 YOUTUBE-STYLE COLLAPSIBLE SIDEBAR
    // ===================================

    const sidebar = document.querySelector('.sidebar');
    const sidebarTop = document.querySelector('.sidebar-top');

    // Dashboard wrappers
    const mainContent = document.querySelector('.main-content');
    const boxes = document.querySelector('.boxes');
    const end = document.querySelector('.end');
    const voice = document.querySelector('.voice');
    const footer = document.querySelector('.site-footer');

    // Courses / Enroll wrappers
    const arc = document.querySelector('.arc');
    const roll = document.querySelector('.roll');
    const start = document.querySelector('.start'); // course cards grid
    const sum = document.querySelector('.sum');

    //enroll
    const en = document.querySelector('.en');
    const tv = document.querySelector('.tv');

    const coursegrid = document.querySelector('.coursegrid');

    //certificate
    const my = document.querySelector('.my');
    const table = document.querySelector('.table');

    // Unified list (safe on all pages)
    const contentTargets = [
        mainContent,
        boxes,
        end,
        voice,
        footer,
        arc,
        roll,
        start,
    ];

    // ===================================
    // 🎞️ TRANSITIONS (CRITICAL)
    // ===================================

    contentTargets.forEach(el => {
        if (el) el.style.transition = 'margin-left 0.3s ease';
    });

    if (start) {
        start.style.transition = 'gap 0.3s ease';
    }

    if (sidebar) {
        sidebar.style.transition = 'width 0.3s ease';
    }

    // Add transition to .all container
    const allContainer = document.querySelector('.all');
    if (allContainer) {
        allContainer.style.transition = 'margin-left 0.3s ease';
    }


    // ===================================
    // 🧹 REMOVE DASHBOARD TITLE (IF ANY)
    // ===================================

    if (sidebarTop) {
        const h2 = sidebarTop.querySelector('h2');
        if (h2) h2.remove();
    }



    // ===================================
    // 🍔 CREATE HAMBURGER TOGGLE
    // ===================================

    if (sidebarTop && sidebar) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';

        toggleBtn.style.cssText = `
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            margin: 0 15px;
            transition: background 0.3s ease;
        `;

        sidebarTop.insertBefore(toggleBtn, sidebarTop.firstChild);

        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.background = '#f0f0f0';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.background = 'transparent';
        });

        let isCollapsed = false;

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;

            if (isCollapsed) {
                collapseSidebar();
            } else {
                expandSidebar();
            }
        });

        // INITIAL STATE
        expandSidebar();

        // ===================================
        // COLLAPSE/EXPAND FUNCTIONS
        // ===================================

        function collapseSidebar() {
            sidebar.style.width = '80px';

            sidebar.querySelectorAll('p, .profile-name, a span')
                .forEach(el => el.style.display = 'none');

            sidebar.querySelectorAll('.sidebar-top a')
                .forEach(a => {
                    a.style.textAlign = 'center';
                    a.style.padding = '15px 0';
                    a.style.margin = '10px 0';
                });

            const profile = sidebar.querySelector('.profile-card');
            if (profile) {
                profile.style.justifyContent = 'center';
                profile.style.padding = '8px 0';
            }

            // Update .all margin
            const allContainer = document.querySelector('.all');
            if (allContainer) {
                allContainer.style.marginLeft = '110px';
            }

        }

        function expandSidebar() {
            sidebar.style.width = '230px';

            sidebar.querySelectorAll('p, .profile-name, a span')
                .forEach(el => el.style.display = '');

            sidebar.querySelectorAll('.sidebar-top a')
                .forEach(a => {
                    a.style.textAlign = '';
                    a.style.padding = '';
                    a.style.margin = '';
                });

            const profile = sidebar.querySelector('.profile-card');
            if (profile) {
                profile.style.justifyContent = '';
                profile.style.padding = '';
            }

            // Update .all margin
            const allContainer = document.querySelector('.all');
            if (allContainer) {
                allContainer.style.marginLeft = '260px';
            }

        }
    }

    // ===================================
    // 👤 USER PROFILE (MOVED OUTSIDE)
    // ===================================

    const userData = JSON.parse(localStorage.getItem('userData')) || {
        firstName: 'Sharon',
        lastName: 'Adeyeye',
        email: 'sharon@example.com'
    };

    const fullName = `${userData.firstName} ${userData.lastName}`;
    const initials = `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();

    updateProfileDisplays();

    // ===================================
    // 📊 COURSE STATS (MOVED OUTSIDE)
    // ===================================

    const stats = JSON.parse(localStorage.getItem('courseStats')) || {
        enrolled: 0,
        active: 0,
        completed: 0
    };

    updateCourseBoxes(stats);

    // ===================================
    // PROFILE FUNCTIONS
    // ===================================

    function updateProfileDisplays() {
        const welcome = document.querySelector('.main-content h1');
        if (welcome) welcome.textContent = `Welcome ${userData.firstName}`;

        document.querySelectorAll('.profile-text, .profile-name')
            .forEach(el => el.textContent = fullName);

        document.querySelectorAll('.profile-icon, .profile-avatar')
            .forEach(el => el.textContent = initials);
    }

    function updateCourseBoxes(stats) {
        const boxes = document.querySelectorAll('.box');
        if (boxes[0]) boxes[0].querySelector('h4').textContent = stats.enrolled;
        if (boxes[1]) boxes[1].querySelector('h4').textContent = stats.active;
        if (boxes[2]) boxes[2].querySelector('h4').textContent = stats.completed;
    }

    // ===================================
    // 🔍 SEARCH FUNCTIONALITY
    // ===================================
    // ===================================
    // 🔍 SEARCH FUNCTIONALITY (AI STYLE)
    // ===================================

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            clearSearchResults();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const searchableItems = [];

        const headings = document.querySelectorAll('h2, h3, h4');
        headings.forEach(heading => {
            const text = heading.textContent || '';
            if (text.toLowerCase().includes(searchTerm)) {
                searchableItems.push({
                    type: 'heading',
                    title: text.trim(),
                    element: heading
                });
            }
        });

        const paragraphs = document.querySelectorAll('.banana p');
        paragraphs.forEach(para => {
            const text = para.textContent || '';
            if (text.toLowerCase().includes(searchTerm)) {
                const parentHeading = para.previousElementSibling;
                const sectionTitle = (parentHeading && parentHeading.tagName === 'H4')
                    ? parentHeading.textContent.trim()
                    : 'Content Section';

                searchableItems.push({
                    type: 'content',
                    title: sectionTitle,
                    element: para,
                    snippet: text.substring(0, 100) + '...'
                });
            }
        });

        const sidebarLinks = document.querySelectorAll('.sidebar a');
        sidebarLinks.forEach(link => {
            const text = link.textContent || '';
            if (text.toLowerCase().includes(searchTerm)) {
                searchableItems.push({
                    type: 'navigation',
                    title: text.trim(),
                    element: link
                });
            }
        });

        displaySearchResults(searchableItems, searchTerm);
    }

    function displaySearchResults(items, query) {

        let resultsContainer = document.getElementById('searchResults');

        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'searchResults';
            resultsContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 400px;
            max-width: 90vw;
            max-height: 500px;
            overflow-y: auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            padding: 20px;
        `;
            document.body.appendChild(resultsContainer);
        }

        if (items.length === 0) {
            resultsContainer.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <p style="font-size:32px;">🔍</p>
                <p>No results found for "<strong>${query}</strong>"</p>
            </div>
        `;
            return;
        }

        const getTypeColor = (type) => {
            switch (type) {
                case 'heading': return '#2196F3';
                case 'content': return '#FF9800';
                case 'navigation': return '#9C27B0';
                default: return '#666';
            }
        };

        resultsContainer.innerHTML = `
        <h4 style="margin-bottom:15px;">
            Found ${items.length} result${items.length > 1 ? 's' : ''} for "<strong>${query}</strong>"
        </h4>

        ${items.map((item, index) => `
            <div class="search-result-item" data-index="${index}" style="
                padding:12px;
                margin:8px 0;
                border-left:4px solid ${getTypeColor(item.type)};
                background:#f9f9f9;
                cursor:pointer;
                border-radius:6px;
                transition:all 0.2s ease;
            " onmouseover="this.style.background='#e3f2fd';this.style.transform='translateX(5px)';"
              onmouseout="this.style.background='#f9f9f9';this.style.transform='translateX(0)';">

                <span style="
                    padding:3px 10px;
                    background:${getTypeColor(item.type)};
                    color:white;
                    border-radius:4px;
                    font-size:10px;
                    font-weight:bold;
                    margin-right:8px;
                    text-transform:uppercase;
                ">${item.type}</span>

                <strong>${item.title}</strong>

                ${item.snippet ? `<br><small style="color:#888">${item.snippet}</small>` : ''}
            </div>
        `).join('')}

        <button onclick="document.getElementById('searchResults').remove();" style="
            width:100%;
            margin-top:15px;
            padding:8px;
            background:#f0f0f0;
            border:none;
            border-radius:6px;
            cursor:pointer;
        ">Close</button>
    `;

        const resultItems = resultsContainer.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (items[index].type === 'navigation') {
                    const href = items[index].element.getAttribute('href');
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
                    return;
                }

                items[index].element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                clearSearchResults();
            });
        });
    }

    function clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) resultsContainer.remove();
    }

    document.addEventListener('click', (e) => {
        const searchBox = document.querySelector('.search-box');
        const resultsContainer = document.getElementById('searchResults');

        if (resultsContainer && searchBox &&
            !searchBox.contains(e.target) &&
            !resultsContainer.contains(e.target)) {
            clearSearchResults();
        }
    });

    // ===================================
    // 👤 PROFILE NAVIGATION
    // ===================================

    const profileContainers = document.querySelectorAll('.profile-container');
    profileContainers.forEach(container => {
        container.style.cursor = 'pointer';
        container.addEventListener('click', function () {
            window.location.href = 'profile.html';
        });
    });

});

// ===================================
// 🌍 GLOBAL HELPERS (USED BY OTHER PAGES)
// ===================================

window.startActiveCourse = function (courseName) {
    const stats = JSON.parse(localStorage.getItem('courseStats')) || {
        enrolled: 0, active: 0, completed: 0
    };

    let active = JSON.parse(localStorage.getItem('activeCourses')) || [];

    if (!active.includes(courseName)) {
        active.push(courseName);
        stats.active++;
        localStorage.setItem('activeCourses', JSON.stringify(active));
        localStorage.setItem('courseStats', JSON.stringify(stats));
    }
};

window.completeCourse = function (courseName) {
    const stats = JSON.parse(localStorage.getItem('courseStats')) || {
        enrolled: 0, active: 0, completed: 0
    };

    let completed = JSON.parse(localStorage.getItem('completedCourses')) || [];

    if (!completed.includes(courseName)) {
        completed.push(courseName);
        stats.completed++;
        localStorage.setItem('completedCourses', JSON.stringify(completed));
        localStorage.setItem('courseStats', JSON.stringify(stats));
    }
};