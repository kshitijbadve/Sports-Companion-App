# Match Switching Test

## Test Plan

### 1. Cowboys vs Packers Match
1. Navigate to Matches screen
2. Click "Join Match" on the Cowboys vs Packers match
3. Navigate to Live screen (should automatically show Moments tab)
4. Verify all tabs show Cowboys vs Packers content:
   - **Moments**: Shows Packers vs Cowboys score, events, and team logos
   - **Watch Party**: Shows Jordan Love vs Dak Prescott poll
   - **Predictions**: Shows NFL-specific predictions and polls
   - **Highlights**: Shows NFL highlights (Touchdowns, etc.)

### 2. Real Madrid vs Barcelona Match
1. Navigate to Matches screen
2. Click "Join Match" on the Real Madrid vs Barcelona match
3. Navigate to Live screen (should automatically show Moments tab)
4. Verify all tabs show Real Madrid vs Barcelona content:
   - **Moments**: Shows Madrid vs Barcelona score, events, and team logos
   - **Watch Party**: Shows Mbappe vs Lewandowski poll
   - **Predictions**: Shows soccer-specific predictions and polls
   - **Highlights**: Shows soccer highlights (Goals, saves, etc.)

### 3. Match Switching
1. Start with Cowboys vs Packers match
2. Switch to Real Madrid vs Barcelona match (should default to Moments tab)
3. Verify content changes appropriately
4. Switch back to Cowboys vs Packers (should default to Moments tab)
5. Verify original content is restored

## Expected Results

- Each match should have its own tailored content
- Switching between matches should update all screens
- **When joining a match, the Live screen should default to the Moments tab**
- Team logos should be correct for each match
- Poll questions should be sport-appropriate
- Highlights should match the sport type
