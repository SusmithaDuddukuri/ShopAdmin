const OrdersPage = {
    orders: [],
    editingId: null,

    init() {
        this.loadOrders();
        this.bindEvents();
        this.render();
    },

    loadOrders() {
        let stored = App.getData('orders', null);
        if (!stored || stored.length === 0) {
            stored = [
                { id: 'ORD-1284', customer: 'Alice Johnson', items: 2, amount: 174.99, status: 'completed', date: '2026-11-25' },
                { id: 'ORD-1283', customer: 'Bob Smith', items: 1, amount: 249.00, status: 'processing', date: '2026-11-25' },
                { id: 'ORD-1282', customer: 'Carol White', items: 3, amount: 135.50, status: 'pending', date: '2026-11-24' },
                { id: 'ORD-1281', customer: 'David Lee', items: 1, amount: 89.99, status: 'completed', date: '2026-11-24' },
                { id: 'ORD-1280', customer: 'Emma Davis', items: 1, amount: 79.00, status: 'cancelled', date: '2026-11-23' },
                { id: 'ORD-1279', customer: 'Frank Miller', items: 4, amount: 320.00, status: 'completed', date: '2026-11-22' },
                { id: 'ORD-1278', customer: 'Grace Kim', items: 2, amount: 110.00, status: 'processing', date: '2026-11-22' },
                { id: 'ORD-1277', customer: 'Henry Wilson', items: 1, amount: 45.50, status: 'pending', date: '2026-11-21' },
            ];
            App.setData('orders', stored);
        }
        this.orders = stored;
    },

    bindEvents() {
        document.getElementById('statusFilter').addEventListener('change', () => this.render());
        document.getElementById('orderSearch').addEventListener('input', () => this.render());
        document.getElementById('addOrderBtn').addEventListener('click', () => {
            const newOrder = {
                id: App.generateId('ORD'),
                customer: 'New Customer',
                items: 1,
                amount: Math.round(Math.random() * 200 + 20),
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            };
            this.orders.unshift(newOrder);
            App.setData('orders', this.orders);
            App.toast('New order created');
            this.render();
        });
        document.getElementById('closeOrderModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelOrderBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveStatusBtn').addEventListener('click', () => this.saveStatus());
    },

    render() {
        let list = [...this.orders];
        const search = document.getElementById('orderSearch').value.toLowerCase();
        const status = document.getElementById('statusFilter').value;
        if (search) list = list.filter(o => o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search));
        if (status) list = list.filter(o => o.status === status);

        const tbody = document.getElementById('ordersBody');
        tbody.innerHTML = list.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${o.items}</td>
                <td>${App.formatCurrency(o.amount)}</td>
                <td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                <td>${App.formatDate(o.date)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="OrdersPage.editStatus('${o.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="OrdersPage.deleteOrder('${o.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7"><div class="empty-state"><p>No orders found</p></div></td></tr>';
    },

    editStatus(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;
        this.editingId = id;
        document.getElementById('orderInfo').textContent = `Order ${order.id} - ${order.customer}`;
        document.getElementById('newStatus').value = order.status;
        document.getElementById('orderModal').classList.add('active');
    },

    closeModal() {
        document.getElementById('orderModal').classList.remove('active');
        this.editingId = null;
    },

    saveStatus() {
        const status = document.getElementById('newStatus').value;
        const idx = this.orders.findIndex(o => o.id === this.editingId);
        if (idx !== -1) {
            this.orders[idx].status = status;
            App.setData('orders', this.orders);
            App.toast('Order status updated');
            this.closeModal();
            this.render();
        }
    },

    deleteOrder(id) {
        if (confirm('Delete this order?')) {
            this.orders = this.orders.filter(o => o.id !== id);
            App.setData('orders', this.orders);
            App.toast('Order deleted', 'error');
            this.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => OrdersPage.init());
"// order tracking enhancements" 
