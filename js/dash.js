// js/dash.js — Unified dashboard + courses sidebar control

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 🎬 YOUTUBE-STYLE COLLAPSIBLE SIDEBAR
    // ===================================

    const sidebar = document.querySelector('.sidebar');
    const sidebarTop = document.querySelector('.sidebar-top');

    const mainContent = document.querySelector('.main-content');
    const boxes = document.querySelector('.boxes');
    const end = document.querySelector('.end');
    const voice = document.querySelector('.voice');
    const footer = document.querySelector('.site-footer');

    const arc = document.querySelector('.arc');
    const roll = document.querySelector('.roll');
    const start = document.querySelector('.start');

    const contentTargets = [mainContent, boxes, end, voice, footer, arc, roll, start];

    contentTargets.forEach(el => {
        if (el) el.style.transition = 'margin-left 0.3s ease';
    });

    if (start) start.style.transition = 'gap 0.3s ease';
    if (sidebar) sidebar.style.transition = 'width 0.3s ease';

    const allContainer = document.querySelector('.all');
    if (allContainer) allContainer.style.transition = 'margin-left 0.3s ease';

    if (sidebarTop) {
        const h2 = sidebarTop.querySelector('h2');
        if (h2) h2.remove();
    }

    // ===================================
    // 🍔 HAMBURGER TOGGLE
    // ===================================

    if (sidebarTop && sidebar) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.cssText = `
            background: transparent; border: none; font-size: 24px;
            cursor: pointer; width: 50px; height: 50px;
            border-radius: 8px; margin: 0 15px; transition: background 0.3s ease;
        `;
        sidebarTop.insertBefore(toggleBtn, sidebarTop.firstChild);

        toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.background = '#f0f0f0');
        toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.background = 'transparent');

        let isCollapsed = false;

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            isCollapsed ? collapseSidebar() : expandSidebar();
        });

        expandSidebar();

        function collapseSidebar() {
            sidebar.style.width = '80px';
            sidebar.querySelectorAll('p, .profile-name, a span').forEach(el => el.style.display = 'none');
            sidebar.querySelectorAll('.sidebar-top a').forEach(a => {
                a.style.textAlign = 'center'; a.style.padding = '15px 0'; a.style.margin = '10px 0';
            });
            const profile = sidebar.querySelector('.profile-card');
            if (profile) { profile.style.justifyContent = 'center'; profile.style.padding = '8px 0'; }
            if (allContainer) allContainer.style.marginLeft = '110px';
        }

        function expandSidebar() {
            sidebar.style.width = '230px';
            sidebar.querySelectorAll('p, .profile-name, a span').forEach(el => el.style.display = '');
            sidebar.querySelectorAll('.sidebar-top a').forEach(a => {
                a.style.textAlign = ''; a.style.padding = ''; a.style.margin = '';
            });
            const profile = sidebar.querySelector('.profile-card');
            if (profile) { profile.style.justifyContent = ''; profile.style.padding = ''; }
            if (allContainer) allContainer.style.marginLeft = '260px';
        }
    }

    // ===================================
    // 👤 USER PROFILE
    // ===================================

    const userData = JSON.parse(localStorage.getItem('userData')) || {
        firstName: 'Sharon', lastName: 'Adeyeye', email: 'sharon@example.com'
    };

    const fullName = `${userData.firstName} ${userData.lastName}`;
    const initials = `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    updateProfileDisplays();

    function updateProfileDisplays() {
        const welcome = document.querySelector('.main-content h1');
        if (welcome) welcome.textContent = `Welcome ${userData.firstName}`;
        document.querySelectorAll('.profile-text, .profile-name').forEach(el => el.textContent = fullName);
        document.querySelectorAll('.profile-icon, .profile-avatar').forEach(el => el.textContent = initials);
    }

    // ===================================
    // 📊 COURSE STATS — LIVE COUNTING
    // ===================================

    /**
     * getCourseStats() — single source of truth
     * Derives counts from the actual course lists stored in localStorage.
     * This way counts are ALWAYS accurate no matter which page updated them.
     */
    function getCourseStats() {
        const enrolled  = JSON.parse(localStorage.getItem('enrolledCourses'))  || [];
        const active    = JSON.parse(localStorage.getItem('activeCourses'))     || [];
        const completed = JSON.parse(localStorage.getItem('completedCourses'))  || [];
        return {
            enrolled:  enrolled.length,
            active:    active.length,
            completed: completed.length
        };
    }

    /** Write derived stats back so legacy code that reads courseStats still works */
    function syncStats() {
        const stats = getCourseStats();
        localStorage.setItem('courseStats', JSON.stringify(stats));
        return stats;
    }

    function updateCourseBoxes(stats) {
        const boxEls = document.querySelectorAll('.box');
        if (boxEls[0]) boxEls[0].querySelector('h4').textContent = stats.enrolled;
        if (boxEls[1]) boxEls[1].querySelector('h4').textContent = stats.active;
        if (boxEls[2]) boxEls[2].querySelector('h4').textContent = stats.completed;
    }

    // Render on load
    updateCourseBoxes(syncStats());

    // Re-render whenever another tab / page updates localStorage
    window.addEventListener('storage', () => {
        updateCourseBoxes(syncStats());
    });

    // Poll every 2 seconds to catch same-tab updates from course detail pages
    setInterval(() => {
        updateCourseBoxes(syncStats());
    }, 2000);

    // ===================================
    // 🔍 SEARCH FUNCTIONALITY
    // ===================================

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }

    function performSearch(query) {
        if (!query || query.trim().length < 2) { clearSearchResults(); return; }
        const searchTerm = query.toLowerCase().trim();
        const searchableItems = [];

        document.querySelectorAll('h2, h3, h4').forEach(heading => {
            const text = heading.textContent || '';
            if (text.toLowerCase().includes(searchTerm))
                searchableItems.push({ type: 'heading', title: text.trim(), element: heading });
        });

        document.querySelectorAll('.sidebar a').forEach(link => {
            const text = link.textContent || '';
            if (text.toLowerCase().includes(searchTerm))
                searchableItems.push({ type: 'navigation', title: text.trim(), element: link });
        });

        displaySearchResults(searchableItems, searchTerm);
    }

    function displaySearchResults(items, query) {
        let rc = document.getElementById('searchResults');
        if (!rc) {
            rc = document.createElement('div');
            rc.id = 'searchResults';
            rc.style.cssText = `
                position:fixed; top:80px; right:20px; width:400px; max-width:90vw;
                max-height:500px; overflow-y:auto; background:white; border-radius:12px;
                box-shadow:0 8px 24px rgba(0,0,0,.2); z-index:10000; padding:20px;
            `;
            document.body.appendChild(rc);
        }

        if (items.length === 0) {
            rc.innerHTML = `<div style="text-align:center;padding:20px;"><p style="font-size:32px">🔍</p><p>No results for "<strong>${query}</strong>"</p></div>`;
            return;
        }

        const color = t => ({ heading:'#2196F3', content:'#FF9800', navigation:'#9C27B0' }[t] || '#666');

        rc.innerHTML = `
            <h4 style="margin-bottom:15px;">Found ${items.length} result${items.length > 1 ? 's' : ''} for "<strong>${query}</strong>"</h4>
            ${items.map((item, i) => `
                <div class="search-result-item" data-index="${i}" style="
                    padding:12px; margin:8px 0; border-left:4px solid ${color(item.type)};
                    background:#f9f9f9; cursor:pointer; border-radius:6px; transition:all .2s ease;"
                    onmouseover="this.style.background='#e3f2fd';this.style.transform='translateX(5px)'"
                    onmouseout="this.style.background='#f9f9f9';this.style.transform='translateX(0)'">
                    <span style="padding:3px 10px; background:${color(item.type)}; color:white; border-radius:4px; font-size:10px; font-weight:bold; margin-right:8px; text-transform:uppercase">${item.type}</span>
                    <strong>${item.title}</strong>
                </div>`).join('')}
            <button onclick="document.getElementById('searchResults').remove();" style="
                width:100%; margin-top:15px; padding:8px; background:#f0f0f0;
                border:none; border-radius:6px; cursor:pointer;">Close</button>
        `;

        rc.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                if (items[i].type === 'navigation') {
                    const href = items[i].element.getAttribute('href');
                    if (href && href !== '#') window.location.href = href;
                    return;
                }
                items[i].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                clearSearchResults();
            });
        });
    }

    function clearSearchResults() {
        const rc = document.getElementById('searchResults');
        if (rc) rc.remove();
    }

    document.addEventListener('click', (e) => {
        const searchBox = document.querySelector('.search-box');
        const rc = document.getElementById('searchResults');
        if (rc && searchBox && !searchBox.contains(e.target) && !rc.contains(e.target))
            clearSearchResults();
    });

    // ===================================
    // 👤 PROFILE NAVIGATION
    // ===================================

    document.querySelectorAll('.profile-container').forEach(c => {
        c.style.cursor = 'pointer';
        c.addEventListener('click', () => window.location.href = 'profile.html');
    });

});

// ===================================
// 🌍 GLOBAL HELPERS — called from course detail pages
// ===================================

/**
 * Call this when the user PAYS for a course.
 * Adds to enrolledCourses list.
 */
window.enrollCourse = function (courseName) {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    if (!enrolled.includes(courseName)) {
        enrolled.push(courseName);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
        _syncStats();
        _animateStatBadge('enrolled');
    }
};

/**
 * Call this when the user STARTS / resumes a course.
 * Adds to activeCourses list.
 */
window.startActiveCourse = function (courseName) {
    const active = JSON.parse(localStorage.getItem('activeCourses')) || [];
    if (!active.includes(courseName)) {
        active.push(courseName);
        localStorage.setItem('activeCourses', JSON.stringify(active));
        _syncStats();
        _animateStatBadge('active');
    }
};

/**
 * Call this when the user FINISHES a course.
 * Adds to completedCourses, removes from activeCourses.
 */
window.completeCourse = function (courseName) {
    // Remove from active
    let active = JSON.parse(localStorage.getItem('activeCourses')) || [];
    active = active.filter(c => c !== courseName);
    localStorage.setItem('activeCourses', JSON.stringify(active));

    // Add to completed
    const completed = JSON.parse(localStorage.getItem('completedCourses')) || [];
    if (!completed.includes(courseName)) {
        completed.push(courseName);
        localStorage.setItem('completedCourses', JSON.stringify(completed));
    }

    _syncStats();
    _animateStatBadge('completed');
};

/** Internal: keep legacy courseStats key in sync */
function _syncStats() {
    const enrolled  = JSON.parse(localStorage.getItem('enrolledCourses'))  || [];
    const active    = JSON.parse(localStorage.getItem('activeCourses'))     || [];
    const completed = JSON.parse(localStorage.getItem('completedCourses'))  || [];
    localStorage.setItem('courseStats', JSON.stringify({
        enrolled: enrolled.length, active: active.length, completed: completed.length
    }));

    // Update boxes if on the dashboard right now
    const boxEls = document.querySelectorAll('.box');
    if (boxEls[0]) boxEls[0].querySelector('h4').textContent = enrolled.length;
    if (boxEls[1]) boxEls[1].querySelector('h4').textContent = active.length;
    if (boxEls[2]) boxEls[2].querySelector('h4').textContent = completed.length;
}

/** Flash animation on the matching stat box */
function _animateStatBadge(type) {
    const index = { enrolled: 0, active: 1, completed: 2 }[type];
    const boxEls = document.querySelectorAll('.box');
    if (boxEls[index]) {
        const h4 = boxEls[index].querySelector('h4');
        if (h4) {
            h4.style.transition = 'color 0.3s ease, transform 0.3s ease';
            h4.style.color = '#1DA1F2';
            h4.style.transform = 'scale(1.3)';
            setTimeout(() => {
                h4.style.color = '#333';
                h4.style.transform = 'scale(1)';
            }, 600);
        }
    }
}