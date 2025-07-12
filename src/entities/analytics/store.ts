import { create } from 'zustand'
import { AnalyticsState, MetricData, RevenueData, SalesData, CustomerData } from './types'

// Мок данные для демонстрации
const mockMetrics: MetricData[] = [
  {
    id: '1',
    name: 'Общая выручка',
    value: 2450000,
    change: 12.5,
    trend: 'up',
    period: 'за месяц'
  },
  {
    id: '2', 
    name: 'Новые клиенты',
    value: 1250,
    change: 8.2,
    trend: 'up',
    period: 'за месяц'
  },
  {
    id: '3',
    name: 'Конверсия',
    value: 3.4,
    change: -2.1,
    trend: 'down',
    period: 'за месяц'
  },
  {
    id: '4',
    name: 'Средний чек',
    value: 1960,
    change: 5.8,
    trend: 'up',
    period: 'за месяц'
  }
]

const mockRevenueData: RevenueData[] = [
  { month: 'Янв', revenue: 2100000, profit: 420000, customers: 1100 },
  { month: 'Фев', revenue: 2300000, profit: 460000, customers: 1200 },
  { month: 'Мар', revenue: 2550000, profit: 510000, customers: 1350 },
  { month: 'Апр', revenue: 2200000, profit: 440000, customers: 1150 },
  { month: 'Май', revenue: 2800000, profit: 560000, customers: 1400 },
  { month: 'Июн', revenue: 3100000, profit: 620000, customers: 1580 },
  { month: 'Июл', revenue: 2900000, profit: 580000, customers: 1480 },
  { month: 'Авг', revenue: 3350000, profit: 670000, customers: 1650 },
  { month: 'Сен', revenue: 3200000, profit: 640000, customers: 1600 },
  { month: 'Окт', revenue: 2750000, profit: 550000, customers: 1320 },
  { month: 'Ноя', revenue: 2450000, profit: 490000, customers: 1250 },
  { month: 'Дек', revenue: 2650000, profit: 530000, customers: 1380 }
]

const mockSalesData: SalesData[] = [
  { product: 'Продукт А', sales: 450, revenue: 1350000, growth: 15.2 },
  { product: 'Продукт Б', sales: 320, revenue: 960000, growth: 8.7 },
  { product: 'Продукт В', sales: 280, revenue: 840000, growth: -3.1 },
  { product: 'Продукт Г', sales: 190, revenue: 570000, growth: 22.4 },
  { product: 'Продукт Д', sales: 150, revenue: 450000, growth: 5.8 }
]

const mockCustomerData: CustomerData[] = [
  { segment: 'Премиум', count: 380, revenue: 1140000, percentage: 24.2 },
  { segment: 'Стандарт', count: 620, revenue: 1240000, percentage: 39.5 },
  { segment: 'Базовый', count: 480, revenue: 480000, percentage: 30.6 },
  { segment: 'Новички', count: 90, revenue: 90000, percentage: 5.7 }
]

interface AnalyticsStore extends AnalyticsState {
  loadData: () => Promise<void>
  refreshData: () => Promise<void>
  setError: (error: string | null) => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  metrics: [],
  revenueData: [],
  salesData: [],
  customerData: [],
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Симулируем загрузку данных
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set({
        metrics: mockMetrics,
        revenueData: mockRevenueData,
        salesData: mockSalesData,
        customerData: mockCustomerData,
        isLoading: false
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки данных',
        isLoading: false 
      })
    }
  },

  refreshData: async () => {
    const { loadData } = get()
    await loadData()
  },

  setError: (error: string | null) => {
    set({ error })
  }
}))