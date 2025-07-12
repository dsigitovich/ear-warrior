import { useState } from 'react'
import { getRandomSmokeText, getSmokeTexts, getAllSmokeTexts } from '../lib/smoke-texts'
import { Button } from './Button'
import './SmokeTextDemo.css'

export interface SmokeTextDemoProps {
  category?: keyof typeof getAllSmokeTexts
  showAll?: boolean
}

export function SmokeTextDemo ({ category, showAll = false }: SmokeTextDemoProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof ReturnType<typeof getAllSmokeTexts>>(category || 'instructions')
  const [randomText, setRandomText] = useState<string>('')

  const allTexts = getAllSmokeTexts()
  const categories = Object.keys(allTexts) as Array<keyof typeof allTexts>

  const handleGenerateRandom = () => {
    setRandomText(getRandomSmokeText(selectedCategory))
  }

  const handleCategoryChange = (newCategory: keyof typeof allTexts) => {
    setSelectedCategory(newCategory)
    setRandomText('')
  }

  if (showAll) {
    return (
      <div className="smoke-text-demo">
        <h2>All Smoke Texts</h2>
        {categories.map(cat => (
          <div key={cat} className="smoke-text-category">
            <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
            <div className="smoke-text-list">
              {allTexts[cat].map((text, idx) => (
                <div key={idx} className="smoke-text-item">
                  {text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="smoke-text-demo">
      <h2>Smoke Text Demo</h2>
      <div className="smoke-text-controls">
        <div className="smoke-text-category-selector">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as keyof typeof allTexts)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleGenerateRandom}>Generate Random Text</Button>
      </div>

      <div className="smoke-text-display">
        <h3>Random Text:</h3>
        {randomText && <p className="smoke-text-random">{randomText}</p>}
      </div>

      <div className="smoke-text-sample">
        <h3>Sample Texts ({selectedCategory}):</h3>
        <div className="smoke-text-list">
          {getSmokeTexts(selectedCategory, 3).map((text, idx) => (
            <div key={idx} className="smoke-text-item">
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}