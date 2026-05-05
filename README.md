![Artify Studio Banner](./screenshots/Banner.png)

# Artify Studio

Artify Studio is a full-stack creative community and marketplace platform where artists, musicians, dancers, mentors, learners, and sellers can connect in one modern web experience.

The project helps creators showcase their talent, discover events, join workshops, explore mentors, share community posts, chat in real time, and buy or sell musical instruments.

---

## Live Demo

Deployment link will be added here:

```text
Coming Soon
```

---

## Features

### Authentication

- User signup, login, logout, and protected routes
- JWT-based authentication
- Password reset flow
- Separate seller authentication flow

### Artist & Profile System

- User profile management
- Public creator profiles
- Mentor profile update option
- Saved products and wallet section

### Learn & Mentor System

- Dynamic Learn Page
- Become a Mentor from Profile Settings
- Public Mentor Profiles
- Mentor Identity System
- Unique Mentor Visibility

### Workshop

- Live Workshop Section
- Mentor-based workshop creation
- Interactive learning experience

### Events

- Event listing and event details
- Create events
- Add event reviews
- Delete user-created events

### Community

- Create community posts
- Like and comment on posts
- Delete posts
- Discover creator activity

### Marketplace

- Browse marketplace products
- Upload Images & Videos
- Product details page
- Add product listing
- Seller-wise product listing
- Cart and saved product support

### Payments

- Razorpay order creation
- Razorpay payment verification
- User order history

### Messaging

- Real-time chat using Socket.IO
- User conversations
- Send and delete messages

### Modern UI/UX

- Responsive dark theme interface
- Smooth animations with Framer Motion and GSAP
- Clean component-based frontend structure

### Performance & Optimization

- Dynamic API-based rendering
- Optimized frontend structure
- Continuous debugging & improvements

## Key Highlights

- Full-stack MERN application
- Real-time chat using Socket.IO
- Razorpay payment integration
- Cloudinary media upload integration
- Role-based mentor system
- Event creation and management system
- Community + Marketplace + Learning platform
- Dynamic workshop and mentor features

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- GSAP
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO

### Services & Tools

- Cloudinary
- Razorpay
- Nodemailer
- Git & GitHub

---

## Project Structure

```bash
Artify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/         # Images and static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and cart context
│   │   ├── pages/          # App pages
│   │   └── utils/          # API and helper utilities
│   ├── .env.example
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route business logic
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Cron jobs and helpers
│   ├── .env.example
│   └── package.json
│ 
├── screenshots/            
│   ├── Banner.png
│   ├── Events.png
│   ├── Home.png
│   ├── Learn.png
│   ├── Marketplace.png
│   └── Mentor.png
│
├── .gitignore
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NitishCodeMaster/Artify.git
cd Artify
```

### 2. Install Dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### 3. Setup Environment Variables

Use the `.env.example` files only as templates:

- `server/.env.example` shows the backend keys.
- `client/.env.example` shows the frontend keys.

Your real files should be named `.env` inside `server/` and `client/`. Real `.env` files are ignored by Git and should not be uploaded to GitHub.

### 4. Start the Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 5. Start the Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Environment Variables

### Server

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## API Modules

- `/api/users` - user auth, profile, wallet, saved items
- `/api/sellers` - seller auth and seller profile
- `/api/home` - home page data
- `/api/products` - marketplace products
- `/api/posts` - community posts, likes, comments
- `/api/payments` - Razorpay orders and verification
- `/api/messages` - conversations and chat messages
- `/api/events` - events and event reviews
- `/api/reviews` - product or platform reviews
- `/api/learn` - mentors and workshops

---

## Screenshots 

![Home](./screenshots/Home.png)
![Learn](./screenshots/Learn.png)
![Marketplace](./screenshots/Marketplace.png)
![Events](./screenshots/Events.png)
![Mentor](./screenshots/Mentor.png)
![Login](./screenshots/Login.png)
![Signup](./screenshots/Signup.png)

---

## Future Improvements

- Admin dashboard for user, event, and marketplace management
- AI-based artist, event, mentor, and product recommendations
- Live classes and video workshops
- Mentor booking system
- Better notification system
- Advanced search and filters
- Verified creator and seller badges

---

## Recent Product Updates

These updates were added to make the learning, workshop, and creator experience more dynamic and production-ready.

### Learn Workshops & Live Rooms

- Workshop creation now supports direct photo upload instead of only image URLs.
- Uploaded workshop photos are displayed with an adjustable preview style, so portrait and landscape images do not get badly cropped.
- Workshop cards open a detailed workshop modal with:
  - Back button
  - Full workshop image preview
  - Schedule, duration, registered learners, and mode
  - Mentor profile action
  - Delete action for the mentor who created the workshop
- Past workshops are automatically removed from the backend workshop list.
  - The server checks workshop `startAt` plus `durationMinutes`.
  - Expired sessions are deleted before returning live workshop data.
  - Only present/running and future workshops remain visible.

### Jitsi Live Room Integration

- Each workshop gets a unique Jitsi room link based on its workshop id.
- The live room format is:

```text
https://meet.jit.si/artify-workshop-<workshop-id>
```

- The `Join Live Room` button opens the workshop room in a new browser tab.
- The workshop modal also includes:
  - Copy Room Link
  - Add to Calendar
- Add to Calendar downloads an `.ics` invite containing the workshop title, schedule, duration, description, and Jitsi room link.

### Dynamic Features Section

- `Features.jsx` now uses live backend data from:
  - `/api/learn/overview`
  - `/api/products`
- Feature cards now show dynamic metrics, progress bars, and route-aware actions.
- The active feature spotlight auto-rotates and updates on hover or click.
- A Creative Spark prompt card was added to make the homepage more interactive.

### Creative Pulse Widget

- A global Creative Pulse widget was added across the app.
- It gives route-aware suggestions depending on the current page.
- It includes quick actions that navigate to useful sections.
- If hidden, a small restore button remains visible so the widget can be brought back anytime.

### Deployment Fixes

- `/api/products` now works directly in addition to `/api/products/all`.
- This fixes frontend requests that expect the root products endpoint during deployment.

---

## Author

**Nitish Kumar**

B.Tech CSE Student | Full Stack Developer

Passionate about building creative, modern, and impactful web applications.

---

## Support

If you like this project, consider giving it a star on GitHub.
