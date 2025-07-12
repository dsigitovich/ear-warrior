import { MetricData, RevenueData, SalesData, CustomerData } from '../../entities/analytics'

export interface ExportData {
  metrics: MetricData[]
  revenue: RevenueData[]
  sales: SalesData[]
  customers: CustomerData[]
}

export function exportToCSV(data: ExportData): void {
  // Создаем CSV для метрик
  const metricsCSV = [
    'Metric,Value,Change,Trend,Period',
    ...data.metrics.map(m => `${m.name},${m.value},${m.change},${m.trend},${m.period}`)
  ].join('\n')

  // Создаем CSV для выручки
  const revenueCSV = [
    'Month,Revenue,Profit,Customers',
    ...data.revenue.map(r => `${r.month},${r.revenue},${r.profit},${r.customers}`)
  ].join('\n')

  // Создаем CSV для продаж
  const salesCSV = [
    'Product,Sales,Revenue,Growth',
    ...data.sales.map(s => `${s.product},${s.sales},${s.revenue},${s.growth}`)
  ].join('\n')

  // Создаем CSV для клиентов
  const customersCSV = [
    'Segment,Count,Revenue,Percentage',
    ...data.customers.map(c => `${c.segment},${c.count},${c.revenue},${c.percentage}`)
  ].join('\n')

  // Объединяем все данные
  const fullCSV = [
    'METRICS',
    metricsCSV,
    '',
    'REVENUE',
    revenueCSV,
    '',
    'SALES',
    salesCSV,
    '',
    'CUSTOMERS',
    customersCSV
  ].join('\n')

  downloadFile(fullCSV, 'analytics_data.csv', 'text/csv')
}

export function exportToJSON(data: ExportData): void {
  const jsonData = {
    exportDate: new Date().toISOString(),
    data: data
  }

  const jsonString = JSON.stringify(jsonData, null, 2)
  downloadFile(jsonString, 'analytics_data.json', 'application/json')
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '')
}