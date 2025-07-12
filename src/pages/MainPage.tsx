import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTY_LEVELS } from '../shared/config/constants'
import { useDifficultyStore } from '../shared/store/difficulty-store'
import { RoosterIcon } from '../shared/ui/RoosterIcon'

export function MainPage () {
  const [selected, setSelected] = useState(DIFFICULTY_LEVELS[0].value)
  const setDifficulty = useDifficultyStore(s => s.setDifficulty)
  const navigate = useNavigate()

  function handlePlay () {
    setDifficulty(selected)
    navigate('/game')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <RoosterIcon width={72} height={54} jumping />
      <label htmlFor='difficulty'>Select difficulty:</label>
      <select
        id='difficulty'
        value={selected}
        onChange={e => setSelected(e.target.value as import('../shared/types').Difficulty)}
        style={{ fontSize: 16 }}
      >
        {DIFFICULTY_LEVELS.map(level => (
          <option key={level.value} value={level.value}>{level.label}</option>
        ))}
      </select>
      <button onClick={handlePlay} style={{ marginTop: 24, fontSize: 18 }}>
        Play
      </button>
    </div>
  )
} 