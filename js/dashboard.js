// Dashboard specific logic
document.addEventListener('DOMContentLoaded', () => {
    // Sample recent orders
    const recentOrders = [
        { id: 'ORD-1284', customer: 'Alice Johnson', product: 'Wireless Headphones', amount: 129.99, status: 'completed', date: '2026-11-25' },
        { id: 'ORD-1283', customer: 'Bob Smith', product: 'Smart Watch Pro', amount: 249.00, status: 'processing', date: '2026-11-25' },
        { id: 'ORD-1282', customer: 'Carol White', product: 'Leather Wallet', amount: 45.50, status: 'pending', date: '2026-11-24' },
        { id: 'ORD-1281', customer: 'David Lee', product: 'Running Shoes', amount: 89.99, status: 'completed', date: '2026-11-24' },
        { id: 'ORD-1280', customer: 'Emma Davis', product: 'Bluetooth Speaker', amount: 79.00, status: 'cancelled', date: '2026-11-23' },
    ];

    const tbody = document.getElementById('recentOrdersBody');
    if (tbody) {
        tbody.innerHTML = recentOrders.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${o.product}</td>
                <td>${App.formatCurrency(o.amount)}</td>
                <td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                <td>${App.formatDate(o.date)}</td>
            </tr>
        `).join('');
    }

    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [12000, 15000, 14000, 18000, 21000, 19500, 23000, 25000, 22000, 27000, 24580],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Category Chart
    const catCtx = document.getElementById('categoryChart');
    if (catCtx) {
        new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
                datasets: [{
                    data: [35, 25, 15, 15, 10],
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Update stats from localStorage if available
    const products = App.getData('products', []);
    const orders = App.getData('orders', []);
    if (products.length) {
        document.getElementById('totalProducts').textContent = products.length;
    }
    if (orders.length) {
        document.getElementById('totalOrders').textContent = orders.length;
        const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        document.getElementById('totalRevenue').textContent = App.formatCurrency(revenue || 24580);
    }
});
