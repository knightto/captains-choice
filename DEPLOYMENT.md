# Deploying Captain's Choice to Render.com

This guide will help you deploy the Captain's Choice golf tournament app to Render.com, making it accessible from any device worldwide.

## Prerequisites

1. **MongoDB Atlas Account** (already set up)
   - Your connection string: `mongodb+srv://knightto:***@dev-tee-time-brs.w9ybjej.mongodb.net/`

2. **Render.com Account**
   - Sign up at https://render.com (free tier available)
   - Connect your GitHub account

3. **GitHub Repository**
   - Your repo: https://github.com/knightto/captains-choice

## Deployment Steps

### Step 1: Push Latest Changes to GitHub

```bash
git add .
git commit -m "Prepare for Render.com deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `knightto/captains-choice`
4. Configure the service:
   - **Name**: `captains-choice` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://knightto:[PASSWORD]@dev-tee-time-brs.w9ybjej.mongodb.net/captains-choice` |
| `PORT` | `3000` |

**Important**: Replace `[PASSWORD]` with your actual MongoDB Atlas password.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Run `npm install`
   - Build the frontend with Vite
   - Start the Node.js server
3. Wait 2-5 minutes for deployment to complete

### Step 5: Access Your App

Once deployed, Render will provide you with a URL like:
```
https://captains-choice.onrender.com
```

You can now access your app from ANY device:

#### 📱 **Mobile Scoring** (Teams on the course)
```
https://captains-choice.onrender.com/scoring.html
```
- Enter access code: 12301-12325
- Score holes in real-time

#### 📺 **Clubhouse Display** (Smart TV or big screen)
```
https://captains-choice.onrender.com/display.html
```
- Auto-scrolling leaderboard
- Updates every 30 seconds

#### ⚙️ **Admin Panel** (Tournament organizers)
```
https://captains-choice.onrender.com/
```
- Full tournament management
- Create events, teams, players
- View audit logs

#### 🏆 **Leaderboard** (Public viewing)
```
https://captains-choice.onrender.com/leaderboard.html
```
- Live standings by flight
- Color-coded scores

## MongoDB Atlas Configuration

Make sure your MongoDB Atlas is configured to allow connections from Render:

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

## Custom Domain (Optional)

If you want to use your own domain (e.g., `tournament.yourgolfclub.com`):

1. In Render dashboard, go to your service → **Settings** → **Custom Domains**
2. Add your domain
3. Update your DNS records as instructed by Render

## Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours/month (enough for 24/7 uptime)
- ⚠️ Service sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds to wake up

**Tip**: To keep the service awake during your tournament, set up a simple ping service or upgrade to the paid tier ($7/month) for always-on service.

## Testing After Deployment

1. **Test Admin Panel**: Create a test event, add teams
2. **Test Mobile Scoring**: Use access code to enter scores
3. **Test Display**: Open on a tablet/TV to verify auto-scroll
4. **Test from Phone**: Use your phone's browser (not localhost!)

## Troubleshooting

### Build Fails
- Check Render logs for errors
- Ensure all dependencies are in `package.json`
- Verify `npm run build` works locally

### Can't Connect to MongoDB
- Verify MONGODB_URI is correct
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Ensure password has no special characters that need URL encoding

### API Calls Fail
- Check browser console for errors
- Verify API endpoints use relative paths (`/api/...`)
- Check Render logs for server errors

## Local Development vs Production

### Local Development
```bash
npm run dev
```
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API calls proxied through Vite

### Production (Render)
```bash
npm start
```
- Everything served from one domain
- Static files served by Express
- API at same domain: `/api/...`

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check MongoDB Atlas logs: Atlas → Database → Monitoring
3. Test API endpoints directly: `https://your-app.onrender.com/api/events`

---

## Quick Reference

```bash
# Development
npm run dev              # Start local development servers
npm run seed            # Create sample tournament data
npm run fill-scores     # Generate random scores for testing

# Production Build
npm run build           # Build frontend for production
npm start              # Start production server

# Deployment
git push origin main    # Deploy updates (auto-deploys on Render)
```

Your tournament management app is now accessible from anywhere in the world! 🌍⛳🏌️
