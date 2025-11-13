# Captain's Choice - Ready for Render.com Deployment 🚀

## ✅ What's Been Done

Your golf tournament management app is now ready to deploy to Render.com and be accessible from ANY device worldwide!

### Changes Made:

1. **✅ API Endpoints Updated**
   - Changed from `http://localhost:3000/api` to `/api` (relative paths)
   - Works in both development (with Vite proxy) and production

2. **✅ Production Server Configuration**
   - Express now serves static files from `dist/` folder
   - Catch-all route for frontend routing
   - NODE_ENV detection for dev vs production

3. **✅ Build Process**
   - Vite builds frontend to `dist/` folder
   - npm start runs production server
   - npm run dev still works for local development

4. **✅ Render.com Configuration**
   - `render.yaml` created for automatic deployment
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

5. **✅ Documentation Created**
   - `DEPLOYMENT.md` with step-by-step instructions
   - Environment variable setup
   - MongoDB Atlas configuration
   - Troubleshooting guide

## 📝 Next Steps (Do This Now!)

### 1. Deploy to Render.com

1. Go to https://dashboard.render.com
2. Click **New + → Web Service**
3. Connect GitHub repo: `knightto/captains-choice`
4. Render will auto-detect settings from `render.yaml`
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://knightto:[PASSWORD]@dev-tee-time-brs.w9ybjej.mongodb.net/captains-choice`
6. Click **Create Web Service**
7. Wait 3-5 minutes for deployment

### 2. Get Your Live URL

Render will give you a URL like:
```
https://captains-choice.onrender.com
```

### 3. Share These URLs With Your Team

**📱 Mobile Scoring (Teams on Course):**
```
https://[your-app].onrender.com/scoring.html
```
Access codes: 12301-12325

**📺 Clubhouse Display (Big Screen):**
```
https://[your-app].onrender.com/display.html
```
Auto-scrolling leaderboard

**⚙️ Admin Panel (Tournament Management):**
```
https://[your-app].onrender.com/
```
Full control of tournament

## 🌐 How It Works Now

### Before (Local Only):
- ❌ Only accessible on your computer
- ❌ Teams need to be on same WiFi
- ❌ localhost:5173, localhost:3000

### After (Cloud Hosted):
- ✅ Accessible from ANYWHERE with internet
- ✅ Teams score from their phones on cellular data
- ✅ Display on any Smart TV with web browser
- ✅ One URL for everything

## 💻 Development Commands (Still Work!)

```bash
# Local development (two servers)
npm run dev

# Create sample tournament
npm run seed

# Fill with random scores
npm run fill-scores

# Build for production (Render does this automatically)
npm run build

# Test production build locally
npm start
```

## 🎯 Quick Test After Deployment

1. Open `https://[your-app].onrender.com` on your phone
2. Go to `/scoring.html` and enter code `12301`
3. You should see "Eagles" team with 4 players
4. Open `/display.html` on a tablet to see leaderboard

## ⚠️ Important Notes

1. **First Request Takes 30 Seconds**: Free tier sleeps after 15 min of inactivity
2. **MongoDB Access**: Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. **Access Codes**: Already generated (12301-12325) from your sample data

## 📞 Support

If something doesn't work:
1. Check Render logs in dashboard
2. Verify MongoDB connection string
3. Test `/api/events` endpoint directly in browser
4. See DEPLOYMENT.md for detailed troubleshooting

---

**Your tournament app is ready to go live! 🏌️⛳**
