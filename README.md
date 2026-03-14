# LovePages Studio

LovePages Studio is a full-stack web application that lets you create personalized surprise websites for birthdays, proposals, anniversaries, and friendship memories.

## Tech stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Storage**: Cloudinary for media uploads

## Project structure

lovepages-studio  
 ├ frontend  
 │   ├ src/components  
 │   ├ src/pages  
 │   ├ src/styles  
 │   └ vite / tailwind / React app  
 │  
 ├ backend  
 │   ├ models  
 │   ├ routes  
 │   └ server.js

## Running the project locally

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or cloud, e.g. MongoDB Atlas)
- Optional: Cloudinary account for real photo uploads

### 1. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/lovepages_studio
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173

# Admin dashboard token
ADMIN_TOKEN=change-me-strong-token

# Optional: Cloudinary config for uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy `/api` to the backend.

### 3. URLs during development

- **App URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

## Key features implemented

- **Landing page** with hero, explanation, pricing (₹99 / ₹149 / ₹199), and categories.
- **Templates page** loading from `/api/templates` (with automatic seeding) and fallback templates.
- **Customization flow**: name, message, photos (preview), background music, theme color.
- **Preview page** with slideshow-style photo grid, music player, and “Preview Version” watermark.
- **Payment page** simulating a Razorpay-style flow and hitting `POST /api/websites` to create the site.
- **Generated website** at `/site/:slug` with animated intro, gallery, message, countdown and ending message.
- **Premium hooks** in the data model: password protection, video support, custom animations, multiple templates.
- **Admin dashboard** at `/admin` to view overview stats, orders, and generated websites, and delete websites.

## MongoDB models

- `User`: basic user record with role (user/admin).
- `Template`: base templates with category, preview image, and feature flags.
- `GeneratedWebsite`: the personalized pages with slug, content, design, and premium options.
- `Order`: simulated payment orders tied to generated websites.

## Deployment notes

### Backend (Render / Railway / VPS / Docker)

- Build a Node environment (Node 18+).
- Set environment variables for `MONGODB_URI`, `PORT`, `FRONTEND_ORIGIN`, `ADMIN_TOKEN`, and Cloudinary keys.
- Run `npm install` then `npm start` in the `backend` directory.
- Expose port `PORT` (default 5000).

### Frontend (Vercel / Netlify / Static host)

From the `frontend` directory:

```bash
npm install
npm run build
```

Deploy the generated `dist` folder to any static host:

- On Vercel/Netlify, set the build command to `npm run build` and the output directory to `dist`.
- Configure an environment variable or setting so that the frontend can call the backend URL:
  - Either keep the backend on `https://your-backend/api` and update the proxy in `vite.config.js` (for local).
  - Or, for production, use absolute URLs in your `axios` instance (e.g. `https://api.yourdomain.com/api`).

### Custom domain for generated sites

- Point a domain like `lovepages.site` to your frontend deployment.
- Ensure your router handles `/site/:slug` paths and the frontend still calls the correct backend `/api` base URL.

