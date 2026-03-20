// certificate-engine.js
// ─────────────────────────────────────────────────────────────────────────────
// ONE file. Include on:
//   - riddlegram5.html  → sets flag so congrat.html knows to save certificate
//   - congrat.html      → banks score then saves certificate if final module
//   - certificate.html  → renders table, modal preview, PDF download
//
// HOW SCORE BANKING WORKS (do NOT change this):
//   congrat.html already banks each module's score into master_cumulative_score.
//   This file does NOT touch the score — it just reads the final total AFTER
//   congrat.html has banked it, then saves the certificate.
// ─────────────────────────────────────────────────────────────────────────────

(function () {

    const COURSE_NAME     = 'Anagram Intelligence';
    const TOTAL_QUESTIONS = 45;

    // ─────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────

    function getMasterScore() {
        return parseInt(localStorage.getItem('master_cumulative_score'), 10) || 0;
    }

    function getUserName() {
        const ud = JSON.parse(localStorage.getItem('userData')) || {};
        return (ud.firstName && ud.lastName)
            ? `${ud.firstName} ${ud.lastName}`
            : (ud.firstName || 'Student');
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 1 — QUIZ PAGE (riddlegram5.html only)
    //
    // Call this ONE function inside the if (questionCount % 5 === 0) block
    // on riddlegram5.html, BEFORE the setTimeout redirect.
    //
    // It does NOT bank the score (congrat.html does that).
    // It only sets a flag so congrat.html knows to save the certificate.
    //
    // Usage in riddlegram5.html:
    //   window.markFinalModule();
    // ─────────────────────────────────────────────────────────────
    window.markFinalModule = function () {
        localStorage.setItem('lastCompletedModule', 'riddlegram');
    };

    // ─────────────────────────────────────────────────────────────
    // STEP 2 — CONGRAT.HTML
    //
    // After congrat.html banks the score into master_cumulative_score,
    // call this to save the certificate.
    // congrat.html should call: window.saveFinalCertificate()
    // inside the setTimeout block when isFinal is true.
    // ─────────────────────────────────────────────────────────────
    window.saveFinalCertificate = function () {
        // Read master score AFTER congrat.html has already banked everything
        const masterTotal = getMasterScore();
        const pct         = Math.round((masterTotal / TOTAL_QUESTIONS) * 100);
        const userName    = getUserName();
        const dateStr     = new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const cert = {
            id:         '#AI' + Date.now().toString().slice(-6),
            name:       COURSE_NAME,
            date:       dateStr,
            marks:      masterTotal,
            total:      TOTAL_QUESTIONS,
            percentage: pct,
            userName:   userName
        };

        // Save / update
        let certs = JSON.parse(localStorage.getItem('completed_courses')) || [];
        const idx = certs.findIndex(c => c.name === COURSE_NAME);
        if (idx !== -1) { certs[idx] = cert; } else { certs.push(cert); }
        localStorage.setItem('completed_courses', JSON.stringify(certs));

        // Update dashboard completed counter
        const done = JSON.parse(localStorage.getItem('completedCourses')) || [];
        if (!done.includes(COURSE_NAME)) {
            done.push(COURSE_NAME);
            localStorage.setItem('completedCourses', JSON.stringify(done));
        }
        const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        const active   = JSON.parse(localStorage.getItem('activeCourses'))   || [];
        localStorage.setItem('courseStats', JSON.stringify({
            enrolled:  enrolled.length,
            active:    active.length,
            completed: done.length
        }));

        return cert;
    };

    // ─────────────────────────────────────────────────────────────
    // STEP 3 — CERTIFICATE PAGE RENDERER
    // Runs automatically when certificate-list element is found
    // ─────────────────────────────────────────────────────────────
    function renderCertificatePage() {
        const tableBody      = document.getElementById('certificate-list');
        const noCertMsg      = document.getElementById('no-certificates');
        const tableContainer = document.getElementById('certificate-container');
        if (!tableBody) return;

        const completed = JSON.parse(localStorage.getItem('completed_courses')) || [];

        if (completed.length === 0) {
            if (noCertMsg) noCertMsg.classList.remove('hidden');
            return;
        }

        if (tableContainer) tableContainer.classList.remove('hidden');
        tableBody.innerHTML = '';

        completed.forEach((cert, idx) => {
            const pct = cert.percentage !== undefined
                ? cert.percentage
                : Math.round((parseInt(cert.marks) / parseInt(cert.total)) * 100);

            let gradeText, badgeClass;
            if (pct >= 75)      { gradeText = pct + '% ★ Distinction'; badgeClass = 'high';   }
            else if (pct >= 50) { gradeText = pct + '% Pass';           badgeClass = 'medium'; }
            else                { gradeText = pct + '% Try Again';       badgeClass = 'low';   }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cert.id}</td>
                <td><strong>${cert.name}</strong></td>
                <td>${cert.date}</td>
                <td style="font-size:18px;font-weight:800;color:#1da1f2;">${cert.marks}</td>
                <td>${cert.total}</td>
                <td><span class="score-badge ${badgeClass}">${gradeText}</span></td>
                <td>
                    <img src="hugeicons-static-main/icons/eye.svg"
                         alt="View" class="icon-img" title="View Certificate"
                         onclick="CE_viewCert(${idx})">
                    <img src="hugeicons-static-main/icons/circle-arrow-down-03.svg"
                         alt="Download" class="icon-img" title="Download PDF"
                         onclick="CE_downloadByIndex(${idx})">
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // MODAL — view certificate
    // ─────────────────────────────────────────────────────────────
    let _activeCert = null;

    window.CE_viewCert = function (idx) {
        const completed = JSON.parse(localStorage.getItem('completed_courses')) || [];
        const cert = completed[idx];
        if (!cert) return;
        _activeCert = cert;

        const name = cert.userName || getUserName();
        const pct  = cert.percentage !== undefined
            ? cert.percentage
            : Math.round((parseInt(cert.marks) / parseInt(cert.total)) * 100);

        document.getElementById('modal-name').textContent   = name;
        document.getElementById('modal-course').textContent = cert.name;
        document.getElementById('modal-marks').textContent  = cert.marks;
        document.getElementById('modal-total').textContent  = cert.total;
        document.getElementById('modal-pct').textContent    = pct + '%';
        document.getElementById('modal-id').textContent     = cert.id;
        document.getElementById('modal-date').textContent   = cert.date;

        const modal = document.getElementById('certModal');
        if (modal) modal.classList.add('open');
    };

    window.CE_closeModal = function () {
        const modal = document.getElementById('certModal');
        if (modal) modal.classList.remove('open');
        _activeCert = null;
    };

    window.CE_downloadFromModal = function () {
        if (_activeCert) CE_generatePDF(_activeCert);
    };

    window.CE_downloadByIndex = function (idx) {
        const completed = JSON.parse(localStorage.getItem('completed_courses')) || [];
        if (completed[idx]) CE_generatePDF(completed[idx]);
    };

    // ─────────────────────────────────────────────────────────────
    // PDF GENERATOR (jsPDF, landscape A4)
    // ─────────────────────────────────────────────────────────────
    window.CE_generatePDF = function (cert) {
        if (!window.jspdf) {
            alert('PDF library not loaded. Make sure jsPDF script tag is in the page.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();

        const name  = cert.userName || getUserName();
        const marks = parseInt(cert.marks, 10) || 0;
        const total = parseInt(cert.total, 10) || 45;
        const pct   = cert.percentage !== undefined ? cert.percentage : Math.round((marks / total) * 100);

        // Background
        doc.setFillColor(11, 29, 58);
        doc.rect(0, 0, W, H, 'F');

        // Blue side bars
        doc.setFillColor(29, 161, 242);
        doc.rect(0, 0, 7, H, 'F');
        doc.rect(W - 7, 0, 7, H, 'F');

        // Dashed border
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.4);
        doc.setLineDashPattern([3, 2], 0);
        doc.rect(14, 10, W - 28, H - 20);
        doc.setLineDashPattern([], 0);

        // Platform
        doc.setTextColor(147, 197, 253);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('THINKATIVE LEARNING PLATFORM', W / 2, 27, { align: 'center' });

        doc.setTextColor(191, 219, 254);
        doc.setFontSize(9.5);
        doc.text('CERTIFICATE  OF  ACHIEVEMENT', W / 2, 36, { align: 'center' });

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(38);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICATE', W / 2, 57, { align: 'center' });

        // Presented to
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(147, 197, 253);
        doc.text('This certificate is proudly presented to', W / 2, 72, { align: 'center' });

        // Name
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(name, W / 2, 88, { align: 'center' });
        const nw = doc.getTextWidth(name);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.35);
        doc.line(W / 2 - nw / 2, 91, W / 2 + nw / 2, 91);

        // Course
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(191, 219, 254);
        doc.text('for successfully completing the course', W / 2, 102, { align: 'center' });
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(cert.name, W / 2, 113, { align: 'center' });

        // Score boxes
        const boxes = [
            { label: 'SCORE', value: String(marks) },
            { label: 'TOTAL', value: String(total)  },
            { label: 'GRADE', value: pct + '%'       }
        ];
        const bW = 54, bH = 24, bGap = 14;
        let bx = (W - (boxes.length * bW + (boxes.length - 1) * bGap)) / 2;
        const by = 126;
        boxes.forEach(b => {
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.25);
            doc.roundedRect(bx, by, bW, bH, 3, 3, 'S');
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(b.value, bx + bW / 2, by + 14, { align: 'center' });
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(147, 197, 253);
            doc.text(b.label, bx + bW / 2, by + 21, { align: 'center' });
            bx += bW + bGap;
        });

        // Footer
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.25);
        doc.line(20, H - 22, W - 20, H - 22);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(147, 197, 253);
        doc.text(cert.id,              22,     H - 14);
        doc.text('Date: ' + cert.date, W / 2,  H - 14, { align: 'center' });
        doc.text('Thinkative Tablets', W - 22, H - 14, { align: 'right' });

        doc.save(`Certificate_${cert.name.replace(/\s+/g,'_')}_${name.replace(/\s+/g,'_')}.pdf`);
    };

    // ─────────────────────────────────────────────────────────────
    // AUTO-INIT
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {

        // Certificate page → render table + wire modal
        if (document.getElementById('certificate-list')) {
            renderCertificatePage();

            const modal = document.getElementById('certModal');
            if (modal) {
                modal.addEventListener('click', function (e) {
                    if (e.target === modal) window.CE_closeModal();
                });
            }
            const closeBtn = document.querySelector('.btn-close-modal');
            const dlBtn    = document.querySelector('.btn-dl-modal');
            if (closeBtn) closeBtn.onclick = window.CE_closeModal;
            if (dlBtn)    dlBtn.onclick    = window.CE_downloadFromModal;
        }
    });

})();