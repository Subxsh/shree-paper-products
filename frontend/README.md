# Shree Paper Products - Frontend

React.js frontend for the Shree Paper Products management system.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

Development mode:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── services/    # API service calls
│   ├── styles/      # CSS and styling
│   ├── utils/       # Helper functions
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
├── tailwind.config.js
├── package.json
└── README.md
```

## Pages

1. **Home Page** (`/`) - Landing page with company information
2. **Products** (`/products`) - Product catalog with filters
3. **Product Details** (`/products/:id`) - Detailed product specifications
4. **Order Creation** (`/orders/create`) - Create new purchase orders
5. **Orders** (`/orders`) - View all orders
6. **Dashboard** (`/dashboard`) - Admin dashboard with statistics
7. **Login** (`/login`) - Admin login

## Features

- ✅ Responsive design with Tailwind CSS
- ✅ Product catalog with advanced filters
- ✅ Purchase order creation and management
- ✅ PDF export for orders
- ✅ Admin dashboard with charts
- ✅ JWT authentication
- ✅ Real-time notifications (Toast)

## Login Credentials

```
Email: admin@shreepaper.com
Password: admin123
```

## Technologies Used

- React 18
- React Router v6
- Axios
- Tailwind CSS
- Chart.js
- React Hot Toast
- PDFKit

## Notes

- Make sure the backend server is running on `http://localhost:5000`
- Modify `REACT_APP_API_URL` in `.env.local` to match your backend URL
