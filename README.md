# LearnTogether

> A multiplayer exam preparation app for German IT certifications (FISI/FIAE)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io)

## Features

### Game Modes

- **Flashcards** - Study at your own pace with flip cards. Mark cards as "Known" or "Unknown" to track your progress.
- **Quiz** - Test your knowledge with multiple-choice questions. Get instant feedback with explanations.
- **Duel** - Challenge friends in turn-based competition. Everyone answers each question, and points are awarded based on correctness and speed.
- **Race** - First to answer correctly wins! Real-time competitive mode where speed matters.

### Progress Tracking

- Server-synced progress per player
- Track flashcard sessions and quiz attempts
- Best scores and percentages per topic
- Daily streak tracking
- Multiplayer game statistics (wins/losses)

### Weak Cards Review

- Automatically identifies cards you marked as "Unknown"
- Review weak cards across all topics
- Focused study sessions for difficult content

### Topics

Currently includes content for German IT certification exams:
- **Speichersysteme & Backup** - RAID levels, NAS/SAN, backup strategies
- **Cloud Computing** - IaaS, PaaS, SaaS, deployment models
- **Virtualisierung & Container** - Hypervisors, Docker, VMs vs Containers

## Screenshots

<!-- Add screenshots here -->
*Coming soon*

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS 3.4
- **Real-time**: Socket.io 4.8
- **Process Manager**: PM2
- **Server**: Custom Node.js server with Next.js integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/engelswtf/learn-together.git
cd learn-together

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

Or use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs learn-together

# Monitor
pm2 monit
```

## Project Structure

```
learn-together/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page (welcome screen)
│   │   ├── layout.tsx          # Root layout
│   │   ├── mode/[mode]/        # Game mode selection
│   │   ├── topic/[id]/         # Topic-specific pages
│   │   │   ├── flashcards/     # Flashcard game
│   │   │   ├── quiz/           # Quiz game
│   │   │   ├── duel/           # Duel multiplayer
│   │   │   ├── race/           # Race multiplayer
│   │   │   └── review/         # Weak cards review
│   │   └── play/               # Multiplayer lobby pages
│   │       ├── duel/           # Duel lobby
│   │       └── race/           # Race lobby
│   ├── components/             # React components
│   │   ├── multiplayer/        # Multiplayer-specific components
│   │   │   ├── Lobby.tsx       # Room creation/joining
│   │   │   ├── WaitingRoom.tsx # Pre-game waiting room
│   │   │   ├── DuelGame.tsx    # Duel game component
│   │   │   └── RaceGame.tsx    # Race game component
│   │   ├── Flashcard.tsx       # Single flashcard component
│   │   ├── FlashcardGame.tsx   # Flashcard game logic
│   │   ├── QuizGame.tsx        # Quiz game logic
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   └── PlayerContext.tsx   # Player state & progress
│   ├── data/                   # Static data
│   │   ├── topics.ts           # Topic definitions
│   │   ├── gameModes.ts        # Game mode definitions
│   │   └── content/            # Topic content (flashcards, questions)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useProgress.ts      # Progress tracking hook
│   │   └── useWeakCards.ts     # Weak cards identification
│   ├── lib/                    # Utilities
│   │   └── socket.ts           # Socket.io client
│   └── types/                  # TypeScript types
│       └── index.ts
├── data/
│   └── progress/               # Player progress JSON files
├── server.ts                   # Custom server with Socket.io
├── ecosystem.config.js         # PM2 configuration
└── package.json
```

## Game Modes

### Flashcards

Solo study mode where you flip through cards and mark them as "Known" or "Unknown". Progress is tracked per topic with:
- Total cards studied
- Known/Unknown counts
- Sessions completed
- Best known percentage

### Quiz

Multiple-choice quiz mode with:
- Randomized questions
- Instant feedback with explanations
- Score tracking
- Best score and average percentage per topic

### Duel (Multiplayer)

Turn-based competitive mode for 2-4 players:
1. Create or join a room with a 4-character code
2. Host selects a topic
3. All players answer each question
4. Points awarded: 100 base + speed bonus (up to 50)
5. Results shown after each round
6. Final scores displayed at game end

### Race (Multiplayer)

Real-time competitive mode for 2-4 players:
1. Create or join a room
2. Host selects a topic
3. First correct answer wins the round
4. Wrong answers lock you out for that round
5. Points: 100 base + speed bonus
6. Most points at end wins

## Progress System

Progress is stored server-side in JSON files (`data/progress/{player-name}.json`).

### Data Structure

```typescript
interface ProgressData {
  playerName: string;
  topics: {
    [topicId: string]: {
      flashcards: {
        totalStudied: number;
        totalKnown: number;
        totalUnknown: number;
        lastStudied: string | null;
        sessionsCompleted: number;
        bestKnownPercentage: number;
      };
      quiz: {
        totalAttempts: number;
        totalCorrect: number;
        totalIncorrect: number;
        lastAttempted: string | null;
        bestScore: number;
        bestPercentage: number;
        averagePercentage: number;
      };
    };
  };
  overall: {
    totalFlashcardsStudied: number;
    totalQuizAttempts: number;
    totalStudyTime: number;
    lastActive: string | null;
    streakDays: number;
    lastStreakDate: string | null;
    duelGamesPlayed: number;
    duelGamesWon: number;
    raceGamesPlayed: number;
    raceGamesWon: number;
  };
}
```

### Streak System

- Consecutive daily activity increases streak
- Missing a day resets streak to 1
- Tracked via `lastStreakDate`

## Adding Content

See [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md) for detailed instructions.

### Quick Start

1. Create a new content file in `src/data/content/`:

```typescript
// src/data/content/my-topic.ts
import { TopicContent } from '@/types';

export const myTopicContent: TopicContent = {
  topicId: 'my-topic',
  flashcards: [
    { id: '1', front: 'Question?', back: 'Answer' },
    // ...
  ],
  quizQuestions: [
    {
      id: '1',
      question: 'What is...?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'A is correct because...'
    },
    // ...
  ],
};
```

2. Register in `src/data/content/index.ts`
3. Add topic to `src/data/topics.ts`

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

### Quick Setup

1. Build the application:
```bash
npm run build
```

2. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

3. Configure reverse proxy (Caddy example):
```
learn.example.com {
    reverse_proxy localhost:3000
}
```

## API Endpoints

### Progress API

#### POST `/api/progress/login`

Login or create a new player.

**Request:**
```json
{
  "playerName": "string (min 2 chars)"
}
```

**Response:**
```json
{
  "progress": { /* ProgressData */ },
  "isReturning": true | false
}
```

#### POST `/api/progress/save`

Save player progress.

**Request:**
```json
{
  "playerName": "string",
  "progress": { /* ProgressData */ }
}
```

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/progress/load?playerName={name}`

Load player progress.

**Response:**
```json
{
  "progress": { /* ProgressData */ },
  "isReturning": true | false
}
```

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `create-room` | `{ playerName, gameMode }` | Create a new game room |
| `join-room` | `{ code, playerName }` | Join existing room |
| `select-topic` | `{ code, topicId }` | Host selects topic |
| `start-game` | `{ code, questions }` | Start the game |
| `submit-answer` | `{ code, questionIndex, selectedIndex, correctIndex, timeMs, isCorrect, points }` | Submit answer (Duel) |
| `race-answer` | `{ code, questionIndex, selectedIndex, correctIndex, timeMs }` | Submit answer (Race) |
| `race-next-question` | `{ code }` | Advance to next question (Race) |
| `request-rematch` | `{ code }` | Request a rematch |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `room-created` | `{ room, playerId }` | Room successfully created |
| `room-joined` | `{ room, playerId }` | Successfully joined room |
| `player-joined` | `{ room }` | Another player joined |
| `player-left` | `{ playerName, room }` | Player left the room |
| `topic-selected` | `{ topicId }` | Topic was selected |
| `game-started` | `{ room, questions }` | Duel game started |
| `race-game-started` | `{ room, questions }` | Race game started |
| `answer-submitted` | `{ playerId }` | Player submitted answer |
| `round-results` | `{ result, players }` | Duel round results |
| `race-round-winner` | `{ winnerId, winnerName, ... }` | Race round winner |
| `race-wrong-answer` | `{ playerId, playerName, ... }` | Wrong answer in race |
| `race-round-no-winner` | `{ questionIndex, correctIndex }` | No winner this round |
| `game-over` | `{ players }` | Duel game ended |
| `race-game-over` | `{ players }` | Race game ended |
| `host-changed` | `{ newHostId }` | Host changed (original left) |
| `rematch-started` | `{ room }` | Rematch initiated |
| `error` | `{ message }` | Error occurred |

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
