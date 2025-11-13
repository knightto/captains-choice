// Sample Data Seeder for Golf Outing Management System
import mongoose from 'mongoose';
import { connectDB, Event, Team, Player, Score } from './mongodb.js';

// Sample player names
const firstNames = ['John', 'Mike', 'Dave', 'Tom', 'Bill', 'Steve', 'Mark', 'Chris', 
                    'Dan', 'Jim', 'Bob', 'Rick', 'Joe', 'Paul', 'Jeff', 'Brad',
                    'Kevin', 'Brian', 'Scott', 'Tim', 'Gary', 'Ron', 'Ken', 'Greg'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 
                   'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 
                   'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAccessCode(teamNumber) {
  return `123${String(teamNumber).padStart(2, '0')}`;
}

async function seedData() {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    await Event.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Score.deleteMany({});

    // Create event
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30); // 30 days from now
    
    console.log('📅 Creating event with ALL options enabled...');
    const event = await Event.create({
      name: 'Annual Summer Classic Championship',
      course_name: 'Pine Valley Golf Club',
      course_city: 'Springfield',
      course_state: 'IL',
      event_date: eventDate.toISOString().split('T')[0],
      start_time: '8:00 AM',
      start_type: 'Shotgun',
      number_of_flights: 5,
      holes_played: 18,
      field_size: 100,
      team_size: 4,
      format: 'Scramble',
      
      // Tee settings - ALL configured
      mens_tee: 'Blue',
      womens_tee: 'Red',
      seniors_age: 60,
      seniors_tee: 'White',
      super_seniors_age: 70,
      super_seniors_tee: 'Gold',
      max_handicap_index: 40.0,
      
      // Scramble rules - ALL enabled
      required_drives_per_player: 4,
      penalty_missing_drives: 2,
      
      // Lies & placement - ALL enabled
      lie_improvement_distance: '1 club length',
      same_cut_requirement: true,
      bunker_rake_and_place: true,
      
      // Preferred lies - ENABLED
      lift_clean_place: true,
      lift_clean_place_areas: 'fairway',
      
      // OB rules - E5 local rule enabled
      ob_rule: 'stroke_and_distance',
      e5_local_rule: true,
      
      // Putts - Gimmes enabled
      gimme_allowed: true,
      gimme_distance: 'putter grip',
      
      // Max score
      max_score_rule: 'net_double_bogey',
      
      // Pace of play
      max_search_time: 3,
      ready_golf: true,
      
      // Handicap settings
      handicap_basis: 'USGA',
      team_handicap_method: 'Option A',
      team_handicap_percentages: '25,20,15,10',
      
      // Competition format
      competition_type: 'both',
      use_flights: true,
      flight_method: 'team_handicap',
      
      // Ties
      tiebreak_method: 'matchback',
      tiebreak_order: 'back9,last6,last3,18th',
      sudden_death: true,
      
      // Side games - ALL ENABLED
      skins_enabled: true,
      skins_type: 'net',
      skins_entry_fee: 20,
      
      ctp_enabled: true,
      ctp_holes: '3,7,12,16',
      ctp_categories: 'Mens,Womens,Seniors',
      
      long_drive_enabled: true,
      long_drive_holes: '9,18',
      long_drive_categories: 'Mens,Womens',
      
      straight_drive_enabled: true,
      straight_drive_hole: '14',
      
      longest_putt_enabled: true,
      longest_putt_holes: '5,11,17',
      
      three_putt_pot_enabled: true,
      three_putt_amount: 5,
      
      mulligans_enabled: true,
      mulligan_price: 5,
      mulligan_limit: 2,
      mulligan_use: 'anywhere',
      
      // Entry fees & payouts
      entry_fee_individual: 100,
      entry_fee_team: 400,
      entry_includes: 'Green fees, cart, lunch, prizes',
      prize_pool_teams: 8000,
      prize_pool_skins: 500,
      prize_pool_ctp: 200,
      prize_pool_charity: 500,
      prize_type: 'cash',
      payout_structure: '40,30,20,10',
      
      // Registration
      max_teams: 30,
      max_players: 120,
      registration_cutoff: eventDate.toISOString().split('T')[0],
      payment_deadline: eventDate.toISOString().split('T')[0],
      waitlist_enabled: true,
      
      // Check-in
      checkin_open_time: '7:00 AM',
      tee_gift: 'Logo ball and tee set',
      
      // Scoring
      scoring_method: 'mobile',
      live_scoring_enabled: true,
      
      // Logistics
      cart_assignment_method: 'by_team'
    });
    
    console.log(`✅ Event created: ${event._id}\n`);

    // Create 25 teams (100 players total - 24 teams of 4 + 1 team of 4)
    console.log('👥 Creating 25 teams with 100 players...');
    const teams = [];
    const teamNames = [
      'Eagles', 'Birdies', 'Aces', 'Bogeys', 'Tigers', 'Lions', 
      'Hawks', 'Falcons', 'Sharks', 'Dolphins', 'Mustangs', 'Broncos',
      'Rangers', 'Raiders', 'Vikings', 'Warriors', 'Knights', 'Titans',
      'Thunder', 'Lightning', 'Storm', 'Blaze', 'Rockets', 'Comets', 'Phoenix'
    ];

    for (let i = 0; i < 25; i++) {
      const teamName = teamNames[i];
      const accessCode = generateAccessCode(i + 1);
      
      // Create team
      const team = await Team.create({
        event_id: event._id,
        team_name: teamName,
        team_number: i + 1,
        access_code: accessCode,
        flight_number: 1,
        flight: 'Flight 1'
      });

      teams.push({ id: team._id, name: teamName, number: i + 1, accessCode });

      // Create 4 players per team
      for (let j = 0; j < 4; j++) {
        const firstName = randomElement(firstNames);
        const lastName = randomElement(lastNames);
        const handicap = randomInt(5, 28);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
        const phone = `555-${String(randomInt(100, 999)).padStart(3, '0')}-${String(randomInt(1000, 9999)).padStart(4, '0')}`;

        await Player.create({
          team_id: team._id,
          event_id: event._id,
          first_name: firstName,
          last_name: lastName,
          handicap_index: handicap,
          email: email,
          phone: phone,
          tee_preference: 'Blue'
        });
      }
    }
    
    console.log(`✅ Created 25 teams with 100 players\n`);

    // Add scores for teams (varying completion levels)
    console.log('⛳ Adding scores (teams at various stages of completion)...');
    
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      let holesCompleted;
      let baseScore;
      
      // First 8 teams: Completed (18 holes)
      if (i < 8) {
        holesCompleted = 18;
        baseScore = randomInt(58, 68); // Good scores
      }
      // Next 8 teams: In progress (9-17 holes)
      else if (i < 16) {
        holesCompleted = randomInt(9, 17);
        baseScore = randomInt(60, 72); // Mixed scores
      }
      // Last 8 teams: Just started (1-8 holes)
      else {
        holesCompleted = randomInt(1, 8);
        baseScore = randomInt(62, 75); // Various scores
      }

      let totalScore = 0;
      const players = await Player.find({ team_id: team.id });

      for (let hole = 1; hole <= holesCompleted; hole++) {
        // Par 4 average: 3-5 strokes in scramble
        const strokes = randomInt(3, 5);
        totalScore += strokes;
        
        // Random player whose drive was used
        const drivePlayer = randomElement(players);

        await Score.create({
          team_id: team.id,
          hole_number: hole,
          strokes: strokes,
          drive_used_player_id: drivePlayer._id
        });
      }

      // Update team's gross score
      await Team.findByIdAndUpdate(team.id, { gross_score: totalScore });
    }

    console.log(`✅ Added scores for all teams\n`);

    // Assign teams to flights based on scores
    console.log('🎯 Assigning teams to flights using snake draft...');
    
    const sortedTeams = await Team.find({ event_id: event._id })
      .sort({ gross_score: 1 });

    const numberOfFlights = 5;
    for (let i = 0; i < sortedTeams.length; i++) {
      const round = Math.floor(i / numberOfFlights);
      let flightNumber;
      
      if (round % 2 === 0) {
        flightNumber = (i % numberOfFlights) + 1;
      } else {
        flightNumber = numberOfFlights - (i % numberOfFlights);
      }
      
      await Team.findByIdAndUpdate(sortedTeams[i]._id, {
        flight_number: flightNumber,
        flight: `Flight ${flightNumber}`
      });
    }

    console.log(`✅ Teams assigned to 3 flights\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 SAMPLE EVENT SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('🏆 Event: Annual Summer Classic Championship');
    console.log('📍 Course: Pine Valley Golf Club, Springfield, IL');
    console.log(`📅 Date: ${eventDate.toLocaleDateString()}`);
    console.log('⏰ Start: 8:00 AM Shotgun');
    console.log('🎯 Format: Scramble with Live Scoring\n');
    
    console.log('📈 Statistics:');
    console.log('   • 25 Teams (100 players)');
    console.log('   • 5 Flights (5 teams each)');
    console.log('   • 8 teams finished 18 holes');
    console.log('   • 9 teams in progress (9-17 holes)');
    console.log('   • 8 teams just started (1-8 holes)\n');
    
    console.log('🎮 ALL Side Games Enabled:');
    console.log('   • Skins - Net ($20 entry)');
    console.log('   • Closest to Pin (holes 3, 7, 12, 16) - Mens, Womens, Seniors');
    console.log('   • Long Drive (holes 9, 18) - Mens, Womens');
    console.log('   • Straight Drive (hole 14)');
    console.log('   • Longest Putt (holes 5, 11, 17)');
    console.log('   • Three Putt Pot ($5 per 3-putt)');
    console.log('   • Mulligans ($5, limit 2, can use anywhere)\n');
    
    console.log('💰 Entry: $400 per team ($100 per player)');
    console.log('💰 Prize Pools: Teams $8000 | Skins $500 | CTP $200 | Charity $500\n');

    console.log('═══════════════════════════════════════════════════');
    console.log('📱 SAMPLE TEAM ACCESS CODES');
    console.log('═══════════════════════════════════════════════════\n');
    
    const teamsWithCodes = await Team.find({ event_id: event._id })
      .sort({ team_number: 1 });
    
    console.log('Team # | Name          | Access Code | Flight    | Score');
    console.log('-------|---------------|-------------|-----------|-------');
    teamsWithCodes.forEach(t => {
      console.log(
        `${String(t.team_number).padEnd(6)} | ` +
        `${t.team_name.padEnd(13)} | ` +
        `${t.access_code.padEnd(11)} | ` +
        `${t.flight.padEnd(9)} | ` +
        `${t.gross_score || 'In Progress'}`
      );
    });

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('🚀 Next Steps:');
    console.log('   1. Open http://localhost:5175');
    console.log('   2. Go to Events tab and select "Annual Summer Classic"');
    console.log('   3. Test all features:');
    console.log('      • View teams in Teams & Players tab');
    console.log('      • Check leaderboard at http://localhost:5175/leaderboard.html');
    console.log('      • Test mobile scoring at http://localhost:5175/mobile.html');
    console.log('      • Calculate prize distribution in Fees & Payouts tab');
    console.log('      • View audit trail in Live Scoring tab\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedData();
