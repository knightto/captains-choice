# Golf Outing Management System - MongoDB Edition

A comprehensive full-stack application for managing golf outings with MongoDB cloud database, extensive admin configuration, and separate interfaces for admins, teams, and clubhouse displays.

## Features

### Complete Event Management
- **Multiple Format Support**: Captain's Choice (Scramble), Best Ball, Alternate Shot, Stroke Play
- **Full Configuration**: All rules, handicaps, side games, fees, and payouts configurable through admin UI
- **Team & Player Management**: Add, edit, and organize teams and players
- **Document Generation**: Automatic generation of event summaries, rules documents, starter scripts, and scorecards
- **Mobile Scoring**: Teams enter scores on their phones during the round
- **Live Leaderboard**: Real-time leaderboard showing all teams' current progress
- **Audit Trail**: Complete history of all score changes with timestamps

### Admin Configuration Options

#### Basic Event Info
- Event name, date, time, course details
- Start type (Shotgun, Tee Times, Modified Shotgun)
- Team size (2-man, 3-man, 4-man)
- Tee assignments by gender and age group
- Maximum handicap limits

#### Format & Rules
- Required drives per player
- Lie improvement rules (club length, scorecard, etc.)
- Preferred lies / winter rules
- Out of bounds and lost ball rules
- Gimme distance and putting rules
- Maximum score per hole
- Pace of play settings

#### Handicap System
- Multiple handicap basis options (USGA, League, Estimate)
- Flexible team handicap calculation methods
- Gross, Net, or Both scoring
- Flight divisions
- Comprehensive tiebreaker rules

#### Side Games
- Skins (Gross, Net, or Both)
- Closest to the Pin
- Long Drive
- Straight Drive
- Longest Putt
- 3-Putt Pot
- Mulligans

#### Entry Fees & Payouts
- Individual and team entry fees
- Prize pool allocation percentages
- Multiple prize types (cash, shop credit, gift cards, etc.)
- Configurable payout structures

#### Registration & Logistics
- Team and player limits
- Registration and payment deadlines
- Waitlist management
- Check-in settings
- Cart assignment methods
- Scoring methods (physical, digital, or both)

## 🆕 What's New

### MongoDB Cloud Database
- **Cloud Database**: MongoDB Atlas for scalable, cloud-based data storage
- **Accessible Anywhere**: Access your tournament data from any location
- **All API endpoints** use Mongoose ODM for robust data management

### New Interfaces

#### 1. **Display Page** (`display.html`) - Clubhouse Big Screen
- Large screen display optimized for TVs at the clubhouse
- Live leaderboard with auto-refresh every 30 seconds
- Color-coded scores by performance
- Shows all flights simultaneously
- Beautiful gradient design with live indicator

#### 2. **Enhanced Mobile Scoring** (`scoring.html`) - Teams on Course  
- Hole-by-hole navigation (Prev/Next buttons)
- Large touch-friendly score buttons
- Quick player drive selection
- Visual scorecard overview
- Real-time score totals
- Auto-advance to next hole after save

### Sample Data with ALL Options Enabled
- 25 teams (100 players)
- 5 flights with snake draft distribution
- ALL side games enabled (skins, CTP, long drive, etc.)
- Complete rules configuration
- Various stages of round completion (testing-ready)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB**
   - Create a `.env` file in the project root:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   NODE_ENV=development
   ```

3. **Seed Sample Data** (Optional but recommended)
   ```bash
   node server/seed-sample-data.js
   ```
   
   This creates a fully configured event with 25 teams, 100 players, and all options enabled.

4. **Start the Application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API server on http://localhost:3000
   - Frontend development server on http://localhost:5173

## Usage

## Three Separate Interfaces

### 1. 👨‍💼 Admin Interface (Full Management)
**URL**: `http://localhost:5173` (index.html)

The complete management system for tournament organizers:
1. **Access the Admin Panel**: Open http://localhost:5173
2. **Select Event**: Choose "Annual Summer Classic Championship" (from sample data)
3. **Configure Everything**:
   - Basic Info: Event details, course, date, time
   - Format & Rules: Tournament rules, handicaps, scoring
   - Handicaps: Team handicap calculations
   - Side Games: Enable/configure all side contests
   - Fees & Payouts: Entry fees and prize distribution
   - Registration: Player limits, deadlines
   - Logistics: Check-in, carts, scoring method
4. **Manage Teams**: Add, edit, delete teams and players
5. **Generate Documents**: Event summary, rules, starter script, scorecards
6. **Monitor Live Scoring**: View audit trail and progress
7. **Calculate Prizes**: Automated payout calculator

### 2. 📺 Display Interface (Clubhouse Big Screen)
**URL**: `http://localhost:5173/display.html`

Large screen display for the clubhouse:
- **Purpose**: Show live leaderboard on TV at clubhouse
- **Features**:
  - Auto-refreshes every 30 seconds
  - Shows all flights simultaneously
  - Color-coded scores (green=good, yellow=average, red=high)
  - Live pulsing indicator
  - Optimized for 1920px+ displays
- **Setup**: Just open the URL on any device connected to a TV

### 3. 📱 Mobile Scoring Interface (Teams on Course)
**URL**: `http://localhost:5173/scoring.html`

Mobile-optimized scoring for teams during their round:
1. **Teams arrive at course** with their smartphone
2. **Open** `http://localhost:5173/scoring.html`
3. **Login** with their unique access code (e.g., "INM8GT" for Eagles)
4. **Score their round**:
   - Navigate hole-by-hole with Prev/Next buttons
   - Tap the score (large touch-friendly buttons)
   - Select whose drive was used
   - Tap "Save & Continue"
   - Automatically moves to next hole
5. **View scorecard**: See all completed holes at a glance
6. **Scores update** to display page in real-time

**Sample Access Codes** (from seeded data):
- Eagles: INM8GT
- Birdies: RODOS0  
- Phoenix: A9VOC9
- (See terminal output after running seed script for all 25 codes)

### Workflow Example

**Before the Event:**
1. Admin creates/configures event at `index.html`
2. Admin adds all teams and players
3. Admin generates access codes for each team
4. Admin prints/emails access codes to team captains

**Day of Event:**
5. Display page (`display.html`) opened on clubhouse TV
6. Teams arrive, use access codes to open `scoring.html` on phones
7. Teams play and enter scores hole-by-hole
8. Scores appear on clubhouse display in real-time
9. Admin monitors progress and audit trail at `index.html`

**After the Round:**
10. Admin reviews final scores and audit trail
11. Admin runs prize calculator to determine payouts
12. Display page shows final results

## API Endpoints

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Teams
- `GET /api/events/:eventId/teams` - Get teams for event
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Players
- `GET /api/events/:eventId/players` - Get players for event
- `GET /api/teams/:teamId/players` - Get players for team
- `POST /api/players` - Create player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Scoring
- `GET /api/teams/:teamId/scores` - Get scores for team
- `POST /api/scores` - Create/update score

### Documents
- `GET /api/events/:id/documents/:type` - Generate document
  - Types: `summary`, `rules`, `starter-script`, `scorecard`

### Mobile Scoring
- `GET /api/mobile/team/:accessCode` - Get team info and scores by access code
- `PUT /api/mobile/score` - Update score from mobile (creates audit trail)
- `POST /api/teams/:id/generate-code` - Generate access code for team

### Leaderboard
- `GET /api/events/:eventId/leaderboard` - Get live leaderboard for event

### Audit
- `GET /api/teams/:teamId/audit` - Get audit history for team
- `GET /api/events/:eventId/audit` - Get audit history for event

## Database Schema

The application uses **MongoDB Atlas** (cloud) with the following collections:
- **events**: All event configuration and settings (90+ fields)
- **teams**: Team information, assignments, and access codes
- **players**: Player details and handicaps
- **scores**: Hole-by-hole scoring with drive tracking
- **score_audit**: Complete audit trail of all score changes
- **side_game_results**: Results for side contests
- **mulligans**: Mulligan tracking per player

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js v24.11.0, Express.js v4.18.2
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose v8.19.3
- **Environment**: dotenv v17.2.3
- **Build Tool**: Vite v5.0.8
- **Development**: Nodemon v3.0.2, Concurrently v8.2.2

## Project Structure

```
captains-choice-outing/
├── server/
│   ├── index.js                    # Express API server (MongoDB)
│   ├── mongodb.js                  # Mongoose schemas and connection
│   └── seed-sample-data.js         # Sample data generator (100 players, all options)
├── index.html                      # 👨‍💼 Admin UI (Full management)
├── app.js                          # Frontend JavaScript (Admin)
├── display.html                    # 📺 Clubhouse big screen display
├── scoring.html                    # 📱 Enhanced mobile scoring with hole navigation
├── mobile.html                     # Mobile scoring (original version)
├── leaderboard.html                # Live leaderboard (original)
├── theme.css                       # 🎨 Centralized golf theme with CSS variables
├── .env                            # MongoDB connection string (not in git)
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Recent Enhancements

- ✅ **MongoDB Cloud Database**: Entire app runs on MongoDB Atlas
- ✅ **Unified Golf Theme**: Centralized CSS with golf course colors and design
- ✅ **Display Page**: Clubhouse big screen with auto-scroll and manual flight controls
- ✅ **Enhanced Mobile Scoring**: Visual scorecard, hole-by-hole navigation, touch-optimized
- ✅ **Sample Data Generator**: 100 players with ALL tournament options enabled
- ✅ **Live Updates**: Real-time leaderboard with auto-refresh
- ✅ **Mobile-Responsive**: Works perfectly on phones, tablets, and desktops
- ✅ **Flight Management**: Snake draft algorithm for fair team distribution
- ✅ **Prize Calculator**: Automatic payout distribution

## Future Enhancements

- Public registration page for players
- Real-time updates with WebSockets (instead of polling)
- Email/SMS notifications for access codes
- Payment integration
- Photo gallery
- Detailed reporting and analytics
- Export documents to PDF
- Multi-event management dashboard
- QR codes for easy mobile access
- Push notifications for score updates
- Offline mode for mobile scoring
- Team chat/messaging

## License

MIT
