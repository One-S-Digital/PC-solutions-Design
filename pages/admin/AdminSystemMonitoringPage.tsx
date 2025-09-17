
import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ServerStackIcon, ChartBarIcon, ShieldExclamationIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { MOCK_SYSTEM_METRICS, MOCK_LOG_ENTRIES, MOCK_SECURITY_ALERTS } from '../../constants';
import { LogEntry, SecurityAlert, SystemMetric } from '../../types';
import { useTranslation } from 'react-i18next';

type LogLevel = 'ALL' | 'ERROR' | 'WARN' | 'INFO';

const AdminSystemMonitoringPage: React.FC = () => {
  const { t } = useTranslation();
  const [logFilter, setLogFilter] = useState<LogLevel>('ALL');

  const getStatusColorClasses = (status: 'Normal' | 'Warning' | 'Critical') => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-700';
      case 'Warning': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700';
    }
  };
  
  const getRiskColorClasses = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
    }
  };
  
  const getLogLevelColorClasses = (level: 'INFO' | 'WARN' | 'ERROR') => {
      switch(level) {
          case 'INFO': return 'text-blue-500';
          case 'WARN': return 'text-yellow-600';
          case 'ERROR': return 'text-red-600';
      }
  };

  const filteredLogs = useMemo(() => {
    if (logFilter === 'ALL') return MOCK_LOG_ENTRIES;
    return MOCK_LOG_ENTRIES.filter(log => log.level === logFilter);
  }, [logFilter]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <ServerStackIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        {t('adminSystemMonitoringPage.title')}
      </h1>

      {/* System Health Metrics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('adminSystemMonitoringPage.systemHealth.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SYSTEM_METRICS.map(metric => (
            <div key={metric.name} className={`p-4 rounded-lg ${getStatusColorClasses(metric.status)}`}>
              <p className="text-sm font-medium opacity-80">{t(`adminSystemMonitoringPage.systemHealth.${metric.name.toLowerCase().replace(' ', '')}`)}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-xs font-semibold">{t(`adminSystemMonitoringPage.systemHealth.status.${metric.status.toLowerCase()}`)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* API Response Times & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('adminSystemMonitoringPage.apiResponseTimes.title')}</h2>
          <div className="bg-gray-50 h-64 flex items-center justify-center rounded-md">
            <ChartBarIcon className="w-16 h-16 text-gray-300" />
            <p className="text-gray-400 ml-2">{t('adminSystemMonitoringPage.mockChart')}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('adminSystemMonitoringPage.securityAlerts.title')}</h2>
          <div className="overflow-x-auto max-h-64">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.event')}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.risk')}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.ip')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_SECURITY_ALERTS.map(alert => (
                  <tr key={alert.id}>
                    <td className="px-3 py-2 whitespace-nowrap">{alert.event}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRiskColorClasses(alert.riskLevel)}`}>
                        {t(`adminSystemMonitoringPage.securityAlerts.risk.${alert.riskLevel.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{alert.sourceIp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Log Console */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-swiss-charcoal flex items-center mb-3 sm:mb-0">
                <CommandLineIcon className="w-6 h-6 mr-2" />
                {t('adminSystemMonitoringPage.logConsole.title')}
            </h2>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {(['ALL', 'ERROR', 'WARN', 'INFO'] as LogLevel[]).map(level => (
                    <Button
                        key={level}
                        variant={logFilter === level ? 'light' : 'ghost'}
                        size="sm"
                        onClick={() => setLogFilter(level)}
                        className={`${logFilter === level ? 'bg-white shadow-sm' : 'shadow-none'}`}
                    >
                       {t(`adminSystemMonitoringPage.logConsole.filters.${level.toLowerCase()}`)}
                    </Button>
                ))}
            </div>
        </div>
        <div className="bg-swiss-charcoal text-white font-mono text-xs p-4 rounded-md h-80 overflow-y-scroll">
          {filteredLogs.map(log => (
            <p key={log.id} className="whitespace-pre-wrap">
              <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()} - </span>
              <span className={getLogLevelColorClasses(log.level)}>[{log.level}]</span>
              <span className="ml-2">{log.message}</span>
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminSystemMonitoringPage;
