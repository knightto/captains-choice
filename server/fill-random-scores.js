import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, Team, Player, Score } from './mongodb.js';

dotenv.config();

async function fillRandomScores() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all teams
    const teams = await Team.find({});
    console.log(`Found ${teams.length} teams`);

    if (teams.length === 0) {
      console.log('No teams found. Please run seed-sample-data.js first.');
      process.exit(1);
    }

    // Clear existing scores
    await Score.deleteMany({});
    console.log('Cleared existing scores');

    // Generate realistic golf scores for each team
    for (const team of teams) {
      console.log(`\nGenerating scores for: ${team.team_name}`);
      
      // Get players for this team
      const players = await Player.find({ team_id: team._id });
      
      if (players.length === 0) {
        console.log(`  ⚠️  No players found for ${team.team_name}, skipping...`);
        continue;
      }

      let totalScore = 0;

      // Generate score for each hole (1-18)
      for (let hole = 1; hole <= 18; hole++) {
        // Captain's choice typically scores between 3-6 strokes per hole
        // Par is typically 4, so let's generate scores around that
        const holeScore = Math.floor(Math.random() * 4) + 3; // 3-6
        
        // Randomly select which player's drive was used
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        const score = new Score({
          team_id: team._id,
          hole_number: hole,
          strokes: holeScore,
          drive_used_player_id: randomPlayer._id
        });

        await score.save();
        totalScore += holeScore;
      }

      // Update team's gross score
      await Team.findByIdAndUpdate(team._id, { 
        gross_score: totalScore,
        net_score: totalScore // For now, net = gross (no handicap adjustment)
      });

      console.log(`  ✅ Completed 18 holes, Total: ${totalScore}`);
    }

    console.log('\n✅ All teams now have complete scores!');
    console.log('\nScore Summary:');
    
    // Show final leaderboard
    const teamsWithScores = await Team.find({}).sort({ gross_score: 1 });
    teamsWithScores.forEach((team, index) => {
      console.log(`${index + 1}. ${team.team_name} - ${team.gross_score || 0} (Flight ${team.flight || 'N/A'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fillRandomScores();
