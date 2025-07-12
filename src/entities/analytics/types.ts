export interface MetricData {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  period: string
}

export interface ChartDataPoint {
  date: string
  value: number
  category?: string
}

export interface RevenueData {
  month: string
  revenue: number
  profit: number
  customers: number
}

export interface SalesData {
  product: string
  sales: number
  revenue: number
  growth: number
}

export interface CustomerData {
  segment: string
  count: number
  revenue: number
  percentage: number
}

export interface AnalyticsState {
  metrics: MetricData[]
  revenueData: RevenueData[]
  salesData: SalesData[]
  customerData: CustomerData[]
  isLoading: boolean
  error: string | null
}

export interface DateRange {
  start: Date
  end: Date
}

export interface FilterOptions {
  dateRange: DateRange
  metrics: string[]
  categories: string[]
}