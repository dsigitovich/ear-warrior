import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SalesData } from '../types'
import './sales-chart.module.scss'

interface SalesChartProps {
  data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}М`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}К`
    }
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="customTooltip">
          <p className="tooltipLabel">{label}</p>
          <p className="tooltipValue" style={{ color: payload[0].color }}>
            Выручка: {formatValue(data.revenue)} ₽
          </p>
          <p className="tooltipValue" style={{ color: payload[0].color }}>
            Продажи: {data.sales} шт.
          </p>
          <p className="tooltipValue" style={{ color: data.growth >= 0 ? '#10b981' : '#ef4444' }}>
            Рост: {data.growth >= 0 ? '+' : ''}{data.growth}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Продажи по продуктам</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="product" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Выручка"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}