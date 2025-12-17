/**
 * Auth Service using LocalStorage
 * Manages user sessions and credentials.
 */

const Auth = {
    /**
     * Register a new user
     * @param {string} email 
     * @param {string} password 
     * @returns {object} result { success: boolean, message: string }
     */
    signup: (email, password) => {
        const users = JSON.parse(localStorage.getItem('app_users') || '[]');
        
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            email,
            password, // In a real app, this should be hashed!
            profile: {
                name: email.split('@')[0],
                joined: new Date().toISOString()
            }
        };
        
        users.push(newUser);
        localStorage.setItem('app_users', JSON.stringify(users));
        
        // Auto login after signup
        Auth.login(email, password);
        
        return { success: true, message: 'Account created successfully' };
    },

    /**
     * Login a user
     * @param {string} email 
     * @param {string} password 
     * @returns {object} result { success: boolean, message: string }
     */
    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('app_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }
        
        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.profile.name,
            expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('app_session', JSON.stringify(session));
        return { success: true, message: 'Login successful' };
    },

    /**
     * Logout current user
     */
    logout: () => {
        localStorage.removeItem('app_session');
        window.location.href = 'index.html';
    },

    /**
     * Check if user is authenticated
     * @returns {object|null} session object or null
     */
    checkAuth: () => {
        const sessionStr = localStorage.getItem('app_session');
        if (!sessionStr) return null;
        
        try {
            const session = JSON.parse(sessionStr);
            if (Date.now() > session.expiry) {
                Auth.logout();
                return null;
            }
            return session;
        } catch (e) {
            Auth.logout();
            return null;
        }
    },

    /**
     * Guard a page - redirect to login if not authenticated
     */
    requireAuth: () => {
        const session = Auth.checkAuth();
        if (!session) {
            window.location.href = 'index.html';
        }
        return session;
    },

    /**
     * Redirect to dashboard if already logged in (for login/signup pages)
     */
    redirectIfAuthenticated: () => {
        if (Auth.checkAuth()) {
            window.location.href = 'dashboard.html';
        }
    }
};
