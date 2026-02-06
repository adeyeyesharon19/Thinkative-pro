document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 🎨 INJECT CSS STYLES
    // ===================================
    const style = document.createElement('style');
    style.textContent = `
        /* Locked lesson styles */
        .locked-element {
            position: relative;
            cursor: not-allowed !important;
            transition: all 0.3s ease;
            filter: blur(1px);
            opacity: 0.75;
            user-select: none;
        }

        .locked-element:hover {
            filter: blur(1.5px);
            opacity: 0.65;
        }

        .lock-icon {
            display: inline-block;
            margin-left: 8px;
            font-size: 14px;
            filter: blur(0) !important;
        }

        .locked-element::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            border-radius: 4px;
        }

        /* Unlocked lesson hover effect */
        .lesson-list a:not(.locked-element),
        .sub-lesson-list a:not(.locked-element) {
            transition: all 0.3s ease;
        }

        .lesson-list a:not(.locked-element):hover,
        .sub-lesson-list a:not(.locked-element):hover {
            transform: translateX(5px);
            color: #2c5aa0;
        }

        /* Timer pulse animation */
        @keyframes pulse {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1); 
            }
            50% { 
                opacity: 0.8; 
                transform: scale(1.05); 
            }
        }

        /* Mobile responsive timer */
        @media (max-width: 768px) {
            .timer-mobile {
                top: 8px !important;
                right: 8px !important;
                padding: 6px 10px !important;
                font-size: 12px !important;
            }
        }
    `;
    document.head.appendChild(style);

    const courseSequence = [
        "learning.html",
        "what ai.html",
        "history ai.html",
        "lifeapp1.html",
        "lifeapp2.html",
        "sparkintro.html",
        "spark.html",
        "backtofront1.html",
        "backtofront2.html",
        "backtofront3.html",
        "backtofront4.html",
        "anagramplugintro.html",
        "anagramplug1.html",
        "anagramplug2.html",
        "anagramplug3.html",
        "anagramplug4.html",
        "anagramplug5.html",
        "flipconnectintro.html",
        "flipconnect1.html",
        "flipconnect2.html",
        "flipconnect3.html",
        "flipconnect4.html",
        "flipconnect5.html",
        "wordpickIQintro.html",
        "wordpickIQ1.html",
        "wordpickIQ2.html",
        "wordpickIQ3.html",
        "wordpickIQ4.html",
        "wordpickIQ5.html",
        "anagramathintro.html",
        "anagramath1.html",
        "anagramath2.html",
        "anagramath3.html",
        "anagramath4.html",
        "anagramath5.html",
        "smartphraseintro.html",
        "smartphrase1.html",
        "smartphrase2.html",
        "smartphrase3.html",
        "smartphrase4.html",
        "smartphrase5.html",
        "meaningmathintro.html",
        "meaningmatch1.html",
        "meaningmatch2.html",
        "meaningmatch3.html",
        "meaningmatch4.html",
        "meaningmatch5.html",
        "splitanagramintro.html",
        "splitanagram1.html",
        "splitanagram2.html",
        "splitanagram3.html",
        "splitanagram4.html",
        "splitanagram5.html",
        "riddlegramintro.html",
        "riddlegram1.html",
        "riddlegram2.html",
        "riddlegram3.html",
        "riddlegram4.html",
        "riddlegram5.html"
    ];

    const currentPage = decodeURIComponent(
        window.location.pathname.split('/').pop()
    );

    let progress = parseInt(localStorage.getItem('courseProgress'), 10);
    if (isNaN(progress)) progress = 1; // Start at 1 so both learning.html (0) and what ai.html (1) are unlocked

    const currentIndex = courseSequence.indexOf(currentPage);

    // 🔓 Update progress as user advances
    if (currentIndex > progress) {
        progress = currentIndex;
        localStorage.setItem('courseProgress', progress);
    }

    // ===================================
    // 🌫️ BLUR EFFECT FOR LOCKED LESSONS AND TEST HEADERS
    // ===================================
    document.querySelectorAll('.lesson-list a, .sub-lesson-list a')
        .forEach(link => {
            const target = link.getAttribute('href');
            const index = courseSequence.indexOf(target);

            if (index !== -1 && index > progress) {
                link.classList.add('locked-element');
                link.style.pointerEvents = "none";
                
                // ✅ ADD BLUR EFFECT
                link.style.filter = "blur(1px)";
                link.style.opacity = "0.75";
                link.style.userSelect = "none";
                
                if (!link.innerHTML.includes('🔒')) {
                    link.innerHTML += ' <span class="lock-icon">🔒</span>';
                }
            } else {
                // Remove blur from unlocked lessons
                link.style.filter = "none";
                link.style.opacity = "1";
            }
        });

    // ===================================
    // 🔒 BLUR TEST SECTION HEADERS (Back To Front Test, AnagramPlug Test, etc.)
    // ===================================
    document.querySelectorAll('.lesson-dropdown').forEach(dropdown => {
        const summary = dropdown.querySelector('.lesson-summary');
        const subLessons = dropdown.querySelectorAll('.sub-lesson-list a');
        
        // Check if ANY sub-lesson is locked
        let allLocked = true;
        subLessons.forEach(link => {
            const target = link.getAttribute('href');
            const index = courseSequence.indexOf(target);
            
            if (index !== -1 && index <= progress) {
                allLocked = false; // At least one is unlocked
            }
        });

        // If all sub-lessons are locked, blur and lock the header
        if (allLocked && summary) {
            summary.classList.add('locked-element');
            summary.style.filter = "blur(1px)";
            summary.style.opacity = "0.75";
            summary.style.userSelect = "none";
            summary.style.pointerEvents = "none";
            
            if (!summary.innerHTML.includes('🔒')) {
                summary.innerHTML += ' <span class="lock-icon">🔒</span>';
            }
        } else if (summary) {
            // Remove blur from unlocked headers
            summary.style.filter = "none";
            summary.style.opacity = "1";
            summary.style.pointerEvents = "auto";
        }
    });

    // ✅ THIS IS THE KEY FIX
    const nextBtn = document.getElementById('nextBtn');

    if (nextBtn && currentIndex !== -1) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();      // stop button default
            e.stopPropagation();     // stop <a> navigation

            const nextIndex = currentIndex + 1;

            if (nextIndex < courseSequence.length) {
                localStorage.setItem('courseProgress', nextIndex);
                window.location.href = courseSequence[nextIndex];
            }
        });
    }

    // ===================================
    // ⏱️ TEST TIMERS ONLY (NO FOUNDATION/LIFE APP TIMERS)
    // ===================================
    (function () {

        const normalize = v =>
            decodeURIComponent(v || "").toLowerCase().trim();

        const page = normalize(location.pathname.split("/").pop());

        const phases = [
            // ===================================
            // ⏱️ SPARK LEVEL - 15 MINUTES
            // ===================================
            {
                name: "spark_test",
                duration: 15 * 60 * 1000, // 15 minutes
                startPage: "sparkintro.html",
                pages: [
                    "sparkintro.html", "spark.html", "backtofront1.html", 
                    "backtofront2.html", "backtofront3.html", "backtofront4.html",
                    "anagramplugintro.html", "anagramplug1.html", "anagramplug2.html",
                    "anagramplug3.html", "anagramplug4.html", "anagramplug5.html",
                    "flipconnectintro.html", "flipconnect1.html", "flipconnect2.html",
                    "flipconnect3.html", "flipconnect4.html", "flipconnect5.html"
                ],
                redirect: "wordpickIQintro.html"
            },
            // ===================================
            // ⏱️ FLAME LEVEL - 15 MINUTES
            // ===================================
            {
                name: "flame_test",
                duration: 15 * 60 * 1000, // 15 minutes
                startPage: "wordpickiqintro.html",
                pages: [
                    "wordpickiqintro.html", "wordpickiq1.html", "wordpickiq2.html",
                    "wordpickiq3.html", "wordpickiq4.html", "wordpickiq5.html",
                    "anagramathintro.html", "anagramath1.html", "anagramath2.html",
                    "anagramath3.html", "anagramath4.html", "anagramath5.html",
                    "smartphraseintro.html", "smartphrase1.html", "smartphrase2.html",
                    "smartphrase3.html", "smartphrase4.html", "smartphrase5.html"
                ],
                redirect: "meaningmathintro.html"
            },
            // ===================================
            // ⏱️ BLAZE LEVEL - 15 MINUTES
            // ===================================
            {
                name: "blaze_test",
                duration: 15 * 60 * 1000, // 15 minutes
                startPage: "meaningmathintro.html",
                pages: [
                    "meaningmathintro.html", "meaningmatch1.html", "meaningmatch2.html",
                    "meaningmatch3.html", "meaningmatch4.html", "meaningmatch5.html",
                    "splitanagramintro.html", "splitanagram1.html", "splitanagram2.html",
                    "splitanagram3.html", "splitanagram4.html", "splitanagram5.html",
                    "riddlegramintro.html", "riddlegram1.html", "riddlegram2.html",
                    "riddlegram3.html", "riddlegram4.html", "riddlegram5.html"
                ],
                redirect: "completion.html" // Redirect to completion page after all tests
            }
        ];

        const phase = phases.find(p => p.pages.includes(page));
        if (!phase) return;

        const START_KEY = `phaseStart_${phase.name}`;

        // -------------------------------
        // ✅ CLEAR OLD TIMERS & START NEW TIMER ON INTRO PAGES
        // -------------------------------
        if (page === phase.startPage) {
            // Clear ALL previous phase timers
            phases.forEach(p => {
                const key = `phaseStart_${p.name}`;
                if (key !== START_KEY) {
                    localStorage.removeItem(key);
                }
            });
            
            // Force start this phase's timer (overwrite if exists)
            localStorage.setItem(START_KEY, Date.now());
        }

        // -------------------------------
        // ⛔ PREVENT TIMER START ON NON-START PAGES
        // -------------------------------
        if (!localStorage.getItem(START_KEY) && page !== phase.startPage) {
            return;
        }

        let startTime = parseInt(localStorage.getItem(START_KEY), 10);
        if (!startTime) return;

        // -------------------------------
        // 🎨 ENHANCED TIMER UI
        // -------------------------------
        const timer = document.createElement("div");
        timer.className = "timer-mobile"; // For responsive styling
        Object.assign(timer.style, {
            position: "fixed",
            top: "12px",
            right: "12px",
            background: "#0b1d3a",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "background 0.3s ease"
        });
        document.body.appendChild(timer);

        function format(ms) {
            const s = Math.max(0, Math.floor(ms / 1000));
            return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
        }

        function tick() {
            const remaining = phase.duration - (Date.now() - startTime);
            
            // ⚠️ WARNING COLORS
            if (remaining <= 60000) { // Last 1 minute - Red
                timer.style.background = "#dc2626";
                timer.style.animation = "pulse 1s infinite";
            } else if (remaining <= 180000) { // Last 3 minutes - Orange
                timer.style.background = "#ea580c";
            }
            
            timer.textContent = `⏱ ${phase.name.toUpperCase().replace('_', ' ')} ${format(remaining)}`;

            if (remaining <= 0 && phase.redirect) {
                localStorage.removeItem(START_KEY);
                
                // Show timeout message
                timer.textContent = "⏰ TIME'S UP!";
                timer.style.background = "#dc2626";
                
                setTimeout(() => {
                    location.href = phase.redirect;
                }, 1500);
            }
        }

        tick();
        setInterval(tick, 1000);

    })();

    // ===================================
    // 📊 OPTIONAL: DISPLAY TOTAL TEST TIME
    // ===================================
    function displayTotalTestTime() {
        const totalTestTime = 45; // 15 + 15 + 15 = 45 minutes
        const infoDiv = document.querySelector('.one'); // Adjust selector to match your layout
        
        if (infoDiv && currentPage.includes('intro')) {
            const timeInfo = document.createElement('p');
            timeInfo.style.color = '#666';
            timeInfo.style.fontSize = '14px';
            timeInfo.style.marginTop = '10px';
            timeInfo.textContent = `⏱ Total test time: ${totalTestTime} minutes across 3 levels`;
            infoDiv.appendChild(timeInfo);
        }
    }

    displayTotalTestTime();

});