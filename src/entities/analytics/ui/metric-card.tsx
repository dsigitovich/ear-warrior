import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MetricData } from '../types'
import './metric-card.module.scss'

interface MetricCardProps {
  metric: MetricData
}

export function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (value: number): string => {
    if (metric.name === 'Конверсия') {
      return `${value}%`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}М`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}К`
    }
    return value.toString()
  }

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp size={16} className="trendIcon up" />
      case 'down':
        return <TrendingDown size={16} className="trendIcon down" />
      default:
        return <Minus size={16} className="trendIcon neutral" />
    }
  }

  const getTrendClass = () => {
    switch (metric.trend) {
      case 'up':
        return 'positive'
      case 'down':
        return 'negative'
      default:
        return 'neutral'
    }
  }

  return (
    <div className="metricCard">
      <div className="metricHeader">
        <h3 className="metricTitle">{metric.name}</h3>
        <div className={`metricChange ${getTrendClass()}`}>
          {getTrendIcon()}
          <span>{Math.abs(metric.change)}%</span>
        </div>
      </div>
      
      <div className="metricValue">
        {formatValue(metric.value)}
      </div>
      
      <div className="metricPeriod">
        {metric.period}
      </div>
    </div>
  )
}