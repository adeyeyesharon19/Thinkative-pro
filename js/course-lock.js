document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Course Lock Script Loaded'); // Debug log

    // ===================================
    // 🎨 INJECT CSS STYLES
    // ===================================
    const style = document.createElement('style');
    style.textContent = `
        /* Locked lesson styles */
        .locked-element {
            position: relative !important;
            cursor: not-allowed !important;
            transition: all 0.3s ease !important;
            filter: blur(1px) !important;
            opacity: 0.75 !important;
            user-select: none !important;
            pointer-events: none !important;
        }

        .locked-element:hover {
            filter: blur(1.5px) !important;
            opacity: 0.65 !important;
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

    // Get current page - handle both with and without paths
    const currentPage = decodeURIComponent(
        window.location.pathname.split('/').pop()
    );

    console.log('📄 Current Page:', currentPage); // Debug log

    let progress = parseInt(localStorage.getItem('courseProgress'), 10);
    if (isNaN(progress)) progress = 1;

    console.log('📊 Current Progress:', progress); // Debug log

    const currentIndex = courseSequence.indexOf(currentPage);

    // 🔓 Update progress as user advances
    if (currentIndex > progress) {
        progress = currentIndex;
        localStorage.setItem('courseProgress', progress);
        console.log('✅ Progress Updated:', progress);
    }

    // ===================================
    // 🌫️ BLUR EFFECT FOR LOCKED LESSONS
    // ===================================
    let lockedCount = 0;
    document.querySelectorAll('.lesson-list a, .sub-lesson-list a')
        .forEach(link => {
            const target = link.getAttribute('href');
            const index = courseSequence.indexOf(target);

            if (index !== -1 && index > progress) {
                link.classList.add('locked-element');
                lockedCount++;
                
                if (!link.innerHTML.includes('🔒')) {
                    link.innerHTML += ' <span class="lock-icon">🔒</span>';
                }
            } else {
                link.classList.remove('locked-element');
            }
        });

    console.log('🔒 Locked Elements:', lockedCount); // Debug log

    // ===================================
    // 🔒 BLUR TEST SECTION HEADERS
    // ===================================
    document.querySelectorAll('.lesson-dropdown').forEach(dropdown => {
        const summary = dropdown.querySelector('.lesson-summary');
        const subLessons = dropdown.querySelectorAll('.sub-lesson-list a');
        
        let allLocked = true;
        subLessons.forEach(link => {
            const target = link.getAttribute('href');
            const index = courseSequence.indexOf(target);
            
            if (index !== -1 && index <= progress) {
                allLocked = false;
            }
        });

        if (allLocked && summary) {
            summary.classList.add('locked-element');
            
            if (!summary.innerHTML.includes('🔒')) {
                summary.innerHTML += ' <span class="lock-icon">🔒</span>';
            }
        } else if (summary) {
            summary.classList.remove('locked-element');
        }
    });

    // ===================================
    // ✅ NEXT BUTTON FIX
    // ===================================
    const nextBtn = document.getElementById('nextBtn');

    if (nextBtn && currentIndex !== -1) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const nextIndex = currentIndex + 1;

            if (nextIndex < courseSequence.length) {
                localStorage.setItem('courseProgress', nextIndex);
                window.location.href = courseSequence[nextIndex];
            }
        });
    }

    // ===================================
    // ⏱️ TEST TIMERS - CASE INSENSITIVE
    // ===================================
    (function () {
        // Normalize function - make case insensitive
        const normalize = v =>
            decodeURIComponent(v || "").toLowerCase().trim();

        const page = normalize(window.location.pathname.split("/").pop());
        
        console.log('⏱️ Timer Page Check:', page); // Debug log

        const phases = [
            // SPARK LEVEL - 15 MINUTES
            {
                name: "spark_test",
                duration: 15 * 60 * 1000,
                startPage: "sparkintro.html",
                pages: [
                    "sparkintro.html", "spark.html", "backtofront1.html", 
                    "backtofront2.html", "backtofront3.html", "backtofront4.html",
                    "anagramplugintro.html", "anagramplug1.html", "anagramplug2.html",
                    "anagramplug3.html", "anagramplug4.html", "anagramplug5.html",
                    "flipconnectintro.html", "flipconnect1.html", "flipconnect2.html",
                    "flipconnect3.html", "flipconnect4.html", "flipconnect5.html"
                ].map(normalize),
                redirect: "wordpickIQintro.html"
            },
            // FLAME LEVEL - 15 MINUTES
            {
                name: "flame_test",
                duration: 15 * 60 * 1000,
                startPage: "wordpickiqintro.html",
                pages: [
                    "wordpickiqintro.html", "wordpickiq1.html", "wordpickiq2.html",
                    "wordpickiq3.html", "wordpickiq4.html", "wordpickiq5.html",
                    "anagramathintro.html", "anagramath1.html", "anagramath2.html",
                    "anagramath3.html", "anagramath4.html", "anagramath5.html",
                    "smartphraseintro.html", "smartphrase1.html", "smartphrase2.html",
                    "smartphrase3.html", "smartphrase4.html", "smartphrase5.html"
                ].map(normalize),
                redirect: "meaningmathintro.html"
            },
            // BLAZE LEVEL - 15 MINUTES
            {
                name: "blaze_test",
                duration: 15 * 60 * 1000,
                startPage: "meaningmathintro.html",
                pages: [
                    "meaningmathintro.html", "meaningmatch1.html", "meaningmatch2.html",
                    "meaningmatch3.html", "meaningmatch4.html", "meaningmatch5.html",
                    "splitanagramintro.html", "splitanagram1.html", "splitanagram2.html",
                    "splitanagram3.html", "splitanagram4.html", "splitanagram5.html",
                    "riddlegramintro.html", "riddlegram1.html", "riddlegram2.html",
                    "riddlegram3.html", "riddlegram4.html", "riddlegram5.html"
                ].map(normalize),
                redirect: "completion.html"
            }
        ];

        const phase = phases.find(p => p.pages.includes(page));
        
        if (!phase) {
            console.log('❌ No timer phase found for this page');
            return;
        }

        console.log('✅ Timer Phase Found:', phase.name);

        const START_KEY = `phaseStart_${phase.name}`;

        // Clear old timers and start new timer on intro pages
        if (page === normalize(phase.startPage)) {
            console.log('🆕 Starting new timer for:', phase.name);
            phases.forEach(p => {
                const key = `phaseStart_${p.name}`;
                if (key !== START_KEY) {
                    localStorage.removeItem(key);
                }
            });
            
            localStorage.setItem(START_KEY, Date.now());
        }

        // Prevent timer start on non-start pages
        if (!localStorage.getItem(START_KEY) && page !== normalize(phase.startPage)) {
            console.log('⏸️ Timer not started yet');
            return;
        }

        let startTime = parseInt(localStorage.getItem(START_KEY), 10);
        if (!startTime) {
            console.log('❌ No start time found');
            return;
        }

        // Create Timer UI
        const timer = document.createElement("div");
        timer.className = "timer-mobile";
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
            zIndex: "9999",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "background 0.3s ease"
        });
        document.body.appendChild(timer);
        
        console.log('⏰ Timer UI Created');

        function format(ms) {
            const s = Math.max(0, Math.floor(ms / 1000));
            return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
        }

        function tick() {
            const remaining = phase.duration - (Date.now() - startTime);
            
            // Warning colors
            if (remaining <= 60000) {
                timer.style.background = "#dc2626";
                timer.style.animation = "pulse 1s infinite";
            } else if (remaining <= 180000) {
                timer.style.background = "#ea580c";
            }
            
            timer.textContent = `⏱ ${phase.name.toUpperCase().replace('_', ' ')} ${format(remaining)}`;

            if (remaining <= 0 && phase.redirect) {
                localStorage.removeItem(START_KEY);
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
    // 📊 DISPLAY TOTAL TEST TIME
    // ===================================
    function displayTotalTestTime() {
        const totalTestTime = 45;
        const infoDiv = document.querySelector('.one');
        
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

    console.log('✅ Course Lock Script Initialization Complete');
});