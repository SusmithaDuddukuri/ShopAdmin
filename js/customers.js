const CustomersPage = {
    customers: [],
    editingId: null,

    init() {
        this.load();
        this.bind();
        this.render();
    },

    load() {
        let stored = App.getData('customers', null);
        if (!stored || !stored.length) {
            stored = [
                { id: 'CUS-001', name: 'Alice Johnson', email: 'alice@email.com', phone: '+1-555-0101', orders: 5, joined: '2025-03-12' },
                { id: 'CUS-002', name: 'Bob Smith', email: 'bob@email.com', phone: '+1-555-0102', orders: 3, joined: '2025-05-20' },
                { id: 'CUS-003', name: 'Carol White', email: 'carol@email.com', phone: '+1-555-0103', orders: 8, joined: '2024-11-08' },
                { id: 'CUS-004', name: 'David Lee', email: 'david@email.com', phone: '+1-555-0104', orders: 2, joined: '2026-01-15' },
                { id: 'CUS-005', name: 'Emma Davis', email: 'emma@email.com', phone: '+1-555-0105', orders: 1, joined: '2026-06-30' },
                { id: 'CUS-006', name: 'Frank Miller', email: 'frank@email.com', phone: '+1-555-0106', orders: 12, joined: '2024-08-22' },
                { id: 'CUS-007', name: 'Grace Kim', email: 'grace@email.com', phone: '+1-555-0107', orders: 4, joined: '2025-09-14' },
            ];
            App.setData('customers', stored);
        }
        this.customers = stored;
    },

    bind() {
        document.getElementById('addCustomerBtn').addEventListener('click', () => this.open());
        document.getElementById('closeCustModal').addEventListener('click', () => this.close());
        document.getElementById('cancelCustBtn').addEventListener('click', () => this.close());
        document.getElementById('saveCustBtn').addEventListener('click', () => this.save());
        document.getElementById('customerSearch').addEventListener('input', () => this.render());
    },

    render() {
        let list = [...this.customers];
        const q = document.getElementById('customerSearch').value.toLowerCase();
        if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
        document.getElementById('customersBody').innerHTML = list.map(c => `
            <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone || '-'}</td>
                <td>${c.orders}</td>
                <td>${App.formatDate(c.joined)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="CustomersPage.edit('${c.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="CustomersPage.del('${c.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7"><div class="empty-state"><p>No customers</p></div></td></tr>';
    },

    open(c = null) {
        this.editingId = c ? c.id : null;
        document.getElementById('custModalTitle').textContent = c ? 'Edit Customer' : 'Add Customer';
        document.getElementById('custId').value = c ? c.id : '';
        document.getElementById('custName').value = c ? c.name : '';
        document.getElementById('custEmail').value = c ? c.email : '';
        document.getElementById('custPhone').value = c ? c.phone || '' : '';
        document.getElementById('customerModal').classList.add('active');
    },

    close() { document.getElementById('customerModal').classList.remove('active'); this.editingId = null; },

    save() {
        const name = document.getElementById('custName').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        if (!name || !email) { App.toast('Name and email required', 'error'); return; }
        if (this.editingId) {
            const i = this.customers.findIndex(c => c.id === this.editingId);
            if (i > -1) { this.customers[i] = { ...this.customers[i], name, email, phone }; App.toast('Customer updated'); }
        } else {
            this.customers.unshift({ id: App.generateId('CUS'), name, email, phone, orders: 0, joined: new Date().toISOString().split('T')[0] });
            App.toast('Customer added');
        }
        App.setData('customers', this.customers);
        this.close();
        this.render();
    },

    edit(id) { const c = this.customers.find(x => x.id === id); if (c) this.open(c); },

    del(id) {
        if (confirm('Delete customer?')) {
            this.customers = this.customers.filter(c => c.id !== id);
            App.setData('customers', this.customers);
            App.toast('Customer deleted', 'error');
            this.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => CustomersPage.init());
"// customer module updates" 
