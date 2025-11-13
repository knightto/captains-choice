import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  connectDB,
  Event,
  Team,
  Player,
  Score,
  ScoreAudit,
  SideGameResult,
  Mulligan
} from './mongodb.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Serve static files from dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// ==================== EVENT ENDPOINTS ====================

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Delete associated teams, players, scores
    await Team.deleteMany({ event_id: req.params.id });
    await Player.deleteMany({ event_id: req.params.id });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TEAM ENDPOINTS ====================

// Get teams for an event
app.get('/api/events/:eventId/teams', async (req, res) => {
  try {
    const teams = await Team.find({ event_id: req.params.eventId }).sort({ team_number: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team
app.post('/api/teams', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team
app.put('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Delete associated players and scores
    await Player.deleteMany({ team_id: req.params.id });
    await Score.deleteMany({ team_id: req.params.id });
    
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLAYER ENDPOINTS ====================

// Get players for an event
app.get('/api/events/:eventId/players', async (req, res) => {
  try {
    const players = await Player.find({ event_id: req.params.eventId }).sort({ last_name: 1, first_name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get players for a team
app.get('/api/teams/:teamId/players', async (req, res) => {
  try {
    const players = await Player.find({ team_id: req.params.teamId });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create player
app.post('/api/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update player
app.put('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete player
app.delete('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SCORING ENDPOINTS ====================

// Get scores for a team
app.get('/api/teams/:teamId/scores', async (req, res) => {
  try {
    const scores = await Score.find({ team_id: req.params.teamId }).sort({ hole_number: 1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/update score
app.post('/api/scores', async (req, res) => {
  try {
    const existingScore = await Score.findOne({
      team_id: req.body.team_id,
      hole_number: req.body.hole_number
    });
    
    if (existingScore) {
      Object.assign(existingScore, req.body);
      await existingScore.save();
      res.json(existingScore);
    } else {
      const score = new Score(req.body);
      await score.save();
      res.status(201).json(score);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SIDE GAMES ENDPOINTS ====================

// Get side game results for an event
app.get('/api/events/:eventId/side-games', async (req, res) => {
  try {
    const results = await SideGameResult.find({ event_id: req.params.eventId });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create side game result
app.post('/api/side-games', async (req, res) => {
  try {
    const result = new SideGameResult(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MULLIGAN ENDPOINTS ====================

// Get mulligans for a player
app.get('/api/players/:playerId/mulligans', async (req, res) => {
  try {
    const mulligans = await Mulligan.find({ player_id: req.params.playerId });
    res.json(mulligans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/update mulligan record
app.post('/api/mulligans', async (req, res) => {
  try {
    const mulligan = new Mulligan(req.body);
    await mulligan.save();
    res.status(201).json(mulligan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DOCUMENT GENERATION ENDPOINTS ====================

// Generate event documents
app.get('/api/events/:id/documents/:type', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const { type } = req.params;
    let document = '';
    
    switch (type) {
      case 'summary':
        document = generateEventSummary(event);
        break;
      case 'rules':
        document = generateRulesDocument(event);
        break;
      case 'starter-script':
        document = generateStarterScript(event);
        break;
      case 'scorecard':
        document = generateScorecardTemplate(event);
        break;
      default:
        return res.status(400).json({ error: 'Invalid document type' });
    }
    
    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Document generation helper functions
function generateEventSummary(event) {
  const isScramble = event.format === 'Captains Choice';
  
  return `
# ${event.name || 'Golf Outing'} - Event Summary

## Event Details
- **Course:** ${event.course_name || '[Course Name]'}, ${event.course_city || '[City]'}, ${event.course_state || '[State]'}
- **Date:** ${event.event_date || '[Date]'}
- **Start Time:** ${event.start_time || '[Time]'}
- **Format:** ${event.team_size ? event.team_size + '-man ' : ''}${event.format}
- **Start Type:** ${event.start_type}

## Format Overview
${isScramble ? 
  `This is a ${event.team_size}-person Captain's Choice (scramble) tournament. All players tee off, the team selects the best shot, and all play from that spot. Each player's drive must be used at least ${event.required_drives_per_player} times during the round.` :
  `This is a ${event.format} tournament with ${event.team_size || 4} players per team.`
}

## Entry Fees
- **Individual Entry:** $${event.entry_fee_individual || '0'}
- **Team Entry:** $${event.entry_fee_team || '0'}
- **Includes:** ${event.entry_includes || 'Green fee, cart, range balls, prizes'}

## Competition
- **Type:** ${event.competition_type === 'both' ? 'Gross and Net' : event.competition_type === 'gross' ? 'Gross Only' : 'Net Only'}
- **Flights:** ${event.use_flights ? 'Yes' : 'No'}
- **Handicap Method:** ${event.team_handicap_method}

## Timeline
- ${event.checkin_open_time || '7:00 AM'} - Check-in opens
- ${event.start_time || '8:00 AM'} - Shotgun start
- Immediately following - Scoring and awards

## Side Games
${event.skins_enabled ? `- Skins Game ($${event.skins_entry_fee || '0'} per team)` : ''}
${event.ctp_enabled ? '- Closest to the Pin' : ''}
${event.long_drive_enabled ? '- Long Drive' : ''}
${event.straight_drive_enabled ? '- Straight Drive' : ''}
${event.longest_putt_enabled ? '- Longest Putt' : ''}
${event.mulligans_enabled ? `- Mulligans ($${event.mulligan_price || '0'} for ${event.mulligan_limit || 2})` : ''}
`;
}

function generateRulesDocument(event) {
  const isScramble = event.format === 'Captains Choice';
  
  return `
# ${event.name || 'Golf Outing'} - Official Rules & Format

${isScramble ? `
## SCRAMBLE FORMAT RULES

### How to Play
1. **All players tee off** on every hole
2. **Team selects the best ball** after each shot
3. **All players play from that spot** (within ${event.lie_improvement_distance})
4. **Continue until holed**

### Required Tee Shots
- Each player's drive must be used at least **${event.required_drives_per_player} times** during the 18-hole round
- If requirement is not met: **${event.penalty_missing_drives}-stroke penalty** added to final score

## LIES & PLACEMENT

### Ball Placement (Scramble)
- Place ball within **${event.lie_improvement_distance}** of selected spot
- ${event.same_cut_requirement ? 'Must remain in same cut of grass (fairway to fairway, rough to rough)' : 'Can be placed in any cut'}
- Never closer to the hole

### Bunkers
- ${event.bunker_rake_and_place ? 'Rake and place' : 'Must play from original lie'}
` : `
## ${event.format.toUpperCase()} FORMAT

${event.format === 'Best Ball' ? 'Each player plays their own ball. The lowest score on each hole counts as the team score.' : ''}
${event.format === 'Alternate Shot' ? 'Team members alternate hitting shots. Player A tees off on odd holes, Player B on even holes.' : ''}
${event.format === 'Stroke Play' ? 'Individual stroke play. Each player plays their own ball and records their own score.' : ''}
`}

### Preferred Lies
- ${event.lift_clean_place ? `Lift, clean, and place in effect on ${event.lift_clean_place_areas}` : 'Play the ball as it lies'}

## OUT OF BOUNDS & LOST BALLS

${event.ob_rule === 'stroke_and_distance' ? '- Standard stroke and distance penalty applies' : ''}
${event.ob_rule === 'lateral_drop' ? '- Drop laterally with 1-stroke penalty' : ''}
${event.e5_local_rule ? '- E-5 Local Rule: Drop with 2-stroke penalty where ball went OB/lost' : ''}

## PUTTING

### Gimmes
- ${event.gimme_allowed ? `Putts inside ${event.gimme_distance} may be conceded` : 'All putts must be holed'}

## MAXIMUM SCORE
- ${event.max_score_rule === 'net_double_bogey' ? 'Net double bogey per hole' : event.max_score_rule === 'double_bogey' ? 'Double bogey per hole' : 'No maximum'}

## PACE OF PLAY
- Maximum **${event.max_search_time} minutes** to search for lost balls
- ${event.ready_golf ? 'Ready golf encouraged' : 'Play according to honors'}
- Keep pace with group ahead

## HANDICAPS

### Handicap Basis
- ${event.handicap_basis === 'USGA' ? 'USGA Handicap Index' : event.handicap_basis === 'league' ? 'League handicap' : 'Captains estimate for players without official handicap'}

### Team Handicap Calculation
- Method: ${event.team_handicap_method}
${event.team_handicap_percentages ? `- Percentages: ${event.team_handicap_percentages}` : ''}

## SCORING & COMPETITION

### Format
- ${event.competition_type === 'both' ? 'Both gross and net scores count for prizes' : event.competition_type === 'gross' ? 'Gross scores only' : 'Net scores only'}

### Flights
- ${event.use_flights ? `Teams divided into flights by ${event.flight_method}` : 'Single flight for all teams'}

### Tiebreakers
- ${event.tiebreak_method === 'matchback' ? `Card matchback: ${event.tiebreak_order}` : ''}
- ${event.sudden_death ? 'Sudden death playoff if still tied' : 'Prize shared if still tied'}

## SIDE GAMES

${event.skins_enabled ? `### Skins
- **Type:** ${event.skins_type}
- **Entry Fee:** $${event.skins_entry_fee || '0'} per team
- Carryovers apply; shared if multiple winners on hole
` : ''}

${event.ctp_enabled ? `### Closest to the Pin
- **Holes:** ${event.ctp_holes || 'TBD'}
- **Categories:** ${event.ctp_categories || 'Overall'}
- Mark your ball before measuring
` : ''}

${event.long_drive_enabled ? `### Long Drive
- **Holes:** ${event.long_drive_holes || 'TBD'}
- **Categories:** ${event.long_drive_categories || 'Overall'}
- Must be in the fairway
` : ''}

${event.mulligans_enabled ? `### Mulligans
- **Price:** $${event.mulligan_price || '0'} for ${event.mulligan_limit || 2} mulligans
- **Use:** ${event.mulligan_use === 'tee_only' ? 'Tee shots only' : 'Anywhere'}
- Declare before hitting
` : ''}

## ETIQUETTE & SAFETY
- Repair divots and ball marks
- Keep carts on path where indicated
- Stay off greens and tees with carts
- Be courteous to other groups
- Have fun!
`;
}

function generateStarterScript(event) {
  const isScramble = event.format === 'Captains Choice';
  
  return `
# Starter Script - ${event.name || 'Golf Outing'}

Good morning everyone! Welcome to ${event.name || 'our golf outing'}!

## FORMAT
${isScramble ? `
We're playing a **${event.team_size}-person Captain's Choice scramble** today. Here's how it works:
- Everyone tees off
- Pick the best shot
- Everyone plays from there
- Each player's drive must be used at least **${event.required_drives_per_player} times**
` : `
We're playing **${event.format}** today with ${event.team_size || 4}-person teams.
${event.format === 'Best Ball' ? '- Each player plays their own ball\n- Lowest score counts for the team' : ''}
${event.format === 'Alternate Shot' ? '- Partners alternate hitting shots\n- One ball per team' : ''}
${event.format === 'Stroke Play' ? '- Individual play\n- Everyone plays their own ball' : ''}
`}

## KEY RULES

${isScramble ? `
### Ball Placement (Scramble)
- Within **${event.lie_improvement_distance}** of selected spot
- ${event.same_cut_requirement ? 'Same cut of grass' : 'Any cut'}
- Never closer to hole
` : ''}

### Special Conditions
- ${event.lift_clean_place ? `Lift, clean, and place on ${event.lift_clean_place_areas}` : 'Play it as it lies'}
- ${event.gimme_allowed ? `Gimmes inside ${event.gimme_distance}` : 'Hole everything out'}
- ${event.bunker_rake_and_place ? 'Rake and place in bunkers' : 'Play bunkers as they lie'}

### Out of Bounds
- ${event.ob_rule === 'stroke_and_distance' ? 'Stroke and distance' : event.e5_local_rule ? 'E-5 Rule: drop with 2-stroke penalty' : 'Lateral drop with 1-stroke penalty'}

## PACE OF PLAY
- Keep up with the group ahead
- ${event.ready_golf ? 'Ready golf - hit when ready' : 'Play honors'}
- Maximum **${event.max_search_time} minutes** for lost balls
- Let faster groups play through if you fall behind

## COURSE CONDITIONS
- Cart path only where marked
- Stay off tees and greens
- Repair divots and ball marks

## SIDE GAMES
${event.ctp_enabled ? `- Closest to Pin on holes ${event.ctp_holes || 'TBD'}` : ''}
${event.long_drive_enabled ? `- Long Drive on holes ${event.long_drive_holes || 'TBD'}` : ''}
${event.skins_enabled ? '- Skins game in effect' : ''}

## AFTER YOUR ROUND
- Sign and verify your scorecard
- Turn in card at ${event.scoring_method === 'physical' ? 'the scoring table' : 'the clubhouse'}
- Enjoy food and beverages
- Stick around for awards!

## QUESTIONS?
If you have any rules questions during play, please ask a course marshal or call the pro shop.

**Have a great round and good luck!**
`;
}

function generateScorecardTemplate(event) {
  return `
# SCORECARD - ${event.name || 'Golf Outing'}

## Team Information
- **Team Name:** _________________
- **Team Number:** _____
- **Flight:** _____

## Players
1. _________________________ (HCP: _____)
2. _________________________ (HCP: _____)
3. _________________________ (HCP: _____)
4. _________________________ (HCP: _____)

**Team Handicap:** _____

## Score

| Hole | Par | Yardage | Strokes | Drive Used |
|------|-----|---------|---------|------------|
| 1    |     |         |         |            |
| 2    |     |         |         |            |
| 3    |     |         |         |            |
| 4    |     |         |         |            |
| 5    |     |         |         |            |
| 6    |     |         |         |            |
| 7    |     |         |         |            |
| 8    |     |         |         |            |
| 9    |     |         |         |            |
| OUT  |     |         |         |            |
| 10   |     |         |         |            |
| 11   |     |         |         |            |
| 12   |     |         |         |            |
| 13   |     |         |         |            |
| 14   |     |         |         |            |
| 15   |     |         |         |            |
| 16   |     |         |         |            |
| 17   |     |         |         |            |
| 18   |     |         |         |            |
| IN   |     |         |         |            |
| TOTAL|     |         |         |            |

**Gross Score:** _____
**Team Handicap:** _____
**Net Score:** _____

## Side Games
- CTP Winners: _________________________
- Long Drive: __________________________
- Skins: _______________________________

## Signatures
All team members must sign to verify score:

1. _________________________ Date: _______
2. _________________________ Date: _______
3. _________________________ Date: _______
4. _________________________ Date: _______

**Turn in to scoring table immediately after finishing.**
`;
}

// ==================== MOBILE SCORING ENDPOINTS ====================

// Get team by access code
app.get('/api/mobile/team/:accessCode', async (req, res) => {
  try {
    const team = await Team.findOne({ access_code: req.params.accessCode });
    if (!team) {
      return res.status(404).json({ error: 'Invalid access code' });
    }
    
    // Get event details
    const event = await Event.findById(team.event_id);
    
    // Get team players
    const players = await Player.find({ team_id: team._id });
    
    // Get all scores for this team
    const scores = await Score.find({ team_id: team._id }).sort({ hole_number: 1 });
    
    res.json({ team, event, players, scores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update score from mobile (with audit trail)
// Mobile score submission (POST and PUT both supported)
const mobileScoreHandler = async (req, res) => {
  try {
    const { team_id, hole_number, strokes, drive_used_player_id, changed_by } = req.body;
    
    // Get existing score
    const existingScore = await Score.findOne({ team_id, hole_number });
    
    // Create audit entry
    const audit = new ScoreAudit({
      team_id,
      hole_number,
      old_strokes: existingScore?.strokes || null,
      new_strokes: strokes,
      old_drive_used_player_id: existingScore?.drive_used_player_id || null,
      new_drive_used_player_id: drive_used_player_id || null,
      changed_by: changed_by || 'Team',
      change_source: 'mobile'
    });
    await audit.save();
    
    // Update or insert score
    if (existingScore) {
      existingScore.strokes = strokes;
      existingScore.drive_used_player_id = drive_used_player_id;
      await existingScore.save();
    } else {
      const score = new Score({ team_id, hole_number, strokes, drive_used_player_id });
      await score.save();
    }
    
    // Calculate total scores
    const allScores = await Score.find({ team_id });
    const grossScore = allScores.reduce((sum, s) => sum + (s.strokes || 0), 0);
    
    // Update team totals
    await Team.findByIdAndUpdate(team_id, { gross_score: grossScore });
    
    res.json({ success: true, grossScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.post('/api/mobile/score', mobileScoreHandler);
app.put('/api/mobile/score', mobileScoreHandler);

// Generate access code for team
app.post('/api/teams/:id/generate-code', async (req, res) => {
  try {
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { access_code: accessCode },
      { new: true }
    );
    res.json({ accessCode: team.access_code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEADERBOARD ENDPOINTS ====================

// Get live leaderboard for an event
app.get('/api/events/:eventId/leaderboard', async (req, res) => {
  try {
    const teams = await Team.find({ event_id: req.params.eventId })
      .sort({ flight_number: 1, gross_score: 1, team_name: 1 })
      .lean();
    
    // Get player count and holes completed for each team
    for (let team of teams) {
      const players = await Player.find({ team_id: team._id }, 'first_name last_name').lean();
      const scores = await Score.find({ team_id: team._id, strokes: { $ne: null } }).countDocuments();
      team.players = players;
      team.holes_completed = scores;
    }
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign teams to flights based on scores
app.post('/api/events/:eventId/assign-flights', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const numberOfFlights = event.number_of_flights || 1;
    
    // Get all teams with scores, sorted by gross score (best to worst)
    const teams = await Team.find({ event_id: req.params.eventId })
      .sort({ gross_score: 1, team_name: 1 });

    if (teams.length === 0) {
      return res.json({ message: 'No teams to assign' });
    }

    // Divide teams evenly into flights using snake draft method
    const teamsPerFlight = Math.ceil(teams.length / numberOfFlights);
    
    for (let i = 0; i < teams.length; i++) {
      const round = Math.floor(i / numberOfFlights);
      let flightNumber;
      
      if (round % 2 === 0) {
        flightNumber = (i % numberOfFlights) + 1;
      } else {
        flightNumber = numberOfFlights - (i % numberOfFlights);
      }
      
      teams[i].flight_number = flightNumber;
      teams[i].flight = `Flight ${flightNumber}`;
      await teams[i].save();
    }

    res.json({ 
      success: true, 
      message: `Assigned ${teams.length} teams to ${numberOfFlights} flights`,
      teamsPerFlight: teamsPerFlight
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate suggested prize distribution across flights
app.post('/api/events/:eventId/calculate-prizes', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { totalPurse, placesToPay } = req.body;
    const numberOfFlights = event.number_of_flights || 1;
    
    // Get team count
    const totalTeams = await Team.countDocuments({ event_id: req.params.eventId });
    
    if (totalTeams === 0) {
      return res.json({ 
        error: 'No teams in event',
        distribution: []
      });
    }

    // Calculate teams per flight
    const teamsPerFlight = Math.ceil(totalTeams / numberOfFlights);
    
    // Standard payout percentages (adjust based on places to pay)
    const payoutPercentages = {
      1: [100],
      2: [60, 40],
      3: [50, 30, 20],
      4: [40, 30, 20, 10],
      5: [35, 25, 20, 12, 8]
    };
    
    const places = Math.min(placesToPay || 3, teamsPerFlight);
    const percentages = payoutPercentages[places] || payoutPercentages[3];
    
    // Calculate prize per flight
    const prizePerFlight = totalPurse / numberOfFlights;
    
    // Build distribution for each flight
    const distribution = [];
    
    for (let flight = 1; flight <= numberOfFlights; flight++) {
      const flightPrizes = [];
      let flightTotal = 0;
      
      percentages.forEach((pct, index) => {
        const rawAmount = (prizePerFlight * pct) / 100;
        // Round to nearest $5 for even amounts
        const roundedAmount = Math.floor(rawAmount / 5) * 5;
        flightPrizes.push({
          place: index + 1,
          percentage: pct,
          amount: roundedAmount
        });
        flightTotal += roundedAmount;
      });
      
      distribution.push({
        flight: flight,
        flightName: `Flight ${flight}`,
        prizes: flightPrizes,
        flightTotal: flightTotal,
        teamsInFlight: teamsPerFlight
      });
    }
    
    // Calculate totals
    const totalAwarded = distribution.reduce((sum, f) => sum + f.flightTotal, 0);
    const leftover = totalPurse - totalAwarded;
    
    res.json({
      success: true,
      totalPurse: totalPurse,
      numberOfFlights: numberOfFlights,
      totalTeams: totalTeams,
      teamsPerFlight: teamsPerFlight,
      placesToPay: places,
      distribution: distribution,
      totalAwarded: totalAwarded,
      leftover: leftover
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUDIT ENDPOINTS ====================

// Get audit history for a team
app.get('/api/teams/:teamId/audit', async (req, res) => {
  try {
    const audit = await ScoreAudit.find({ team_id: req.params.teamId })
      .sort({ timestamp: -1 });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit history for an event
app.get('/api/events/:eventId/audit', async (req, res) => {
  try {
    // Get all teams for this event
    const teams = await Team.find({ event_id: req.params.eventId }, '_id team_name team_number').lean();
    const teamIds = teams.map(t => t._id);
    const teamMap = {};
    teams.forEach(t => {
      teamMap[t._id.toString()] = { team_name: t.team_name, team_number: t.team_number };
    });
    
    // Get audit entries for these teams
    const audit = await ScoreAudit.find({ team_id: { $in: teamIds } })
      .sort({ timestamp: -1 })
      .lean();
    
    // Add team info to audit entries
    audit.forEach(entry => {
      const teamInfo = teamMap[entry.team_id.toString()];
      if (teamInfo) {
        entry.team_name = teamInfo.team_name;
        entry.team_number = teamInfo.team_number;
      }
    });
    
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
