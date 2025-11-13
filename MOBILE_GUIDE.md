# Quick Start Guide - Mobile Scoring

## For Tournament Organizers

### 1. Set Up Your Event
1. Open the admin panel: http://localhost:5173
2. Create your event and configure all settings
3. Add all teams and players

### 2. Generate Access Codes
1. Go to the **Live Scoring** tab
2. Click **"Generate Codes for All Teams"**
3. Click **"View All Access Codes"**
4. Each team gets a unique 6-character code (e.g., ABC123)

### 3. Share with Teams
Print or send each team their access code via:
- Email
- Text message  
- Printed scorecard
- Team check-in packet

### 4. During the Round
**Monitor Live Leaderboard:**
- Open: http://localhost:5173/leaderboard.html
- Display on a TV/monitor for players to see
- Enable "Auto-refresh" to update every 30 seconds

**Track Score Changes:**
- Go to Live Scoring tab → Load Audit History
- See who changed what score and when
- Export to CSV for records

---

## For Teams (Players)

### Accessing Your Scorecard

**Option 1: Enter Access Code**
1. Open on your phone: http://localhost:5173/mobile.html
2. Enter your 6-character access code
3. Tap "Continue"

**Option 2: Use Direct Link**
If your organizer sent a link, just click it!

### Entering Scores

For each hole:

1. **Set the Score**
   - Tap "−" or "+" to adjust strokes
   - Or tap the number to manually enter

2. **Select Drive Used** (if required)
   - Tap the player whose drive was used
   - Required for Captain's Choice format

3. **Save**
   - Tap "Save Score" button
   - Wait for "✓ Saved" confirmation

### Tips

✅ **Save after each hole** - Don't wait until the end!

✅ **Check the score** - Your total shows at the top

✅ **Use the navigation** - Bottom bar shows completed holes (in green)

✅ **Fix mistakes** - Tap a completed hole to change it

✅ **One person scores** - Designate one team member to enter scores

---

## Troubleshooting

**Can't find the mobile page?**
- Make sure the server is running (npm run dev)
- Check you're on the same network
- Try: http://localhost:5173/mobile.html

**Invalid access code?**
- Check for typos (codes are CASE SENSITIVE)
- Ask tournament organizer to regenerate

**Score won't save?**
- Check your internet connection
- Make sure you entered a score > 0
- Select whose drive was used (if required)
- Try again

**Want to see the leaderboard?**
- Open: http://localhost:5173/leaderboard.html
- Or ask the tournament organizer to display it

---

## Advanced Features

### For Network Access (Optional)
To allow teams to access from their phones on the same WiFi:

1. Find your computer's IP address:
   - Windows: `ipconfig` → look for IPv4 Address
   - Mac: System Preferences → Network
   
2. Teams visit: `http://YOUR_IP:5173/mobile.html`
   - Example: http://192.168.1.100:5173/mobile.html

### Audit Trail
Track every score change:
- Who changed it
- When they changed it  
- Old score → New score
- Source (mobile or admin)

Export to CSV for permanent records!

---

## Need Help?

**Access Code Issues:** Contact tournament organizer

**Technical Issues:** Check the README.md file

**Feature Requests:** The system is fully customizable!
