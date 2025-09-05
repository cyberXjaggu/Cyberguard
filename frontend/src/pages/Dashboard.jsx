import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Activity,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { alertsAPI, domainsAPI } from '../services/api';
import AlertsChart from '../components/charts/AlertsChart';
import DomainChart from '../components/charts/DomainChart';

const Dashboard = () => {
  const [alertStats, setAlertStats] = useState(null);
  const [domainStats, setDomainStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentDomains, setRecentDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch alert statistics
      const alertStatsResponse = await alertsAPI.getAlertStats();
      setAlertStats(alertStatsResponse.data.data);

      // Fetch domain statistics
      const domainStatsResponse = await domainsAPI.getDomainStats();
      setDomainStats(domainStatsResponse.data.data);

      // Fetch recent alerts
      const recentAlertsResponse = await alertsAPI.getAlerts({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
      setRecentAlerts(recentAlertsResponse.data.data.alerts);

      // Fetch recent domains
      const recentDomainsResponse = await domainsAPI.getSuspiciousDomains({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
      setRecentDomains(recentDomainsResponse.data.data.domains);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'investigating': return <Eye className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'false_positive': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your threat detection and domain analysis
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Alerts */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alertStats?.overview?.total || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alertStats?.overview?.critical || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suspicious Domains */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suspicious Domains</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {domainStats?.overview?.total || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Domains */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Risk Domains</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(domainStats?.overview?.high || 0) + (domainStats?.overview?.critical || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Alerts Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Alerts by Severity</h3>
          </div>
          <div className="card-body">
            <AlertsChart data={alertStats?.severityBreakdown || []} />
          </div>
        </div>

        {/* Domains Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Domains by Risk Level</h3>
          </div>
          <div className="card-body">
            <DomainChart data={domainStats?.categoryBreakdown || []} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
              <Link
                to="/alerts"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-200">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <div key={alert._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {alert.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {alert.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500">
                            {getStatusIcon(alert.status)}
                            <span className="ml-1">{alert.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent alerts
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Domains */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Suspicious Domains</h3>
              <Link
                to="/domains"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-200">
              {recentDomains.length > 0 ? (
                recentDomains.map((domain) => (
                  <div key={domain._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {domain.domain}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Risk Score: {domain.riskScore}/100
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(domain.riskLevel)}`}>
                            {domain.riskLevel}
                          </span>
                          <span className="text-xs text-gray-500">
                            {domain.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent suspicious domains
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
