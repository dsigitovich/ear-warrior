import { GamePanel } from '../../../widgets/game-panel';
import { useGameSession } from '../../../processes/game-session';
import { getMelodyNotes } from '../../../entities/melody/model/melody';
import './GamePage.css';

export function GamePage () {
  const {
    game,
    audioBuffer,
    playMelody,
    stopListening,
    replayMelody,
  } = useGameSession();
  const melodyNotes = game.currentMelody ? getMelodyNotes(game.currentMelody) : [];

  return (
    <div className="game-page">
      <GamePanel
        score={game.stats.score}
        streak={game.stats.streak}
        attemptsLeft={game.attemptsLeft}
        melody={melodyNotes}
        userInputNotes={game.userInput as import('../../../shared/types').Note[]}
        matchedIndices={game.matchedIndices}
        isPlaying={game.state === 'playing'}
        isListening={game.state === 'listening'}
        feedback={game.feedback}
        detectedPitch={game.detectedPitch}
        detectedNote={game.detectedNote}
        audioBuffer={audioBuffer}
        sampleRate={44100}
        onPlayMelody={playMelody}
        onStopListening={stopListening}
        onReplayMelody={replayMelody}
      />
    </div>
  );
} 