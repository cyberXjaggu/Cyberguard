import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  ExternalLink,
  Calendar,
  Activity
} from 'lucide-react';
import { domainsAPI } from '../services/api';
import DomainForm from '../components/DomainForm';
import toast from 'react-hot-toast';

const DomainChecker = () => {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [filters]);

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      const response = await domainsAPI.getSuspiciousDomains(filters);
      setDomains(response.data.data.domains);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to fetch domains');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleCheckDomain = async (domain) => {
    try {
      setIsChecking(true);
      const response = await domainsAPI.checkDomain(domain);
      setCheckResult(response.data.data);
    } catch (error) {
      console.error('Error checking domain:', error);
      toast.error('Failed to check domain');
    } finally {
      setIsChecking(false);
    }
  };

  const handleAddDomain = async (domainData) => {
    try {
      await domainsAPI.addSuspiciousDomain(domainData);
      toast.success('Domain added successfully');
      setShowAddModal(false);
      fetchDomains();
    } catch (error) {
      console.error('Error adding domain:', error);
      toast.error('Failed to add domain');
    }
  };

  const handleDeleteDomain = async (domainId) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await domainsAPI.deleteDomain(domainId);
        toast.success('Domain deleted successfully');
        fetchDomains();
      } catch (error) {
        console.error('Error deleting domain:', error);
        toast.error('Failed to delete domain');
      }
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

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Domain Checker</h1>
            <p className="mt-2 text-gray-600">
              Check domains for suspicious activity and manage your threat database
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </button>
        </div>
      </div>

      {/* Domain Check Tool */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Check Domain</h3>
        </div>
        <div className="card-body">
          <DomainForm
            onSubmit={handleCheckDomain}
            isLoading={isChecking}
            placeholder="Enter domain to check (e.g., example.com)"
            buttonText="Check Domain"
          />
          
          {/* Check Result */}
          {checkResult && (
            <div className="mt-6 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Analysis Result: {checkResult.domain}
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(checkResult.riskLevel)}`}>
                  {getRiskIcon(checkResult.riskLevel)}
                  <span className="ml-1">{checkResult.riskLevel} Risk</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{checkResult.riskScore}/100</div>
                  <div className="text-sm text-gray-500">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{checkResult.category}</div>
                  <div className="text-sm text-gray-500">Category</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{checkResult.source}</div>
                  <div className="text-sm text-gray-500">Source</div>
                </div>
              </div>

              {checkResult.indicators && checkResult.indicators.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Threat Indicators:</h5>
                  <div className="space-y-2">
                    {checkResult.indicators.map((indicator, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">{indicator.description}</p>
                          <p className="text-xs text-gray-500">Confidence: {indicator.confidence}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Risk Level Filter */}
            <div>
              <select
                value={filters.riskLevel}
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                className="input"
              >
                <option value="">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                <option value="phishing">Phishing</option>
                <option value="malware">Malware</option>
                <option value="spam">Spam</option>
                <option value="suspicious">Suspicious</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : domains.length > 0 ? (
          domains.map((domain) => (
            <div key={domain._id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {domain.domain}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(domain.riskLevel)}`}>
                        {getRiskIcon(domain.riskLevel)}
                        <span className="ml-1">{domain.riskLevel} Risk</span>
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {domain.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Score: {domain.riskScore}/100
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        First seen: {new Date(domain.firstSeen).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-1" />
                        Last seen: {new Date(domain.lastSeen).toLocaleDateString()}
                      </div>
                    </div>

                    {domain.indicators && domain.indicators.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Threat Indicators:</h5>
                        <div className="flex flex-wrap gap-1">
                          {domain.indicators.slice(0, 3).map((indicator, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                              {indicator.type.replace('_', ' ')}
                            </span>
                          ))}
                          {domain.indicators.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                              +{domain.indicators.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleDeleteDomain(domain._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">
            <div className="card-body text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Add your first suspicious domain to get started.'
                }
              </p>
              {!Object.values(filters).some(f => f) && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-3 py-2 text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-outline disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddModal && (
        <AddDomainModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDomain}
        />
      )}
    </div>
  );
};

// Add Domain Modal Component
const AddDomainModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    domain: '',
    category: 'suspicious',
    indicators: [],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Suspicious Domain</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain *
            </label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
              className="input"
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="phishing">Phishing</option>
              <option value="malware">Malware</option>
              <option value="spam">Spam</option>
              <option value="suspicious">Suspicious</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Additional information about this domain..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainChecker;
