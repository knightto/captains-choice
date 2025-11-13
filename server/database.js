import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database with promise wrapper
const sqlite = sqlite3.verbose();
const dbPath = join(__dirname, '../database.db');

// Create a promisified database wrapper
class Database {
  constructor() {
    this.db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.db.run('PRAGMA foreign_keys = ON');
      }
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes, lastID: this.lastID });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  prepare(sql) {
    const stmt = this.db.prepare(sql);
    return {
      run: (...params) => {
        return new Promise((resolve, reject) => {
          stmt.run(...params, function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes, lastID: this.lastID });
          });
        });
      },
      get: (...params) => {
        return new Promise((resolve, reject) => {
          stmt.get(...params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
      },
      all: (...params) => {
        return new Promise((resolve, reject) => {
          stmt.all(...params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }
    };
  }
}

const db = new Database();

// Initialize database tables
(async () => {
  try {
    await db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    course_name TEXT,
    course_city TEXT,
    course_state TEXT,
    event_date TEXT,
    start_time TEXT,
    start_type TEXT DEFAULT 'Shotgun',
    number_of_flights INTEGER DEFAULT 1,
    holes_played INTEGER DEFAULT 18,
    field_size INTEGER,
    team_size INTEGER DEFAULT 4,
    format TEXT DEFAULT 'Captains Choice',
    
    -- Tee settings
    mens_tee TEXT DEFAULT 'White',
    womens_tee TEXT DEFAULT 'Red',
    seniors_age INTEGER DEFAULT 60,
    seniors_tee TEXT DEFAULT 'Gold',
    super_seniors_age INTEGER DEFAULT 70,
    super_seniors_tee TEXT,
    max_handicap_index REAL DEFAULT 40.0,
    
    -- Basic scramble rules
    required_drives_per_player INTEGER DEFAULT 4,
    penalty_missing_drives INTEGER DEFAULT 2,
    
    -- Lies & placement
    lie_improvement_distance TEXT DEFAULT '1 club length',
    same_cut_requirement INTEGER DEFAULT 1,
    bunker_rake_and_place INTEGER DEFAULT 1,
    
    -- Preferred lies
    lift_clean_place INTEGER DEFAULT 1,
    lift_clean_place_areas TEXT DEFAULT 'fairway',
    
    -- OB and lost balls
    ob_rule TEXT DEFAULT 'stroke_and_distance',
    e5_local_rule INTEGER DEFAULT 0,
    
    -- Putts
    gimme_allowed INTEGER DEFAULT 1,
    gimme_distance TEXT DEFAULT 'putter grip',
    
    -- Max score
    max_score_rule TEXT DEFAULT 'net_double_bogey',
    
    -- Pace of play
    max_search_time INTEGER DEFAULT 3,
    ready_golf INTEGER DEFAULT 1,
    
    -- Handicap settings
    handicap_basis TEXT DEFAULT 'USGA',
    team_handicap_method TEXT DEFAULT 'Option A',
    team_handicap_percentages TEXT,
    
    -- Competition format
    competition_type TEXT DEFAULT 'both',
    use_flights INTEGER DEFAULT 1,
    flight_method TEXT DEFAULT 'team_handicap',
    
    -- Ties
    tiebreak_method TEXT DEFAULT 'matchback',
    tiebreak_order TEXT DEFAULT 'back9,last6,last3,18th',
    sudden_death INTEGER DEFAULT 0,
    
    -- Side games
    skins_enabled INTEGER DEFAULT 0,
    skins_type TEXT DEFAULT 'net',
    skins_entry_fee REAL,
    
    ctp_enabled INTEGER DEFAULT 0,
    ctp_holes TEXT,
    ctp_categories TEXT,
    
    long_drive_enabled INTEGER DEFAULT 0,
    long_drive_holes TEXT,
    long_drive_categories TEXT,
    
    straight_drive_enabled INTEGER DEFAULT 0,
    straight_drive_hole TEXT,
    
    longest_putt_enabled INTEGER DEFAULT 0,
    longest_putt_holes TEXT,
    
    three_putt_pot_enabled INTEGER DEFAULT 0,
    three_putt_amount REAL,
    
    mulligans_enabled INTEGER DEFAULT 0,
    mulligan_price REAL,
    mulligan_limit INTEGER,
    mulligan_use TEXT DEFAULT 'tee_only',
    
    -- Entry fees & payouts
    entry_fee_individual REAL,
    entry_fee_team REAL,
    entry_includes TEXT,
    prize_pool_teams REAL,
    prize_pool_skins REAL,
    prize_pool_ctp REAL,
    prize_pool_charity REAL,
    prize_type TEXT DEFAULT 'cash',
    payout_structure TEXT,
    
    -- Registration
    max_teams INTEGER,
    max_players INTEGER,
    registration_cutoff TEXT,
    payment_deadline TEXT,
    waitlist_enabled INTEGER DEFAULT 1,
    
    -- Check-in
    checkin_open_time TEXT,
    tee_gift TEXT,
    
    -- Scoring
    scoring_method TEXT DEFAULT 'physical',
    live_scoring_enabled INTEGER DEFAULT 0,
    
    -- Logistics
    cart_assignment_method TEXT DEFAULT 'sequential',
    
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create teams table
db.exec(`
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    team_name TEXT,
    team_number INTEGER,
    team_handicap REAL,
    flight TEXT,
    flight_number INTEGER DEFAULT 1,
    cart_number INTEGER,
    hole_assignment INTEGER,
    gross_score INTEGER,
    net_score INTEGER,
    access_code TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );
`);

// Create players table
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    team_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    handicap_index REAL,
    home_course TEXT,
    tee_preference TEXT,
    player_type TEXT DEFAULT 'regular',
    age INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
  );
`);

// Create scores table (hole-by-hole)
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    hole_number INTEGER NOT NULL,
    strokes INTEGER,
    drive_used_player_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (drive_used_player_id) REFERENCES players(id) ON DELETE SET NULL
  );
`);

// Create side games results table
db.exec(`
  CREATE TABLE IF NOT EXISTS side_game_results (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    game_type TEXT NOT NULL,
    hole_number INTEGER,
    category TEXT,
    winner_player_id TEXT,
    winner_team_id TEXT,
    measurement REAL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_player_id) REFERENCES players(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_team_id) REFERENCES teams(id) ON DELETE SET NULL
  );
`);

// Create mulligans table
db.exec(`
  CREATE TABLE IF NOT EXISTS mulligans (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
  );
`);

// Create score audit table for tracking changes
db.exec(`
  CREATE TABLE IF NOT EXISTS score_audit (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    hole_number INTEGER NOT NULL,
    old_strokes INTEGER,
    new_strokes INTEGER,
    old_drive_used_player_id TEXT,
    new_drive_used_player_id TEXT,
    changed_by TEXT,
    change_source TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );
`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();

export default db;
