# Store Rating Management Application

**Output Images**  
![Dashboard](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/dashboard.png)
![User Login](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/user-login.png)
![Admin Panel](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/admin-panel.png)
![Store Owner View](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/store-owner-view.png)
![Rating Page](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/rating-page.png)
![Password Update](https://github.com/raju2703/Store_Rating_App/blob/main/screenshots/password-update.png)
<!-- Add or update image paths in your repo under /screenshots -->

---

## 🚀 Overview

A full-stack web application that enables users to submit and manage ratings for stores registered on the platform. It supports **role-based access** for users, store owners, and administrators.

---

## 🛠️ Tech Stack

- **Backend**: ExpressJS
- **Database**: MySQL
- **Frontend**: ReactJS (Vite)

---

## 👥 User Roles

- **Admin**
- **User**
- **Store Owner**

---

## 🔐 Authentication

A single login and registration system for all user roles.

---

## 🧩 Functionalities by Role

### 👨‍💼 Admin
- Add/view/edit/delete stores and users
- Dashboard with total users, stores, and ratings
- Filter/search users and stores
- Logout

### 🙍‍♂️ User
- Register/login
- View/search stores
- Submit and update ratings (1-5 stars)
- Update password
- Logout

### 🏪 Store Owner
- Login and update password
- View list of users who rated their store
- See average rating
- Reply to ratings
- Logout

---

## ✔️ Form Validations

- **Name**: 20–60 characters
- **Address**: Max 400 characters
- **Email**: Valid format
- **Password**: 8–16 characters, 1 uppercase, 1 special character

---

## 🔍 Features

- Table sorting (name, email, etc.)
- Average rating display
- Secure password handling
- Modular clean database schema
- Role-based routing and dashboards

---

## ⚙️ Getting Started

### Backend Setup

```bash
cd backend
npm install

Configure your database connection in .env file:

env
DATABASE_URL=postgresql://username:password@localhost:5432/your-database-name


Then start backend:

```bash
npm run dev

Backend runs at http://localhost:4000

For using super admin use these 

Email: admin@example.com  
Password: Admin123!



## ⚠️ **Important**
- Ensure PostgreSQL/MySQL is running.
- Create your database clearly and set connection URL in your backend .env clearly.

Example .env:
env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/your-database-name


---




## 📬 Contributing

Feel free to contribute or raise issues through pull requests.

## 📝 License

Specify clearly here if needed (MIT, etc.)

---

Made with ❤️ by [Raju Jadhav](https://github.com/raju2703)
