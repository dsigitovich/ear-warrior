import { GamePanel } from '../../../widgets/game-panel'
import { useGameSession } from '../../../processes/game-session'
import { getMelodyNotes } from '../../../entities/melody/model/melody'
import './GamePage.css'
import { useNavigate } from 'react-router-dom'

export function GamePage () {
  const {
    game,
    audioBuffer,
    playMelody,
    stopListening,
    replayMelody,
  } = useGameSession()
  const melodyNotes = game.currentMelody ? getMelodyNotes(game.currentMelody) : []
  const navigate = useNavigate()

  return (
    <div className="game-page">
      <button
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
        onClick={() => navigate('/')}
      >
        Back
      </button>
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
  )
}