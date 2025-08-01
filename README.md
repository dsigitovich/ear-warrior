# 🎵 Ear Warrior - Musical Training Game

An interactive web-based musical ear training game that helps users develop their pitch recognition and melodic memory skills through real-time audio feedback and gamified learning experiences.

## 🎯 Features

### Current Implementation
- **🎵 Progressive Melody Generation**: Creates melodies with 1-8 notes based on difficulty level
- **🎤 Real-time Pitch Detection**: Uses microphone to detect and analyze user's singing/humming
- **🎮 Game Mechanics**: 4 difficulty levels with scoring system and streak multipliers
- **🌊 Visual Feedback**: Real-time waveform display and audio visualization
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Retro Gaming Aesthetic**: Modern UX with pixel-art inspired design

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Audio Processing**: Tone.js for synthesis, Pitchy for pitch detection
- **State Management**: Zustand
- **Styling**: CSS with modern features
- **Testing**: Jest + React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with microphone support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ear-warrior
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

1. **Select Difficulty**: Choose from Elementary (1 note) to Hard (8 notes)
2. **Start Game**: Click "Start Game" to begin
3. **Listen**: Pay attention to the melody played
4. **Reproduce**: Sing or hum the melody back into your microphone
5. **Score**: Earn points for correct reproduction and build streaks for bonuses

### Difficulty Levels
- **🎵 Elementary**: 1 note - Perfect for beginners
- **🎶 Easy**: 3 notes - Basic melodies  
- **🎸 Medium**: 5 notes - Complex patterns
- **🎹 Hard**: 8 notes - Advanced training

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Deployment
npm run deploy       # Deploy to GitHub Pages
```

### Project Structure

```
src/
├── components/           # React components
│   ├── DifficultySelector.tsx
│   ├── Game.tsx
│   ├── ScorePanel.tsx
│   ├── Waveform.tsx
│   └── __tests__/       # Component tests
├── store/               # Zustand state management
│   └── gameStore.ts
├── utils/               # Utility functions
│   ├── AudioManager.ts  # Tone.js integration
│   └── PitchDetector.ts # Pitchy integration
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎵 Audio Features

### Melody Generation
- Uses equal temperament tuning (A4 = 440Hz)
- Note range: E3 to C6 (3+ octaves)
- Supports all 12 chromatic notes
- Progressive difficulty with configurable note counts

### Pitch Detection
- Real-time microphone input processing
- Frequency-to-note conversion with tolerance
- Volume-based filtering to reduce noise
- Visual feedback with waveform display

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Requires microphone permissions

## 🧪 Testing

The project includes comprehensive tests for core functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- App.test.tsx
```

### Test Coverage
- Component rendering
- User interactions
- Audio system mocking
- State management

## 📱 Responsive Design

- **Desktop**: Full-featured experience with large controls
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined layout with essential features
- **Accessibility**: Keyboard navigation and screen reader support

## 🔮 Future Enhancements

See [PRD.md](PRD.md) for detailed roadmap including:

- **Advanced Training Modes**: Interval recognition, chord progressions
- **Social Features**: Leaderboards, achievements, multiplayer
- **Educational Content**: Music theory integration, tutorials
- **Personalization**: Custom difficulty, practice history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain responsive design principles
- Keep accessibility in mind

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tone.js** - Web Audio framework for sound synthesis
- **Pitchy** - Pitch detection library
- **React** - UI framework
- **Vite** - Build tool
- **Zustand** - State management

---

**🎵 Train • 🎶 Learn • 🎸 Master**

Built with ❤️ for music education and ear training.
