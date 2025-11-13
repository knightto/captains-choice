import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course_name: String,
  course_city: String,
  course_state: String,
  event_date: String,
  start_time: String,
  start_type: { type: String, default: 'Shotgun' },
  number_of_flights: { type: Number, default: 1 },
  holes_played: { type: Number, default: 18 },
  field_size: Number,
  team_size: { type: Number, default: 4 },
  format: { type: String, default: 'Captains Choice' },
  
  // Tee settings
  mens_tee: { type: String, default: 'White' },
  womens_tee: { type: String, default: 'Red' },
  seniors_age: { type: Number, default: 60 },
  seniors_tee: { type: String, default: 'Gold' },
  super_seniors_age: { type: Number, default: 70 },
  super_seniors_tee: String,
  max_handicap_index: { type: Number, default: 40.0 },
  
  // Basic scramble rules
  required_drives_per_player: { type: Number, default: 4 },
  penalty_missing_drives: { type: Number, default: 2 },
  
  // Lies & placement
  lie_improvement_distance: { type: String, default: '1 club length' },
  same_cut_requirement: { type: Boolean, default: true },
  bunker_rake_and_place: { type: Boolean, default: true },
  
  // Preferred lies
  lift_clean_place: { type: Boolean, default: true },
  lift_clean_place_areas: { type: String, default: 'fairway' },
  
  // OB and lost balls
  ob_rule: { type: String, default: 'stroke_and_distance' },
  e5_local_rule: { type: Boolean, default: false },
  
  // Putts
  gimme_allowed: { type: Boolean, default: true },
  gimme_distance: { type: String, default: 'putter grip' },
  
  // Max score
  max_score_rule: { type: String, default: 'net_double_bogey' },
  
  // Pace of play
  max_search_time: { type: Number, default: 3 },
  ready_golf: { type: Boolean, default: true },
  
  // Handicap settings
  handicap_basis: { type: String, default: 'USGA' },
  team_handicap_method: { type: String, default: 'Option A' },
  team_handicap_percentages: String,
  
  // Competition format
  competition_type: { type: String, default: 'both' },
  use_flights: { type: Boolean, default: true },
  flight_method: { type: String, default: 'team_handicap' },
  
  // Ties
  tiebreak_method: { type: String, default: 'matchback' },
  tiebreak_order: { type: String, default: 'back9,last6,last3,18th' },
  sudden_death: { type: Boolean, default: false },
  
  // Side games
  skins_enabled: { type: Boolean, default: false },
  skins_type: { type: String, default: 'net' },
  skins_entry_fee: Number,
  
  ctp_enabled: { type: Boolean, default: false },
  ctp_holes: String,
  ctp_categories: String,
  
  long_drive_enabled: { type: Boolean, default: false },
  long_drive_holes: String,
  long_drive_categories: String,
  
  straight_drive_enabled: { type: Boolean, default: false },
  straight_drive_hole: String,
  
  longest_putt_enabled: { type: Boolean, default: false },
  longest_putt_holes: String,
  
  three_putt_pot_enabled: { type: Boolean, default: false },
  three_putt_amount: Number,
  
  mulligans_enabled: { type: Boolean, default: false },
  mulligan_price: Number,
  mulligan_limit: Number,
  mulligan_use: { type: String, default: 'tee_only' },
  
  // Entry fees & payouts
  entry_fee_individual: Number,
  entry_fee_team: Number,
  entry_includes: String,
  prize_pool_teams: Number,
  prize_pool_skins: Number,
  prize_pool_ctp: Number,
  prize_pool_charity: Number,
  prize_type: { type: String, default: 'cash' },
  payout_structure: String,
  
  // Registration
  max_teams: Number,
  max_players: Number,
  registration_cutoff: String,
  payment_deadline: String,
  waitlist_enabled: { type: Boolean, default: true },
  
  // Check-in
  checkin_open_time: String,
  tee_gift: String,
  
  // Scoring
  scoring_method: { type: String, default: 'physical' },
  live_scoring_enabled: { type: Boolean, default: false },
  
  // Logistics
  cart_assignment_method: { type: String, default: 'sequential' }
}, { timestamps: true });

// Team Schema
const teamSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  team_name: String,
  team_number: Number,
  team_handicap: Number,
  flight: String,
  flight_number: { type: Number, default: 1 },
  cart_number: Number,
  hole_assignment: Number,
  gross_score: Number,
  net_score: Number,
  access_code: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Player Schema
const playerSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  handicap_index: Number,
  course_handicap: Number,
  tee_preference: String,
  gender: String,
  age_category: String,
  payment_status: String,
  checked_in: { type: Boolean, default: false },
  checkin_time: String
}, { timestamps: true });

// Score Schema
const scoreSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  hole_number: { type: Number, required: true },
  strokes: Number,
  drive_used_player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  recorded_by: String,
  recorded_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Score Audit Schema
const scoreAuditSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  hole_number: Number,
  old_strokes: Number,
  new_strokes: Number,
  old_drive_used_player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  new_drive_used_player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  changed_by: String,
  change_source: { type: String, default: 'mobile' },
  timestamp: { type: Date, default: Date.now }
});

// Side Game Results Schema
const sideGameResultSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  game_type: String,
  hole_number: Number,
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  measurement: String,
  prize_amount: Number
}, { timestamps: true });

// Mulligan Schema
const mulliganSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  hole_number: Number,
  shot_type: String,
  used_at: { type: Date, default: Date.now }
});

// Create models
const Event = mongoose.model('Event', eventSchema);
const Team = mongoose.model('Team', teamSchema);
const Player = mongoose.model('Player', playerSchema);
const Score = mongoose.model('Score', scoreSchema);
const ScoreAudit = mongoose.model('ScoreAudit', scoreAuditSchema);
const SideGameResult = mongoose.model('SideGameResult', sideGameResultSchema);
const Mulligan = mongoose.model('Mulligan', mulliganSchema);

export {
  connectDB,
  Event,
  Team,
  Player,
  Score,
  ScoreAudit,
  SideGameResult,
  Mulligan
};
