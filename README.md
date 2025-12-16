<div align="center">
  
# 🎓 LearnTogether

**A multiplayer exam preparation app for German IT certifications**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-white?style=for-the-badge&logo=socket.io)](https://socket.io/)

[Live Demo](https://learn.engels.wtf) · [Report Bug](https://github.com/engelswtf/learn-together/issues) · [Request Feature](https://github.com/engelswtf/learn-together/issues)

---

<img src="https://img.shields.io/badge/Study_Smarter-Not_Harder-6366f1?style=for-the-badge" alt="Study Smarter, Not Harder" />

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🃏 Flashcards
Study with flip cards at your own pace. Track which cards you know and which need more practice.

### ❓ Quiz Mode
Test your knowledge with multiple-choice questions. Get instant feedback and track your scores.

</td>
<td width="50%">

### ⚔️ Duel Mode
Challenge friends in turn-based battles! Both players answer the same question - fastest correct answer wins.

### 🏁 Race Mode
First to answer correctly wins the round! Wrong answers lock you out while others keep trying.

</td>
</tr>
</table>

### 📊 Smart Progress Tracking

- **Server-synced progress** - Same progress on all your devices
- **Incremental saving** - Progress saves after each card/question
- **Weak cards review** - Automatically tracks cards you struggle with
- **Streak tracking** - Build daily study habits
- **Multiplayer stats** - Track your Duel and Race wins

---

## 🎮 Game Modes

| Mode | Players | Description |
|------|---------|-------------|
| 🃏 **Flashcards** | Solo | Flip cards, mark as "knew it" or "still learning" |
| ❓ **Quiz** | Solo | Multiple choice with instant feedback |
| ⚔️ **Duel** | 2-4 | Turn-based, everyone answers, fastest wins points |
| 🏁 **Race** | 2-4 | First correct answer wins, wrong = locked out |

---

## 📚 Topics Included

| Topic | Flashcards | Quiz Questions |
|-------|------------|----------------|
| 💾 Speichersysteme & Backup | 35 | 35 |
| ☁️ Cloud Computing | 32 | 24 |
| 🐳 Virtualisierung & Container | 40 | 22 |

> Perfect for German IT certification exams (Fachinformatiker, IT-Systemelektroniker, etc.)

---

## 🚀 Quick Start

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

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 14
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS
</td>
<td align="center" width="96">
<img src="https://socket.io/images/logo.svg" width="48" height="48" alt="Socket.io" />
<br>Socket.io
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
<br>Node.js
</td>
</tr>
</table>

---

## 📁 Project Structure

```
learn-together/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── mode/[mode]/        # Game mode selection
│   │   ├── play/               # Multiplayer lobbies
│   │   └── topic/[id]/         # Topic game pages
│   ├── components/             # React components
│   │   ├── multiplayer/        # Duel & Race components
│   │   ├── Flashcard.tsx       # Flip card component
│   │   ├── FlashcardGame.tsx   # Flashcard game logic
│   │   └── QuizGame.tsx        # Quiz game logic
│   ├── contexts/               # React contexts
│   │   └── PlayerContext.tsx   # Player state & progress
│   ├── data/                   # Topic content
│   │   └── content/            # Flashcards & questions
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utilities
├── server.ts                   # Socket.io server
├── data/progress/              # Player progress (JSON)
└── docs/                       # Documentation
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Adding Content](docs/ADDING_CONTENT.md) | How to add new topics, flashcards, and questions |
| [Deployment](docs/DEPLOYMENT.md) | Production deployment guide |

---

## 🔌 API Reference

### Progress Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/progress/login` | Login with player name |
| `POST` | `/api/progress/save` | Save player progress |
| `GET` | `/api/progress/load` | Load player progress |

### Socket Events

<details>
<summary><b>Room Management</b></summary>

| Event | Direction | Description |
|-------|-----------|-------------|
| `create-room` | Client → Server | Create a new game room |
| `join-room` | Client → Server | Join existing room |
| `room-created` | Server → Client | Room created successfully |
| `room-joined` | Server → Client | Joined room successfully |
| `player-joined` | Server → Room | New player joined |
| `player-left` | Server → Room | Player left |

</details>

<details>
<summary><b>Game Events</b></summary>

| Event | Direction | Description |
|-------|-----------|-------------|
| `start-game` | Client → Server | Host starts the game |
| `game-started` | Server → Room | Game has started (Duel) |
| `race-game-started` | Server → Room | Game has started (Race) |
| `submit-answer` | Client → Server | Submit answer (Duel) |
| `race-answer` | Client → Server | Submit answer (Race) |
| `round-results` | Server → Room | Round results (Duel) |
| `race-round-winner` | Server → Room | Round winner (Race) |
| `game-over` | Server → Room | Game finished |
| `request-rematch` | Client → Server | Request a rematch |

</details>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for learners everywhere**

<a href="https://learn.engels.wtf">
<img src="https://img.shields.io/badge/Try_it_now-learn.engels.wtf-6366f1?style=for-the-badge" alt="Try it now" />
</a>

</div>
