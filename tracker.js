// score-tracker.js
// Works WITH congrat.html's master_cumulative_score banking system.
// congrat.html accumulates scores set-by-set into 'master_cumulative_score'.
// This file reads that key to build the certificate and expose totals.

(function () {

    /**
     * getTotalScore()
     * Reads the master score that congrat.html banks after each 5-question set.
     * Returns { total, outOf, percentage }
     */
    window.getTotalScore = function () {
        const total = parseInt(localStorage.getItem('master_cumulative_score'), 10) || 0;
        const outOf = 45;
        return {
            total:      total,
            outOf:      outOf,
            percentage: Math.round((total / outOf) * 100)
        };
    };

    /**
     * resetAllScores()
     * Clears the master score and all module keys (use on retake).
     */
    window.resetAllScores = function () {
        localStorage.removeItem('master_cumulative_score');
        const moduleKeys = [
            'backtofront', 'anagramplug', 'flipconnect',
            'wordpickIQ', 'anagramath', 'smartphrase',
            'meaningmatch', 'splitanagram', 'riddlegram'
        ];
        moduleKeys.forEach(mod => {
            localStorage.removeItem(`${mod}_score`);
            localStorage.removeItem(`${mod}_questionCount`);
            localStorage.removeItem(`${mod}_lastSetScore`);
        });
    };

    /**
     * saveCertificate(userName)
     * Saves a certificate entry using the master score.
     * Called from congrat.html when referrer includes 'riddlegram5',
     * OR from completion.html as a fallback.
     * Replaces existing entry for same course so score is always current.
     */
    window.saveCertificate = function (userName) {
        const scores  = window.getTotalScore();
        const dateStr = new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const cert = {
            id:         '#AI' + Date.now().toString().slice(-6),
            name:       'Anagram Intelligence',
            date:       dateStr,
            marks:      scores.total,
            total:      scores.outOf,
            percentage: scores.percentage,
            userName:   userName || 'Student'
        };

        const existing = JSON.parse(localStorage.getItem('completed_courses')) || [];
        const idx = existing.findIndex(c => c.name === cert.name);
        if (idx !== -1) {
            existing[idx] = cert;   // update existing
        } else {
            existing.push(cert);    // first time
        }
        localStorage.setItem('completed_courses', JSON.stringify(existing));

        // Keep dashboard "completed" counter in sync
        if (typeof window.completeCourse === 'function') {
            window.completeCourse('Anagram Intelligence');
        } else {
            const done = JSON.parse(localStorage.getItem('completedCourses')) || [];
            if (!done.includes('Anagram Intelligence')) {
                done.push('Anagram Intelligence');
                localStorage.setItem('completedCourses', JSON.stringify(done));
            }
        }

        return cert;
    };

})();