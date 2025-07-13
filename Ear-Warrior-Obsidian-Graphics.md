# Ear Warrior - Obsidian Graphics Documentation

## Project Overview

**Ear Warrior** is an interactive web-based musical ear training game built with React + TypeScript using Feature Slice Design architecture. The application helps users develop pitch recognition and melodic memory skills through real-time audio feedback.

## 1. Architecture Overview

### Feature Slice Design Structure

```mermaid
graph TB
    subgraph "App Layer"
        A[App.tsx] --> B[UnifiedGamePage]
    end
    
    subgraph "Pages Layer"
        B --> C[UnifiedGamePage.tsx]
    end
    
    subgraph "Processes Layer"
        C --> D[game-session]
        D --> D1[game-session.ts]
    end
    
    subgraph "Widgets Layer"
        C --> E[game-panel]
        C --> F[platform-game]
        C --> G[score-panel]
        C --> H[waveform-display]
        E --> E1[GamePanel.tsx]
        F --> F1[PlatformGame.tsx]
        G --> G1[ScorePanel.tsx]
        H --> H1[WaveformDisplay.tsx]
    end
    
    subgraph "Features Layer"
        D --> I[game-logic]
        D --> J[melody-generation]
        D --> K[pitch-detection]
        I --> I1[game-logic.ts]
        J --> J1[melody-generator.ts]
        K --> K1[pitch-detector.ts]
    end
    
    subgraph "Entities Layer"
        I --> L[game]
        J --> M[melody]
        K --> N[note]
        L --> L1[game.ts]
        M --> M1[melody.ts]
        N --> N1[note.ts]
    end
    
    subgraph "Shared Layer"
        C --> O[shared/ui]
        C --> P[shared/store]
        C --> Q[shared/lib]
        C --> R[shared/types]
        O --> O1[Button, RoosterIcon]
        P --> P1[difficulty-store.ts]
        Q --> Q1[note-utils.ts, pitch-detection.ts]
        R --> R1[index.ts]
    end
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#fce4ec
    style J fill:#fce4ec
    style K fill:#fce4ec
    style L fill:#f1f8e9
    style M fill:#f1f8e9
    style N fill:#f1f8e9
    style O fill:#e0f2f1
    style P fill:#e0f2f1
    style Q fill:#e0f2f1
    style R fill:#e0f2f1
```

## 2. Application Flow

### Main Game Flow

```mermaid
flowchart TD
    A[App Start] --> B[UnifiedGamePage Load]
    B --> C[Initialize Game Session]
    C --> D[Select Difficulty]
    D --> E[Press Play Melody]
    E --> F[Generate Melody]
    F --> G[Play Audio]
    G --> H[Start Listening]
    H --> I[Detect Pitch]
    I --> J{Note Matches?}
    J -->|Yes| K[Add to User Input]
    J -->|No| L[Continue Listening]
    K --> M{Melody Complete?}
    M -->|Yes| N[Calculate Score]
    M -->|No| L
    L --> O{Attempts Left?}
    O -->|Yes| I
    O -->|No| P[Game Over]
    N --> Q[Show Feedback]
    Q --> R[Update Score]
    R --> S[Next Melody]
    P --> T[Reset Game]
    S --> E
    T --> D
    
    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style P fill:#ffcdd2
    style Q fill:#dcedc8
```

## 3. Component Hierarchy

### UI Components Structure

```mermaid
graph TB
    subgraph "Main App"
        A[App.tsx]
    end
    
    A --> B[UnifiedGamePage]
    
    subgraph "Game Page Components"
        B --> C[Header Section]
        B --> D[Main Game Area]
        B --> E[Control Buttons]
        B --> F[Game Status]
    end
    
    subgraph "Header Components"
        C --> G[RoosterIcon]
        C --> H[Title & Subtitle]
        C --> I[ScorePanel]
    end
    
    subgraph "Main Area Components"
        D --> J[PlatformGame]
        D --> K[Difficulty Selector]
        D --> L[Instructions]
        D --> M[Notes Display]
        D --> N[Feedback Area]
    end
    
    subgraph "Control Components"
        E --> O[Play Button]
        E --> P[Stop Button]
        E --> Q[Replay Button]
    end
    
    subgraph "Widget Components"
        J --> R[Waveform Display]
        J --> S[Platform Animation]
        I --> T[Score Display]
        I --> U[Streak Display]
        I --> V[Attempts Display]
    end
    
    subgraph "Shared UI"
        O --> W[Button Component]
        P --> W
        Q --> W
        G --> X[SVG Icon]
    end
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style J fill:#fff3e0
    style I fill:#fff3e0
    style W fill:#e0f2f1
    style X fill:#e0f2f1
```

## 4. Data Flow

### State Management & Data Flow

```mermaid
flowchart LR
    subgraph "State Stores"
        A[useDifficultyStore<br/>Zustand]
        B[useGameSession<br/>Custom Hook]
    end
    
    subgraph "Game Session State"
        C[Game State]
        D[Current Melody]
        E[User Input]
        F[Detected Note]
        G[Match Indices]
        H[Stats & Score]
        I[Attempts Left]
    end
    
    subgraph "External APIs"
        J[Tone.js<br/>Audio Synthesis]
        K[Pitchy<br/>Pitch Detection]
        L[Browser<br/>Microphone API]
    end
    
    subgraph "Business Logic"
        M[Melody Generator]
        N[Pitch Detector]
        O[Game Logic]
        P[Score Calculator]
    end
    
    subgraph "UI Components"
        Q[UnifiedGamePage]
        R[ScorePanel]
        S[PlatformGame]
        T[Controls]
    end
    
    A --> Q
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    
    C --> Q
    D --> Q
    E --> Q
    F --> Q
    G --> Q
    H --> R
    I --> R
    
    Q --> T
    Q --> S
    
    M --> J
    N --> K
    N --> L
    O --> M
    O --> N
    O --> P
    
    J --> D
    K --> F
    L --> N
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style J fill:#fff3e0
    style K fill:#fff3e0
    style L fill:#fff3e0
    style M fill:#fce4ec
    style N fill:#fce4ec
    style O fill:#fce4ec
    style P fill:#fce4ec
```

## 5. Technical Stack

### Technology Architecture

```mermaid
graph TB
    subgraph "Frontend Framework"
        A[React 19]
        B[TypeScript]
        C[Vite]
    end
    
    subgraph "Audio Processing"
        D[Tone.js<br/>Audio Synthesis]
        E[Pitchy<br/>Pitch Detection]
        F[Web Audio API]
    end
    
    subgraph "State Management"
        G[Zustand<br/>Global State]
        H[React Hooks<br/>Local State]
    end
    
    subgraph "Styling"
        I[CSS Modules]
        J[SCSS]
        K[Responsive Design]
    end
    
    subgraph "Build & Deploy"
        L[Vite Build]
        M[GitHub Pages]
        N[ESLint]
        O[Jest Testing]
    end
    
    subgraph "Browser APIs"
        P[MediaDevices API<br/>Microphone]
        Q[Fullscreen API]
        R[Audio Context]
    end
    
    A --> D
    A --> E
    A --> G
    A --> H
    B --> A
    C --> A
    D --> F
    E --> F
    F --> P
    F --> R
    I --> J
    L --> M
    N --> C
    O --> C
    
    style A fill:#61dafb
    style B fill:#007acc
    style C fill:#646cff
    style D fill:#ff6b6b
    style E fill:#4ecdc4
    style G fill:#ff9f43
    style I fill:#e056fd
    style J fill:#e056fd
```

## 6. Game Mechanics

### Scoring System

```mermaid
flowchart TD
    A[Note Detection] --> B{Correct Note?}
    B -->|Yes| C[Add Base Points]
    B -->|No| D[No Points]
    C --> E[Check Streak]
    E --> F{Consecutive Correct?}
    F -->|Yes| G[Apply Streak Multiplier]
    F -->|No| H[Reset Streak]
    G --> I[Update Total Score]
    H --> I
    D --> J[Reduce Attempts]
    J --> K{Attempts Left?}
    K -->|Yes| L[Continue Game]
    K -->|No| M[Game Over]
    I --> N{Melody Complete?}
    N -->|Yes| O[Melody Bonus]
    N -->|No| L
    O --> P[Next Melody]
    
    style C fill:#c8e6c9
    style G fill:#dcedc8
    style I fill:#a5d6a7
    style D fill:#ffcdd2
    style J fill:#ffcdd2
    style M fill:#f8bbd9
```

### Difficulty Progression

```mermaid
graph LR
    A[Elementary<br/>1-2 Notes<br/>Basic Intervals] --> B[Easy<br/>3-4 Notes<br/>Simple Melodies]
    B --> C[Medium<br/>5-6 Notes<br/>Complex Intervals]
    C --> D[Hard<br/>7-8 Notes<br/>Advanced Patterns]
    
    subgraph "Note Range"
        E[E3 to C6<br/>3+ Octaves]
    end
    
    subgraph "Intervals"
        F[12 Musical Intervals<br/>Unison to Octave]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    A --> F
    B --> F
    C --> F
    D --> F
    
    style A fill:#c8e6c9
    style B fill:#fff9c4
    style C fill:#ffcc80
    style D fill:#ffab91
```

## 7. User Journey

### Complete User Experience Flow

```mermaid
journey
    title Ear Warrior User Journey
    section Initial Setup
      Launch App          : 5: User
      See Welcome Screen  : 4: User
      Select Difficulty   : 3: User
    section Game Play
      Press Play Melody   : 4: User
      Listen to Melody    : 5: User
      Sing Back Melody    : 3: User
      See Real-time Feedback: 4: User
      Complete Melody     : 5: User
      View Score Update   : 4: User
    section Progression
      Try Harder Difficulty: 4: User
      Build Streak        : 5: User
      Achieve High Score  : 5: User
    section Advanced Usage
      Use Fullscreen Mode : 4: User
      Practice Regularly  : 5: User
      Share Progress      : 3: User
```

## 8. Development Roadmap

### Feature Development Timeline

```mermaid
gantt
    title Ear Warrior Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Core
    Audio Detection Enhancement    :done, core1, 2024-01-01, 2024-03-31
    User Accounts                 :active, core2, 2024-02-01, 2024-04-30
    Mobile App                    :core3, 2024-03-01, 2024-05-31
    
    section Phase 2: Advanced
    Interval Training             :adv1, 2024-04-01, 2024-06-30
    Chord Recognition             :adv2, 2024-05-01, 2024-07-31
    Social Features               :adv3, 2024-06-01, 2024-08-31
    
    section Phase 3: Educational
    Music Theory Integration      :edu1, 2024-07-01, 2024-09-30
    Video Tutorials               :edu2, 2024-08-01, 2024-10-31
    Teacher Dashboard             :edu3, 2024-09-01, 2024-11-30
    
    section Phase 4: Expansion
    Multiplayer Mode              :exp1, 2024-10-01, 2024-12-31
    AI Recommendations            :exp2, 2024-11-01, 2024-12-31
    Localization                  :exp3, 2024-11-01, 2024-12-31
```

## 9. Performance Metrics

### Key Performance Indicators

```mermaid
pie title User Engagement Metrics
    "Daily Active Users" : 40
    "Session Duration" : 25
    "Retention Rate" : 20
    "Feature Adoption" : 15

```

```mermaid
graph LR
    A[Audio Latency<br/>< 100ms] --> B[Response Time]
    C[Uptime<br/>99.9%] --> D[Availability]
    E[Cross-browser<br/>95%] --> F[Compatibility]
    G[Mobile Performance<br/>Smooth] --> H[User Experience]
    
    B --> I[Technical KPIs]
    D --> I
    F --> I
    H --> I
    
    style A fill:#c8e6c9
    style C fill:#c8e6c9
    style E fill:#c8e6c9
    style G fill:#c8e6c9
    style I fill:#e1f5fe
```

## 10. Entity Relationships

### Core Business Entities

```mermaid
erDiagram
    GAME ||--o{ MELODY : generates
    GAME ||--o{ NOTE : detects
    GAME ||--|| SCORE : calculates
    MELODY ||--o{ NOTE : contains
    NOTE ||--|| PITCH : has
    SCORE ||--|| STREAK : tracks
    GAME ||--|| DIFFICULTY : uses
    
    GAME {
        string id
        string state
        array userInput
        array matchedIndices
        string detectedNote
        string feedback
        number attemptsLeft
    }
    
    MELODY {
        string id
        array notes
        string difficulty
        number length
    }
    
    NOTE {
        string name
        number frequency
        number octave
        string pitch
    }
    
    SCORE {
        number total
        number streak
        number multiplier
        number basePoints
    }
    
    DIFFICULTY {
        string level
        number noteCount
        array intervals
    }
```

---

## Usage in Obsidian

To use these graphics in Obsidian:

1. **Install Mermaid Plugin** - Enable Mermaid diagram support
2. **Copy Diagrams** - Copy individual diagram code blocks
3. **Create Notes** - Create separate notes for each diagram type
4. **Link Diagrams** - Use `[[Note Name]]` to link between diagrams
5. **Tag Organization** - Use tags like `#ear-warrior #architecture #flow`

### Suggested Obsidian Structure

```
📁 Ear Warrior/
├── 📄 Overview.md
├── 📄 Architecture.md (Diagram 1)
├── 📄 Application Flow.md (Diagram 2)
├── 📄 Components.md (Diagram 3)
├── 📄 Data Flow.md (Diagram 4)
├── 📄 Technical Stack.md (Diagram 5)
├── 📄 Game Mechanics.md (Diagram 6)
├── 📄 User Journey.md (Diagram 7)
├── 📄 Roadmap.md (Diagram 8)
└── 📄 Performance.md (Diagram 9)
```

### Sample Obsidian Tags

```
#ear-warrior #react #typescript #audio #game #architecture #fsd #mermaid #music #education
```
