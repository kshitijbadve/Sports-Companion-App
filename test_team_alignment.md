# Team Alignment Test

## Test Plan for Real Madrid vs Barcelona Match

### Visual Alignment Check

1. **Navigate to Matches screen**
2. **Click "Join Match" on Real Madrid vs Barcelona**
3. **Navigate to Live screen (should show Moments tab)**
4. **Verify team alignment in the Selected Match card:**

#### Expected Layout:
```
┌─────────────────────────────────────────┐
│ Selected Match                         │
│                                         │
│  [Madrid Logo]    [Score]    [Barca Logo] │
│     Madrid         1-1       Barcelona   │
│                                         │
│              [Game Info]                │
│               1H 23:45                  │
└─────────────────────────────────────────┘
```

### Alignment Requirements:

1. **Team Logos**: 
   - Both logos should be centered under their respective team names
   - Logos should be the same size (40x40)
   - Logos should be properly aligned vertically

2. **Team Names**:
   - "Madrid" and "Barcelona" should be centered under their logos
   - Text should be properly aligned even with different name lengths
   - Both names should be at the same vertical level

3. **Score Section**:
   - Score should be centered between the two teams
   - Game time should be centered below the score
   - Overall layout should be balanced

### Issues to Check:

- [ ] Are both team logos the same size?
- [ ] Are both team names centered under their logos?
- [ ] Is the layout balanced despite "Barcelona" being longer than "Madrid"?
- [ ] Is the score section properly centered?
- [ ] Are there any overlapping elements?

### Comparison with Cowboys vs Packers:

The layout should be consistent between both matches:
- Cowboys vs Packers: "Packers" vs "Cowboys"
- Real Madrid vs Barcelona: "Madrid" vs "Barcelona"

Both should have the same visual structure and alignment.
