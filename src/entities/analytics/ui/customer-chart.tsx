import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CustomerData } from '../types'
import './customer-chart.module.scss'

interface CustomerChartProps {
  data: CustomerData[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export function CustomerChart({ data }: CustomerChartProps) {
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}М`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}К`
    }
    return value.toString()
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="customTooltip">
          <p className="tooltipLabel">{data.segment}</p>
          <p className="tooltipValue" style={{ color: payload[0].color }}>
            Клиенты: {data.count}
          </p>
          <p className="tooltipValue" style={{ color: payload[0].color }}>
            Выручка: {formatValue(data.revenue)} ₽
          </p>
          <p className="tooltipValue" style={{ color: payload[0].color }}>
            Доля: {data.percentage}%
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ value, percent }: any) => {
    return `${(percent * 100).toFixed(1)}%`
  }

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Сегменты клиентов</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="segmentsList">
        {data.map((segment, index) => (
          <div key={segment.segment} className="segmentItem">
            <div 
              className="segmentColor" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="segmentInfo">
              <div className="segmentName">{segment.segment}</div>
              <div className="segmentStats">
                {segment.count} клиентов • {formatValue(segment.revenue)} ₽
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}