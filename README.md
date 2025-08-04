# 🏬 Store Rating Web Application

A full-stack role-based store rating platform built with **React.js**, **Express.js**, **MySQL**, and **Tailwind CSS**. Users can browse and rate stores, while admins and store owners have access to management dashboards. The application ensures secure login, password policies, and dynamic content rendering based on user roles.

---

## 📊 Dashboards Overview

This application features three distinct dashboards, each tailored to the specific roles defined in the system:

---

### 🛠️ 1. Admin Dashboard  
**Access:** System Administrators

#### Key Features:
- **User Management**
  - Add new users (Admins or Normal Users) with full details.
  - View, filter, and sort user listings by name, email, address, or role.
  - View complete user profiles, including store ratings for Store Owners.
- **Store Management**
  - Add and manage stores.
  - Filter and sort store listings by key attributes.
  - View store ratings and associated metadata.
- **System Overview**
  - Dashboard statistics:
    - Total Users
    - Total Stores
    - Total Ratings
- **Security**
  - Secure logout functionality.

---

### 👤 2. Normal User Dashboard  
**Access:** Registered Users

#### Key Features:
- **Account Management**
  - Register with name, email, address, and password.
  - Login and securely update passwords post-authentication.
- **Store Interactions**
  - Browse all registered stores with relevant details.
  - Filter or search stores by name or address.
  - Submit and update ratings (1 to 5) for any store.
  - View personal rating history per store.
- **Security**
  - Secure logout functionality.

---

### 🏪 3. Store Owner Dashboard  
**Access:** Store Owners (assigned by Admins)

#### Key Features:
- **Rating Analytics**
  - View all users who rated their store.
  - Monitor average store ratings in real-time.
- **Account Management**
  - Secure login and password update capabilities.
- **Security**
  - Secure logout functionality.

---

All dashboards are role-sensitive and dynamically rendered upon login. Unauthorized users are restricted from accessing dashboards outside their assigned roles.

---

## 🚀 Features

- 📊 Admin Dashboard with System Stats
- ➕ User & Store Management Interfaces
- 🔍 Filterable and Sortable Listings
- ⭐ Store Rating System (1–5 Stars)
- 🧾 Profile & Password Update
- 🔐 JWT Authentication & Authorization
- ♻️ Component-Based Architecture (React)
- 💅 Fully Responsive UI with Tailwind CSS

---

## ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/raju2703/Store_Rating_App.git
   cd Store_Rating_App
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Launch in browser:**

   ```
   http://localhost:5173
   ```

---

## 🌐 Backend Configuration

- All MySQL queries are handled via the Express.js backend.
- Create a MySQL database manually.
- Example `.env` file for backend connectivity:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_app
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

---

## 🔑 Password Policy

Password must meet the following criteria:
- 8–16 characters
- At least one uppercase letter
- At least one special character (e.g., `!@#$%^&*`)

---

## 🧪 Technologies Used

- React.js (Frontend)
- Tailwind CSS (Styling)
- Vite (Build Tool)
- Express.js (Backend)
- MySQL (Database)
- JWT (Authentication)
- bcrypt (Password Hashing)

---

## 🙌 Acknowledgements

Grateful to the open-source community and maintainers of:

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Vite](https://vitejs.dev/)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## 🙋‍♂️ Author

**Raju Jadhav**  
[GitHub](https://github.com/raju2703) • [LinkedIn](https://www.linkedin.com/in/raju-jadhav-608505287)
