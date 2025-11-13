# Flight Management Guide

## Overview
The flight management system allows you to organize teams into competitive flights based on their scores. This creates balanced competition by grouping teams of similar skill levels together.

## How It Works

### 1. **Configure Number of Flights**
In the admin panel's **Basic Info** tab:
- Set the **Number of Flights** field (1-10)
- Teams will be automatically divided evenly across all flights

### 2. **Assign Teams to Flights**
In the **Teams & Players** tab:
- Click the **"Assign Teams to Flights"** button
- Teams are automatically sorted by score (best to worst)
- Distribution uses a **snake draft method** for balance:
  - Best team → Flight 1
  - 2nd best → Flight 2
  - 3rd best → Flight 3
  - 4th best → Flight 3 (reverse)
  - 5th best → Flight 2 (reverse)
  - 6th best → Flight 1 (reverse)
  - Pattern continues...

### 3. **View Flight Distribution**
The flight info panel shows:
- Total configured flights
- Number of teams in each flight
- Current distribution overview

### 4. **Leaderboard Display**
The live leaderboard automatically:
- Groups teams by flight
- Shows separate sections for each flight
- Awards positions within each flight (1st, 2nd, 3rd)
- Displays flight headers when multiple flights exist

## Snake Draft Method Benefits
✅ **Balanced Competition**: Each flight has a mix of skill levels
✅ **Fair Distribution**: Best teams spread across all flights
✅ **Even Teams**: All flights have similar total team counts
✅ **Automatic**: No manual sorting required

## Example Distribution
**36 Teams, 3 Flights:**

**Flight 1** (12 teams): 1st, 6th, 7th, 12th, 13th, 18th, 19th, 24th, 25th, 30th, 31st, 36th
**Flight 2** (12 teams): 2nd, 5th, 8th, 11th, 14th, 17th, 20th, 23rd, 26th, 29th, 32nd, 35th
**Flight 3** (12 teams): 3rd, 4th, 9th, 10th, 15th, 16th, 21st, 22nd, 27th, 28th, 33rd, 34th

## Database Structure
- **events.number_of_flights**: Number of configured flights (default: 1)
- **teams.flight_number**: Numeric flight assignment (1, 2, 3, etc.)
- **teams.flight**: Display name ("Flight 1", "Flight 2", etc.)

## API Endpoint
```
POST /api/events/:eventId/assign-flights
```
Automatically assigns all teams to flights based on current scores.

## Tips
- **Reassign Anytime**: You can reassign flights as scores update
- **Single Flight**: Default is 1 flight (all teams compete together)
- **Multiple Formats**: Works with all tournament formats
- **Mobile Scoring**: Teams in any flight can enter scores via mobile
- **Real-time Updates**: Leaderboard reflects current flight assignments

## Typical Use Cases
1. **Large Events (72+ players)**: Use 3-4 flights for manageable competition
2. **Skill-Based Competition**: Separate competitive vs. casual players
3. **Multiple Prize Levels**: Award top teams in each flight
4. **Shotgun Starts**: Organize hole assignments by flight
