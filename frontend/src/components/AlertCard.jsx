import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Eye, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  ExternalLink,
  User,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const AlertCard = ({ alert, onResolve, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState('');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'investigating': return <Eye className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'false_positive': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleResolve = async () => {
    if (resolution.trim()) {
      await onResolve(alert._id, resolution);
      setShowResolveModal(false);
      setResolution('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      onDelete(alert._id);
    }
  };

  return (
    <>
      <div className="card hover:shadow-md transition-shadow duration-200">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {alert.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {alert.description}
              </p>

              {/* Tags and Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                  {getStatusIcon(alert.status)}
                  <span className="ml-1">{alert.status.replace('_', ' ')}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {alert.category.replace('_', ' ')}
                </span>
                {alert.domain && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {alert.domain}
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {alert.createdBy?.firstName} {alert.createdBy?.lastName}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
                {alert.resolvedAt && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolved {format(new Date(alert.resolvedAt), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>

              {/* Resolution */}
              {alert.resolution && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Resolution:</strong> {alert.resolution}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => setShowResolveModal(true)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve Alert
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Delete Alert
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolve Alert</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="input"
                placeholder="Describe how this alert was resolved..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={!resolution.trim()}
                className="btn btn-success"
              >
                Resolve Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
};

export default AlertCard;
