// ShopAdmin Core Application Logic
// Shared functionality across all pages

const App = {
    // Initialize common features
    init() {
        this.setupSidebar();
        this.setupNotifications();
        this.setupSearch();
        this.highlightActiveNav();
        this.loadTheme();
    },

    setupSidebar() {
        const toggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        // Close sidebar on nav click (mobile)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    },

    setupNotifications() {
        const notifBtn = document.getElementById('notifBtn');
        const notifPanel = document.getElementById('notifPanel');
        const closeNotif = document.getElementById('closeNotif');
        if (notifBtn && notifPanel) {
            notifBtn.addEventListener('click', () => {
                notifPanel.classList.toggle('active');
            });
        }
        if (closeNotif) {
            closeNotif.addEventListener('click', () => {
                notifPanel.classList.remove('active');
            });
        }
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (notifPanel && notifPanel.classList.contains('active') &&
                !notifPanel.contains(e.target) && e.target !== notifBtn && !notifBtn.contains(e.target)) {
                notifPanel.classList.remove('active');
            }
        });
    },

    setupSearch() {
        const search = document.getElementById('globalSearch');
        if (search) {
            search.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    const query = search.value.trim();
                    if (query) {
                        alert(`Searching for: "${query}"\n(In a full app this would filter results or navigate to search page)`);
                    }
                }
            });
        }
    },

    highlightActiveNav() {
        const path = window.location.pathname;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (path.endsWith(href) || (path.endsWith('/') && href.includes('index.html')) ||
                (path.includes('index.html') && href.includes('index.html'))) {
                item.classList.add('active');
            }
            // Better matching for pages
            if (href && path.includes(href.replace('../', '').replace('pages/', ''))) {
                item.classList.add('active');
            }
        });
    },

    // LocalStorage helpers
    getData(key, defaultVal = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultVal;
        } catch {
            return defaultVal;
        }
    },

    setData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Generate ID
    generateId(prefix = 'ID') {
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date
    formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Toast notification
    toast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; padding: 14px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white; border-radius: 8px; font-weight: 600; z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        // Future dark mode support
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
"// extra utility helpers" 
