// Products page logic - full CRUD with localStorage
const ProductsPage = {
    products: [],
    currentPage: 1,
    perPage: 10,
    editingId: null,

    init() {
        this.loadProducts();
        this.bindEvents();
        this.render();
    },

    loadProducts() {
        let stored = App.getData('products', null);
        if (!stored || stored.length === 0) {
            // Seed with sample data
            stored = [
                { id: 'PRD-001', name: 'Wireless Headphones', category: 'Electronics', price: 129.99, stock: 45, description: 'Noise cancelling over-ear headphones' },
                { id: 'PRD-002', name: 'Smart Watch Pro', category: 'Electronics', price: 249.00, stock: 28, description: 'Fitness tracking smartwatch' },
                { id: 'PRD-003', name: 'Leather Wallet', category: 'Fashion', price: 45.50, stock: 120, description: 'Genuine leather bifold wallet' },
                { id: 'PRD-004', name: 'Running Shoes', category: 'Sports', price: 89.99, stock: 8, description: 'Lightweight running shoes' },
                { id: 'PRD-005', name: 'Bluetooth Speaker', category: 'Electronics', price: 79.00, stock: 0, description: 'Portable waterproof speaker' },
                { id: 'PRD-006', name: 'Cotton T-Shirt', category: 'Fashion', price: 24.99, stock: 200, description: 'Premium cotton crew neck' },
                { id: 'PRD-007', name: 'Yoga Mat', category: 'Sports', price: 35.00, stock: 55, description: 'Non-slip exercise mat' },
                { id: 'PRD-008', name: 'Desk Lamp', category: 'Home', price: 42.50, stock: 33, description: 'LED adjustable desk lamp' },
                { id: 'PRD-009', name: 'Backpack', category: 'Fashion', price: 65.00, stock: 40, description: 'Water resistant travel backpack' },
                { id: 'PRD-010', name: 'Coffee Maker', category: 'Home', price: 119.00, stock: 15, description: 'Programmable drip coffee maker' },
                { id: 'PRD-011', name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 90, description: 'Ergonomic wireless mouse' },
                { id: 'PRD-012', name: 'Denim Jeans', category: 'Fashion', price: 59.99, stock: 70, description: 'Slim fit stretch denim' },
            ];
            App.setData('products', stored);
        }
        this.products = stored;
    },

    bindEvents() {
        document.getElementById('addProductBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveProductBtn').addEventListener('click', () => this.saveProduct());
        document.getElementById('productSearch').addEventListener('input', () => { this.currentPage = 1; this.render(); });
        document.getElementById('categoryFilter').addEventListener('change', () => { this.currentPage = 1; this.render(); });
        document.getElementById('stockFilter').addEventListener('change', () => { this.currentPage = 1; this.render(); });

        // Close modal on overlay click
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') this.closeModal();
        });
    },

    getFiltered() {
        let list = [...this.products];
        const search = document.getElementById('productSearch').value.toLowerCase();
        const cat = document.getElementById('categoryFilter').value;
        const stock = document.getElementById('stockFilter').value;

        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search));
        }
        if (cat) list = list.filter(p => p.category === cat);
        if (stock === 'in') list = list.filter(p => p.stock > 10);
        if (stock === 'low') list = list.filter(p => p.stock > 0 && p.stock <= 10);
        if (stock === 'out') list = list.filter(p => p.stock === 0);
        return list;
    },

    render() {
        const filtered = this.getFiltered();
        const start = (this.currentPage - 1) * this.perPage;
        const pageItems = filtered.slice(start, start + this.perPage);
        const tbody = document.getElementById('productsBody');

        if (pageItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-box-open"></i><p>No products found</p></div></td></tr>`;
        } else {
            tbody.innerHTML = pageItems.map(p => {
                let statusClass = 'completed';
                let statusText = 'In Stock';
                if (p.stock === 0) { statusClass = 'cancelled'; statusText = 'Out of Stock'; }
                else if (p.stock <= 10) { statusClass = 'pending'; statusText = 'Low Stock'; }
                return `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>${App.formatCurrency(p.price)}</td>
                    <td>${p.stock}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="ProductsPage.editProduct('${p.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="ProductsPage.deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            }).join('');
        }

        // Pagination
        const totalPages = Math.ceil(filtered.length / this.perPage) || 1;
        const pag = document.getElementById('pagination');
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="ProductsPage.goToPage(${i})">${i}</button>`;
        }
        pag.innerHTML = html;
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
    },

    openModal(product = null) {
        this.editingId = product ? product.id : null;
        document.getElementById('modalTitle').textContent = product ? 'Edit Product' : 'Add Product';
        document.getElementById('productId').value = product ? product.id : '';
        document.getElementById('productName').value = product ? product.name : '';
        document.getElementById('productCategory').value = product ? product.category : 'Electronics';
        document.getElementById('productPrice').value = product ? product.price : '';
        document.getElementById('productStock').value = product ? product.stock : '';
        document.getElementById('productDesc').value = product ? product.description || '' : '';
        document.getElementById('productModal').classList.add('active');
    },

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
        this.editingId = null;
    },

    saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const description = document.getElementById('productDesc').value.trim();

        if (!name || isNaN(price) || isNaN(stock)) {
            App.toast('Please fill all required fields', 'error');
            return;
        }

        if (this.editingId) {
            const idx = this.products.findIndex(p => p.id === this.editingId);
            if (idx !== -1) {
                this.products[idx] = { ...this.products[idx], name, category, price, stock, description };
                App.toast('Product updated successfully');
            }
        } else {
            const newProduct = {
                id: App.generateId('PRD'),
                name, category, price, stock, description
            };
            this.products.unshift(newProduct);
            App.toast('Product added successfully');
        }

        App.setData('products', this.products);
        this.closeModal();
        this.render();
    },

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) this.openModal(product);
    },

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            App.setData('products', this.products);
            App.toast('Product deleted', 'error');
            this.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => ProductsPage.init());
"/* refined validation */" 
"// product management improvements" 
"// search and filter logic" 
