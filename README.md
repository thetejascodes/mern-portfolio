<h1 align="center">🌐 Portfolio Website</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00C2FF&center=true&vCenter=true&width=550&lines=🚀+Full+Stack+Portfolio+%7C+Blog+%7C+Projects;Built+with+MERN+Stack+%2B+JWT+Auth;Admin+Dashboard+%7C+Contact+System+%7C+Blog+CRUD" alt="Typing SVG" />
</p>

---

### 🧑‍💻 About the Project

This is my **personal portfolio website** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
It showcases my **projects, blogs, and contact form**, all powered by a secure **JWT authentication system** and **admin control panel**.

---

### ⚙️ Features

✅ **Authentication System** — Secure login/signup with JWT tokens  
✅ **Role-Based Access Control** — Only admins can manage content  
✅ **Projects Section** — Display and manage personal projects  
✅ **Blog System** — Full CRUD with admin access  
✅ **Contact Form** — Sends messages directly to admin email via Nodemailer  
✅ **Protected Routes** — Users and Admins have separate privileges  
✅ **Error Handling Middleware** — Clean and centralized  
✅ **Modern UI** — Built with React + TailwindCSS  
✅ **Deployed Ready** — Backend & frontend fully separated for production  

---

### 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, TailwindCSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT + Cookies |
| **Email Service** | Nodemailer |
| **Security** | Helmet, Rate Limiting, CORS, Cookie Parser |

---

### 🔐 Environment Variables

Create a `.env` file inside your **`server/config/`** folder:  
(**Don’t upload it to GitHub!**)  

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
COOKIE_NAME=token

# Email Configuration
EMAIL_HOST=smtp.yourmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
RECEIVER_EMAIL=admin_email@example.com
