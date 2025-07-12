import { useEffect } from 'react'
import { RefreshCw, Download, Calendar } from 'lucide-react'
import { 
  useAnalyticsStore, 
  MetricCard, 
  RevenueChart, 
  SalesChart, 
  CustomerChart 
} from '../../entities/analytics'
import { exportToCSV, exportToJSON } from '../../features/export-data'
import './analytics-page.module.scss'

export function AnalyticsPage() {
  const { 
    metrics, 
    revenueData, 
    salesData, 
    customerData, 
    isLoading, 
    error,
    loadData,
    refreshData
  } = useAnalyticsStore()

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleExport = () => {
    const exportData = {
      metrics,
      revenue: revenueData,
      sales: salesData,
      customers: customerData
    }
    exportToCSV(exportData)
  }

  const handleExportJSON = () => {
    const exportData = {
      metrics,
      revenue: revenueData,
      sales: salesData,
      customers: customerData
    }
    exportToJSON(exportData)
  }

  if (error) {
    return (
      <div className="errorContainer">
        <h2>Ошибка загрузки данных</h2>
        <p>{error}</p>
        <button onClick={refreshData} className="retryButton">
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="analyticsPage">
      <div className="pageHeader">
        <div className="headerContent">
          <h1 className="pageTitle">Бизнес Аналитика</h1>
          <p className="pageSubtitle">Обзор ключевых показателей и тенденций</p>
        </div>
        
        <div className="headerActions">
          <button className="actionButton secondary">
            <Calendar size={16} />
            Период
          </button>
          <button className="actionButton secondary" onClick={handleExport}>
            <Download size={16} />
            Экспорт CSV
          </button>
          <button className="actionButton secondary" onClick={handleExportJSON}>
            <Download size={16} />
            Экспорт JSON
          </button>
          <button 
            className="actionButton primary"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            Обновить
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loadingContainer">
          <div className="loadingSpinner" />
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <>
          <div className="metricsGrid">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="chartsGrid">
            <div className="chartItem fullWidth">
              <RevenueChart data={revenueData} />
            </div>
            
            <div className="chartItem">
              <SalesChart data={salesData} />
            </div>
            
            <div className="chartItem">
              <CustomerChart data={customerData} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}