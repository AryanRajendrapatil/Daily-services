# DailyServe — Frontend

A complete React + Vite frontend for the DailyServe home services platform. Includes three full portals: **User**, **Worker**, and **Admin**.

---

## 🚀 Quick Start

```bash
cd daily-services-frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

Make sure your backend is running at `http://localhost:5000`.

---

## 📁 Project Structure

```
daily-services-frontend/
├── index.html
├── vite.config.js          ← Proxies /api → localhost:5000
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx             ← Root: routing between landing/auth/dashboard
    ├── App.css             ← Global design system (CSS variables, components)
    ├── api.js              ← All backend API calls in one file
    ├── components/
    │   ├── Sidebar.jsx     ← Shared sidebar navigation
    │   ├── Sidebar.css
    │   └── Toast.jsx       ← Toast notification system
    └── pages/
        ├── LandingPage.jsx     ← Marketing landing page with portal selection
        ├── LandingPage.css
        ├── AuthPage.jsx        ← Login / Register for all 3 roles
        ├── AuthPage.css
        ├── UserDashboard.jsx   ← User: Browse workers, book, track
        ├── WorkerDashboard.jsx ← Worker: Manage bookings, profile
        ├── AdminDashboard.jsx  ← Admin: Stats, worker table, create admin
        ├── Dashboard.css       ← Shared dashboard styles
        └── AdminExtra.css
```

---

## 🔌 API Connections (`src/api.js`)

Every backend endpoint is wired up. Base URL is `http://localhost:5000/api`.

| Feature | Endpoints Used |
|---|---|
| Auth | `POST /user/login`, `/worker/login`, `/admin/login` |
| Register | `POST /user/create`, `/worker/create`, `/admin/create` |
| Workers | `GET /worker`, `/worker/:category`, `/worker/:id` |
| Bookings | `POST /booking/create`, `PUT /booking/update`, `/booking/user-cancel`, `/booking/worker-cancel` |
| Get Bookings | `GET /booking/user/:userId`, `/booking/worker/:workerId` |
| Profile | `PUT /user/change-password`, `/worker/change-password` |

---

## 🎨 Design System

Uses **CSS variables** defined in `App.css`. Dark industrial-luxury theme:

- **Font**: Syne (headings) + DM Sans (body)
- **Accent**: `#f5a623` amber/gold
- **Background**: `#0a0a0f` near-black
- **Components**: `.btn`, `.card`, `.form-input`, `.tag`, `.stat-card`, `.avatar`, `.modal`, `.toast`

---

## 🛡️ Role-Based Routing

Login detects your `role` field from the JWT response:

| Role | Dashboard |
|---|---|
| `client` | UserDashboard |
| `provider` | WorkerDashboard |
| `admin` | AdminDashboard |

---

## ⚠️ Backend Bugs to Fix

Your backend has several issues that will cause runtime errors. Fix these before connecting the frontend:

### 1. `next` is not defined in controllers
Every `catch` block calls `errorHandler(error, req, res, next)` but `next` is never passed into the function. Fix:

```js
// ❌ Current
const createAdmin = async (req, res) => { ... }

// ✅ Fix — add next parameter
const createAdmin = async (req, res, next) => { ... }
```
Apply this to ALL controller functions in: `admin_controller.js`, `user_controller.js`, `worker_controller.js`, `booking_controller.js`, `revier_controller.js`.

### 2. `User` model missing `module.exports`
`User_model.js` creates the model but never exports it:

```js
// Add at the bottom of User_model.js
module.exports = User;
```

### 3. `Worker` model — Service exported after Worker
In `worker_model.js`, `Service` is exported after `Worker` but `Worker` is already exported. The line `const Service = mongoose.model("Service", serviceSchema)` at the bottom runs too late. Move it before the `module.exports`:

```js
const Service = mongoose.model("Service", serviceSchema);
const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;
```

### 4. `loginToken` called incorrectly in `admin_controller.js`
`loginToken(req, res, next)` is called before the token is created — this will send a premature response. Remove this call; the manual `jwt.sign` + `res.cookie` below it is correct.

### 5. `review_controller.js` — `Worker` and `Review` not imported
```js
// Add at top of revier_controller.js
const Worker = require("../models/worker.model");
const Review = require("../models/review.model");
const errorHandler = require("../middlewares/error.middleware");
```

### 6. `booking.model.js` — `paymentStatus` has typo
```js
// ❌
enum: ["pending","completed","cancled"]
// ✅
enum: ["pending","completed","cancelled"]
```

### 7. Double `module.exports` in `booking_controller.js`
Remove the second `module.exports` at the bottom — only keep one.

### 8. `auth_controller.js` — missing imports
`loginToken`, `errorHandler`, and `Worker` are used but not imported.

### 9. `worker_controller.js` — `address` is referenced but not destructured
```js
// In createWorker and updateWorker, add address to destructuring:
const { name, email, password, serviceType, document, experience, address } = req.body;
```

### 10. Routes use wrong HTTP methods
- `DELETE /user/delete` — should use `req.params.id` (already does in controller), but route doesn't pass `:id`
- `GET /user/get` — should be `/user/get/:id`

Fix in `user_route.js`:
```js
userRoute.delete("/delete/:id", deleteUser);
userRoute.get("/get/:id", getUser);
```

---

## 🔒 Environment Variables (Backend)

Make sure your backend `.env` has:
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 📦 Frontend Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "vite": "^5",
  "@vitejs/plugin-react": "^4"
}
```

No extra UI libraries — everything is hand-crafted CSS.
