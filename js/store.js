/**
 * Store.js
 * Manages data persistence for users, logs, and settings (theme).
 */

const Store = {
    // Keys
    DATA_KEY: 'app_data',
    THEME_KEY: 'app_theme',

    // --- Theme Management ---
    initTheme: () => {
        const theme = localStorage.getItem(Store.THEME_KEY) || 'light';
        Store.setTheme(theme);
    },

    toggleTheme: () => {
        const current = localStorage.getItem(Store.THEME_KEY) || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        Store.setTheme(next);
        return next;
    },

    setTheme: (theme) => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem(Store.THEME_KEY, theme);
    },

    // --- Data Management ---
    getUserData: (email) => {
        const allData = JSON.parse(localStorage.getItem(Store.DATA_KEY) || '{}');
        if (!allData[email]) {
            // Initialize User Data if new
            allData[email] = {
                profile: {
                    name: 'User',
                    goals: { calories: 2000, protein: 150, carbs: 200, fats: 70 }
                },
                logs: {}, // Format: "YYYY-MM-DD": { foods: [] }
                streak: { count: 0, lastLogin: null }
            };
            localStorage.setItem(Store.DATA_KEY, JSON.stringify(allData));
        }
        return allData[email];
    },

    saveUserData: (email, data) => {
        const allData = JSON.parse(localStorage.getItem(Store.DATA_KEY) || '{}');
        allData[email] = data;
        localStorage.setItem(Store.DATA_KEY, JSON.stringify(allData));
    },

    updateGoal: (email, newGoal) => {
        const data = Store.getUserData(email);
        data.profile.goals.calories = parseInt(newGoal);
        Store.saveUserData(email, data);
        return data.profile.goals;
    },

    // --- Log Operations ---
    getToday: () => {
        return new Date().toISOString().split('T')[0];
    },

    getLog: (email, date) => {
        const data = Store.getUserData(email);
        return data.logs[date] || { foods: [] };
    },

    addFood: (email, foodItem) => {
        const date = Store.getToday();
        const data = Store.getUserData(email);

        if (!data.logs[date]) {
            data.logs[date] = { foods: [] };

            // Streak Logic: If yesterday had logs, increment. If today already has logs, ignore.
            // Simple version: just increment if logging for the first time today
            data.streak.count += 1;
            data.streak.lastLogin = date;
        }

        data.logs[date].foods.push({
            ...foodItem,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });

        Store.saveUserData(email, data);
        return data.logs[date];
    },

    // --- Stats Operations ---
    getDailyStats: (email, date) => {
        const log = Store.getLog(email, date);
        const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };

        log.foods.forEach(food => {
            totals.calories += (food.calories || 0);
            totals.protein += (food.protein || 0);
            totals.carbs += (food.carbs || 0);
            totals.fats += (food.fats || 0);
        });

        return totals;
    },

    getWeeklyStats: (email) => {
        const stats = [];
        const today = new Date();

        // Get last 7 days including today
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const dayStats = Store.getDailyStats(email, dateStr);
            stats.push({ day: dayName, date: dateStr, calories: dayStats.calories });
        }
        return stats;
    }
};

// Auto-init theme on load
Store.initTheme();
