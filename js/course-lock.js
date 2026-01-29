document.addEventListener('DOMContentLoaded', () => {

    const courseSequence = [
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
    if (isNaN(progress)) progress = 0;

    const currentIndex = courseSequence.indexOf(currentPage);

    // 🔓 First lesson always unlocked
    if (currentIndex > progress) {
        progress = currentIndex;
        localStorage.setItem('courseProgress', progress);
    }

    // 🔒 Lock dashboard links
    document.querySelectorAll('.lesson-list a, .sub-lesson-list a')
        .forEach(link => {
            const target = link.getAttribute('href');
            const index = courseSequence.indexOf(target);

            if (index !== -1 && index > progress) {
                link.classList.add('locked-element');
                link.style.pointerEvents = "none";
                if (!link.innerHTML.includes('🔒')) {
                    link.innerHTML += ' <span class="lock-icon">🔒</span>';
                }
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
    // ⏱️ PHASE-BASED COURSE TIMER (FINAL)
    // ===================================

    // ===================================
    // ⏱️ PHASE TIMER — FOUNDATION FIXED
    // ===================================
   // ===================================
// ⏱️ PHASE TIMER — FOUNDATION FIXED
// ===================================
(function () {

    const normalize = v =>
        decodeURIComponent(v || "").toLowerCase().trim();

    const page = normalize(location.pathname.split("/").pop());

    const phases = [
        {
            name: "foundations",
            duration: 10 * 60 * 1000,
            startPage: "what ai.html",
            pages: ["what ai.html", "history ai.html"],
            redirect: "lifeapp1.html"
        },
        {
            name: "reallife",
            duration: 5 * 60 * 1000,
            pages: ["lifeapp1.html", "lifeapp2.html"],
            redirect: "sparkintro.html"
        }
        // other phases stay the same
    ];

    const phase = phases.find(p => p.pages.includes(page));
    if (!phase) return;

    const START_KEY = `phaseStart_${phase.name}`;

    // -------------------------------
    // ✅ FORCE START ON WHAT AI.HTML
    // -------------------------------
    if (page === phase.startPage) {
        if (!localStorage.getItem(START_KEY)) {
            localStorage.setItem(START_KEY, Date.now());
        }
    }

    // -------------------------------
    // ⛔ BLOCK HISTORY FROM STARTING
    // -------------------------------
    if (
        phase.name === "foundations" &&
        page === "history ai.html" &&
        !localStorage.getItem(START_KEY)
    ) {
        return;
    }

    let startTime = parseInt(localStorage.getItem(START_KEY), 10);
    if (!startTime) return;

    // -------------------------------
    // TIMER UI
    // -------------------------------
    const timer = document.createElement("div");
    Object.assign(timer.style, {
        position: "fixed",
        top: "12px",
        right: "12px",
        background: "#0b1d3a",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        fontFamily: "monospace",
        zIndex: 9999
    });
    document.body.appendChild(timer);

    function format(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    }

    function tick() {
        const remaining = phase.duration - (Date.now() - startTime);
        timer.textContent = `⏱ ${phase.name.toUpperCase()} ${format(remaining)}`;

        if (remaining <= 0 && phase.redirect) {
            localStorage.removeItem(START_KEY);
            location.href = phase.redirect;
        }
    }

    tick();
    setInterval(tick, 1000);

})()
