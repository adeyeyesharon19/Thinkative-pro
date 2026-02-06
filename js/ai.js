// js/ai.js - Search functionality for AI.html page

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 👤 USER PROFILE MANAGEMENT
    // ===================================
    
    // Get user data from localStorage (set during registration)
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        firstName: 'Sharon',
        lastName: 'Adeyeye',
        email: 'sharon@example.com'
    };

    const fullName = `${userData.firstName} ${userData.lastName}`;
    const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();

    // Update all profile displays
    updateProfileDisplays(fullName, initials);

    // ===================================
    // 🔍 SEARCH FUNCTIONALITY
    // ===================================
    
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    // ===================================
    // 🖱️ PROFILE CLICK HANDLERS
    // ===================================
    
    // Make all profile elements clickable
    const profileElements = document.querySelectorAll('.profile-container, .profile-card, .sidebar-footer a');
    profileElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    });

    // ===================================
    // FUNCTIONS
    // ===================================

    function updateProfileDisplays(name, initials) {
        // Update profile name displays
        const profileNames = document.querySelectorAll('.profile-text, .profile-name');
        profileNames.forEach(elem => {
            elem.textContent = name;
        });

        // Update profile initials/avatars
        const profileAvatars = document.querySelectorAll('.profile-icon, .profile-avatar');
        profileAvatars.forEach(elem => {
            elem.textContent = initials;
        });
    }

    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            clearSearchResults();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const searchableItems = [];

        // Search in page headings
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

        // Search in paragraphs
        const paragraphs = document.querySelectorAll('.banana p');
        paragraphs.forEach(para => {
            const text = para.textContent || '';
            
            if (text.toLowerCase().includes(searchTerm)) {
                // Get the parent section title
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

        // Search in sidebar links
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
        // Remove existing search results
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
                <div style="text-align: center; padding: 20px;">
                    <p style="color: #666; margin: 0; font-size: 32px;">🔍</p>
                    <p style="color: #666; margin: 10px 0 0 0;">
                        No results found for "<strong>${query}</strong>"
                    </p>
                </div>
            `;
            return;
        }

        const getTypeColor = (type) => {
            switch(type) {
                case 'heading': return '#2196F3';
                case 'content': return '#FF9800';
                case 'navigation': return '#9C27B0';
                default: return '#666';
            }
        };

        resultsContainer.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                Found ${items.length} result${items.length > 1 ? 's' : ''} for "<strong>${query}</strong>"
            </h4>
            ${items.map((item, index) => `
                <div class="search-result-item" data-index="${index}" style="
                    padding: 12px;
                    margin: 8px 0;
                    border-left: 4px solid ${getTypeColor(item.type)};
                    background: #f9f9f9;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='#e3f2fd'; this.style.transform='translateX(5px)';" 
                   onmouseout="this.style.background='#f9f9f9'; this.style.transform='translateX(0)';">
                    <span style="
                        display: inline-block;
                        padding: 3px 10px;
                        background: ${getTypeColor(item.type)};
                        color: white;
                        border-radius: 4px;
                        font-size: 10px;
                        font-weight: bold;
                        margin-right: 8px;
                        text-transform: uppercase;
                    ">${item.type}</span>
                    <strong style="color: #333;">${item.title}</strong>
                    ${item.snippet ? `<br><small style="color: #888; font-size: 12px;">${item.snippet}</small>` : ''}
                </div>
            `).join('')}
            <button onclick="document.getElementById('searchResults').remove();" style="
                width: 100%;
                margin-top: 15px;
                padding: 8px;
                background: #f0f0f0;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                color: #666;
                font-size: 13px;
            ">Close</button>
        `;

        // Add click handler to scroll to items
        const resultItems = resultsContainer.querySelectorAll('.search-result-item');
        resultItems.forEach((resultItem, index) => {
            resultItem.addEventListener('click', () => {
                // For navigation links, navigate to the page
                if (items[index].type === 'navigation') {
                    const href = items[index].element.getAttribute('href');
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
                    return;
                }
                
                // For content items, scroll to them
                items[index].element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Highlight the found item
                const originalBg = items[index].element.style.background;
                items[index].element.style.background = '#fffacd';
                items[index].element.style.transition = 'background 0.3s ease';
                
                setTimeout(() => {
                    items[index].element.style.background = originalBg;
                }, 2000);
                
                // Close search results
                clearSearchResults();
            });
        });
    }

    function clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.remove();
        }
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        const searchBox = document.querySelector('.search-box');
        const resultsContainer = document.getElementById('searchResults');
        
        if (resultsContainer && searchBox && !searchBox.contains(e.target) && !resultsContainer.contains(e.target)) {
            clearSearchResults();
        }
    });

});