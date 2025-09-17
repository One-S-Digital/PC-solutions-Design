import React, { useState, useMemo } from 'react';
import { ServerStackIcon, ChartBarIcon, ShieldExclamationIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { MOCK_SYSTEM_METRICS, MOCK_LOG_ENTRIES, MOCK_SECURITY_ALERTS } from 'packages/core/src/constants';
import { LogEntry } from 'packages/core/src/types';
import { useTranslation } from 'react-i18next';
import Button from 'packages/ui/src/components/Button';

type LogLevel = 'ALL' | 'ERROR' | 'WARN' | 'INFO';

const AdminSystemMonitoringPage: React.FC = () => {
  const { t } = useTranslation();
  const [logFilter, setLogFilter] = useState<LogLevel>('ALL');

  const getStatusColorClasses = (status: 'Normal' | 'Warning' | 'Critical') => {
    switch (status) {
      case 'Normal': return 'bg-success/10 text-success';
      case 'Warning': return 'bg-warn/20 text-warn';
      case 'Critical': return 'bg-danger/10 text-danger';
    }
  };
  
  const getRiskColorClasses = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low': return 'bg-info/10 text-info';
      case 'Medium': return 'bg-warn/20 text-warn';
      case 'High': return 'bg-danger/10 text-danger';
    }
  };
  
  const getLogLevelColorClasses = (level: 'INFO' | 'WARN' | 'ERROR') => {
      switch(level) {
          case 'INFO': return 'text-info';
          case 'WARN': return 'text-warn';
          case 'ERROR': return 'text-danger';
      }
  };

  const filteredLogs = useMemo(() => {
    if (logFilter === 'ALL') return MOCK_LOG_ENTRIES;
    return MOCK_LOG_ENTRIES.filter(log => log.level === logFilter);
  }, [logFilter]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-strong flex items-center">
        <ServerStackIcon className="w-8 h-8 mr-3 text-accent" />
        {t('adminSystemMonitoringPage.title')}
      </h1>

      <div className="bg-surface-1 p-6 rounded-lg shadow-soft">
        <h2 className="text-xl font-semibold text-text-strong mb-4">{t('adminSystemMonitoringPage.systemHealth.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SYSTEM_METRICS.map(metric => (
            <div key={metric.name} className={`p-4 rounded-md ${getStatusColorClasses(metric.status)}`}>
              <p className="text-sm font-medium opacity-80">{t(`adminSystemMonitoringPage.systemHealth.${metric.name.toLowerCase().replace(' ', '')}`)}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-xs font-semibold">{t(`adminSystemMonitoringPage.systemHealth.status.${metric.status.toLowerCase()}`)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-semibold text-text-strong mb-4">{t('adminSystemMonitoringPage.apiResponseTimes.title')}</h2>
          <div className="bg-surface-2 h-64 flex items-center justify-center rounded-md">
            <ChartBarIcon className="w-16 h-16 text-text-subtle" />
            <p className="text-text-muted ml-2">{t('adminSystemMonitoringPage.mockChart')}</p>
          </div>
        </div>
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-semibold text-text-strong mb-4">{t('adminSystemMonitoringPage.securityAlerts.title')}</h2>
          <div className="overflow-x-auto max-h-64">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-text-muted uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.event')}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-text-muted uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.risk')}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-text-muted uppercase">{t('adminSystemMonitoringPage.securityAlerts.table.ip')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_SECURITY_ALERTS.map(alert => (
                  <tr key={alert.id}>
                    <td className="px-3 py-2 whitespace-nowrap text-text-default">{alert.event}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRiskColorClasses(alert.riskLevel)}`}>
                        {t(`adminSystemMonitoringPage.securityAlerts.risk.${alert.riskLevel.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs text-text-muted">{alert.sourceIp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-surface-1 p-6 rounded-lg shadow-soft">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-strong flex items-center mb-3 sm:mb-0">
                <CommandLineIcon className="w-6 h-6 mr-2" />
                {t('adminSystemMonitoringPage.logConsole.title')}
            </h2>
            <div className="flex space-x-1 bg-surface-2 p-1 rounded-lg">
                {(['ALL', 'ERROR', 'WARN', 'INFO'] as LogLevel[]).map(level => (
                    <Button key={level} size="sm" onClick={() => setLogFilter(level)}
                        className={`transition-colors ${logFilter === level ? 'bg-surface-1 text-text-strong shadow-soft' : 'bg-transparent text-text-muted hover:bg-surface-3'}`}
                    >
                       {t(`adminSystemMonitoringPage.logConsole.filters.${level.toLowerCase()}`)}
                    </Button>
                ))}
            </div>
        </div>
        <div className="bg-surface-0 text-text-default font-mono text-xs p-4 rounded-md h-80 overflow-y-scroll">
          {filteredLogs.map(log => (
            <p key={log.id} className="whitespace-pre-wrap">
              <span className="text-text-subtle">{new Date(log.timestamp).toLocaleTimeString()} - </span>
              <span className={getLogLevelColorClasses(log.level)}>[{log.level}]</span>
              <span className="ml-2">{log.message}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSystemMonitoringPage;