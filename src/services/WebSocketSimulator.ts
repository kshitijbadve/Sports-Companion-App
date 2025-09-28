import { GameEvent } from '../types';

class WebSocketSimulator {
  private listeners: ((event: GameEvent) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private isConnected = false;

  // Random play descriptions and titles for more variety
  private playData = {
    packers: [
      { title: 'Amazing catch in traffic', description: 'Aaron Rodgers finds the endzone with a perfect spiral!' },
      { title: 'One-handed grab', description: 'Davante Adams makes an incredible one-handed catch!' },
      { title: 'Defensive turnover', description: 'Packers defense forces a crucial turnover!' },
      { title: 'Breakthrough run', description: 'Aaron Jones breaks through for a 15-yard gain!' },
      { title: 'Game-changing pick', description: 'Jaire Alexander with a game-changing interception!' },
      { title: 'Field goal success', description: 'Mason Crosby nails a 48-yard field goal!' },
      { title: '4th down conversion', description: 'Packers convert on 4th and 2!' },
      { title: 'Spectacular diving catch', description: 'Randall Cobb with a spectacular diving catch!' },
      { title: 'Defensive stop', description: 'Green Bay defense holds on 3rd down!' },
      { title: 'Power run', description: 'AJ Dillon powers through for the first down!' },
      { title: 'Perfect screen pass', description: 'Packers execute a perfect screen pass!' },
      { title: 'Defensive pressure', description: 'Defensive line gets pressure on the quarterback!' },
      { title: 'Fumble recovery', description: 'Packers recover the fumble!' },
      { title: 'Touchdown!', description: 'Touchdown! Packers take the lead!' },
      { title: 'Great defensive play', description: 'Great defensive play by the secondary!' }
    ],
    cowboys: [
      { title: 'Beautiful touchdown pass', description: 'Dak Prescott throws a beautiful touchdown pass!' },
      { title: 'Huge run', description: 'Ezekiel Elliott breaks free for a huge run!' },
      { title: 'Devastating sack', description: 'Micah Parsons with a devastating sack!' },
      { title: 'Acrobatic catch', description: 'CeeDee Lamb makes an acrobatic catch!' },
      { title: 'Big defensive stop', description: 'Cowboys defense comes up big on 3rd down!' },
      { title: 'Field goal split', description: 'Greg Zuerlein splits the uprights from 42 yards!' },
      { title: 'Crucial 4th down', description: 'Dallas converts the crucial 4th down!' },
      { title: 'Speed showcase', description: 'Tony Pollard shows off his speed!' },
      { title: 'Key interception', description: 'Cowboys secondary with a key interception!' },
      { title: 'Scrambling first down', description: 'Dak Prescott scrambles for the first down!' },
      { title: 'Three-and-out', description: 'Dallas defense forces a three-and-out!' },
      { title: 'Perfect trick play', description: 'Cowboys execute a perfect trick play!' },
      { title: 'Pass disruption', description: 'Defensive line disrupts the passing game!' },
      { title: 'Touchdown answer', description: 'Touchdown! Cowboys answer back!' },
      { title: 'Great defensive play', description: 'Great defensive play by the Cowboys!' }
    ]
  };

  // Sample game events for Cowboys vs Packers
  private sampleEvents: Omit<GameEvent, 'id' | 'timestamp'>[] = [
    // Packers events
    { type: 'goal', team: 'Green Bay Packers', player: 'Aaron Rodgers', minute: 15, description: 'Touchdown pass to Davante Adams!', importance: 'high' },
    { type: 'foul', team: 'Green Bay Packers', player: 'Aaron Jones', minute: 23, description: 'Fumble recovery by Packers defense', importance: 'medium' },
    { type: 'card', team: 'Green Bay Packers', player: 'Jaire Alexander', minute: 31, description: 'Pass interference penalty', importance: 'medium' },
    { type: 'substitution', team: 'Green Bay Packers', player: 'Jordan Love', minute: 45, description: 'Backup QB enters the game', importance: 'low' },
    { type: 'penalty', team: 'Green Bay Packers', player: 'Mason Crosby', minute: 67, description: 'Field goal attempt from 45 yards', importance: 'high' },
    { type: 'timeout', team: 'Green Bay Packers', player: 'Matt LaFleur', minute: 78, description: 'Packers call timeout', importance: 'low' },
    
    // Cowboys events
    { type: 'goal', team: 'Dallas Cowboys', player: 'Dak Prescott', minute: 12, description: 'Touchdown run by Ezekiel Elliott!', importance: 'high' },
    { type: 'foul', team: 'Dallas Cowboys', player: 'Micah Parsons', minute: 28, description: 'Sack on the quarterback', importance: 'medium' },
    { type: 'card', team: 'Dallas Cowboys', player: 'Trevon Diggs', minute: 35, description: 'Defensive holding penalty', importance: 'medium' },
    { type: 'substitution', team: 'Dallas Cowboys', player: 'Cooper Rush', minute: 52, description: 'Backup QB takes over', importance: 'low' },
    { type: 'penalty', team: 'Dallas Cowboys', player: 'Greg Zuerlein', minute: 71, description: 'Field goal from 38 yards', importance: 'high' },
    { type: 'timeout', team: 'Dallas Cowboys', player: 'Mike McCarthy', minute: 85, description: 'Cowboys call timeout', importance: 'low' },
    
    // General events
    { type: 'goal', team: 'Green Bay Packers', player: 'Randall Cobb', minute: 8, description: 'Amazing catch in the endzone!', importance: 'high' },
    { type: 'foul', team: 'Dallas Cowboys', player: 'CeeDee Lamb', minute: 19, description: 'Big reception for 25 yards', importance: 'medium' },
    { type: 'card', team: 'Green Bay Packers', player: 'Kenny Clark', minute: 42, description: 'Defensive stop on 3rd down', importance: 'medium' },
    { type: 'substitution', team: 'Dallas Cowboys', player: 'Tony Pollard', minute: 56, description: 'Running back rotation', importance: 'low' },
    { type: 'penalty', team: 'Green Bay Packers', player: 'AJ Dillon', minute: 63, description: 'Power run for first down', importance: 'high' },
    { type: 'timeout', team: 'Dallas Cowboys', player: 'Dan Quinn', minute: 91, description: 'Defensive timeout called', importance: 'low' },
  ];

  connect() {
    if (this.isConnected) return;
    
    this.isConnected = true;
    console.log('WebSocket Simulator: Connected');
    
    // Simulate events every 3-8 seconds
    this.intervalId = setInterval(() => {
      this.generateRandomEvent();
    }, Math.random() * 5000 + 3000);
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isConnected = false;
    console.log('WebSocket Simulator: Disconnected');
  }

  addEventListener(listener: (event: GameEvent) => void) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (event: GameEvent) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private generateRandomEvent() {
    const randomEvent = this.sampleEvents[Math.floor(Math.random() * this.sampleEvents.length)];
    
    // Generate random play title and description based on team
    let randomTitle = 'Amazing play';
    let randomDescription = randomEvent.description;
    
    if (randomEvent.team.includes('Packers')) {
      const packersData = this.playData.packers;
      const randomPlay = packersData[Math.floor(Math.random() * packersData.length)];
      randomTitle = randomPlay.title;
      randomDescription = randomPlay.description;
    } else if (randomEvent.team.includes('Cowboys')) {
      const cowboysData = this.playData.cowboys;
      const randomPlay = cowboysData[Math.floor(Math.random() * cowboysData.length)];
      randomTitle = randomPlay.title;
      randomDescription = randomPlay.description;
    }
    
    const event: GameEvent = {
      ...randomEvent,
      title: randomTitle,
      description: randomDescription,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    console.log('WebSocket Simulator: New event', event);
    this.listeners.forEach(listener => listener(event));
  }

  // Simulate a specific event (for testing)
  simulateEvent(eventType: GameEvent['type']) {
    const event = this.sampleEvents.find(e => e.type === eventType);
    if (event) {
      const gameEvent: GameEvent = {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      this.listeners.forEach(listener => listener(gameEvent));
    }
  }
}

export default new WebSocketSimulator();
