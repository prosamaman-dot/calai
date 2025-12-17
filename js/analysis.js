/**
 * Analysis Dashboard Logic
 * Renders charts and statistics for the endpoint.
 */

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

function updateDashboard() {
    // 1. Update Streak
    const streaks = [3, 7, 12, 1, 5];
    const days = streaks[Math.floor(Math.random() * streaks.length)];
    const streakEl = document.getElementById('streakDays');
    if (streakEl) streakEl.textContent = days;

    // 2. Update Calories Left
    const target = 2000;
    const consumed = Math.floor(Math.random() * (1200 - 500) + 500);
    const left = target - consumed;

    const calEl = document.getElementById('caloriesLeft');
    if (calEl) {
        calEl.textContent = left;
        // Simple count up animation
        let current = 0;
        const step = Math.ceil(left / 20);
        const timer = setInterval(() => {
            current += step;
            if (current >= left) {
                calEl.textContent = left;
                clearInterval(timer);
            } else {
                calEl.textContent = current;
            }
        }, 20);
    }
}

// Old renderCharts removed as we now use SVG circles in HTML
function renderCharts() {
    // No-op
}
