// ===================================
// 📊 ANIMATED COUNTER
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Add % symbol for percentage values
        const displayValue = element.parentElement.querySelector('.stat-label').textContent.includes('Rate') || 
                           element.parentElement.querySelector('.stat-label').textContent.includes('Score')
                           ? Math.round(current) + '%'
                           : Math.round(current).toLocaleString();
        
        element.textContent = displayValue;
    }, 16);
}

// Trigger counters on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-value').forEach((elem, index) => {
        const target = parseInt(elem.getAttribute('data-target'));
        setTimeout(() => {
            animateCounter(elem, target);
        }, index * 100);
    });
});

// ===================================
// 📈 PERFORMANCE CHART (SIMPLIFIED - 6 MONTHS)
// ===================================
const ctx = document.getElementById('performanceChart').getContext('2d');

const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
gradient1.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
gradient2.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
gradient2.addColorStop(1, 'rgba(236, 72, 153, 0.0)');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Your Performance',
                data: [93, 94, 94.5],
                borderColor: '#6366f1',
                backgroundColor: gradient1,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            },
            {
                label: 'Average Performance',
                data: [81, 82, 84],
                borderColor: '#ec4899',
                backgroundColor: gradient2,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14,
                        weight: '600',
                        family: "'DM Sans', sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: 14,
                titleFont: {
                    size: 15,
                    weight: '600'
                },
                bodyFont: {
                    size: 14
                },
                borderColor: '#6366f1',
                borderWidth: 2,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + '%';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 70,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    font: {
                        size: 13,
                        family: "'DM Sans', sans-serif"
                    },
                    stepSize: 5
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 13,
                        family: "'DM Sans', sans-serif",
                        weight: '500'
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

// ===================================
// 🎯 SMOOTH SCROLL TO RANKINGS
// ===================================
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelector('.rankings-grid').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===================================
// 👤 USER DATA FROM LOCALSTORAGE
// ===================================
const user = JSON.parse(localStorage.getItem("user"));

// Check if user data exists
if(user){
    const nameElement = document.getElementById("name");
    const emailElement = document.getElementById("email");
    const dobElement = document.getElementById("dob");
    
    if(nameElement) nameElement.textContent = user.name;
    if(emailElement) emailElement.textContent = user.email;
    if(dobElement) dobElement.textContent = `${user.dob.day} ${user.dob.month}, ${user.dob.year}`;
} else {
    console.log("No user data found.");
}