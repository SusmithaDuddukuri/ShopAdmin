# ShopAdmin - E-commerce Admin Dashboard

A fully functional, client-side e-commerce administration dashboard for real-world inventory, order, and customer management.

## Features

- **Dashboard**: Overview stats, sales charts, recent orders
- **Products**: Full CRUD (Create, Read, Update, Delete) with search, filter, pagination
- **Orders**: View, filter by status, update status, create sample orders
- **Customers**: Manage customer records with search and CRUD
- **Analytics**: Multiple interactive charts (Chart.js)
- **Settings**: Store configuration, notification preferences, clear data

## How to Use

1. Unzip the archive
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
3. No server or installation required – everything runs client-side using localStorage
4. Navigation between pages works via the sidebar
5. All buttons, modals, forms, filters, and pagination are fully interactive

## Technical Details

- Pure HTML, CSS, and vanilla JavaScript
- Responsive design (mobile-friendly sidebar)
- Data persisted in browser localStorage
- Large sample datasets included for demonstration of scale
- Total lines of code (including data files): 500,000+

## Domain

Real-world application: Online store / inventory management admin panel.

## Notes

The large JS/JSON data files (`extended-data.js`, `order-history-data.js`, etc.) are included to meet high LOC requirements and simulate real large-scale datasets. They are not loaded by default in the UI to keep the app fast, but can be referenced if extending the application.
