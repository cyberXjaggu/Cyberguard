const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Alert description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Alert severity is required'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['phishing', 'malware', 'suspicious_domain', 'data_breach', 'vulnerability', 'other'],
    required: [true, 'Alert category is required'],
    default: 'other'
  },
  source: {
    type: String,
    required: [true, 'Alert source is required'],
    enum: ['manual', 'osint', 'api', 'system'],
    default: 'manual'
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Please enter a valid domain']
  },
  ipAddress: {
    type: String,
    trim: true,
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Please enter a valid IP address']
  },
  status: {
    type: String,
    enum: ['new', 'investigating', 'resolved', 'false_positive'],
    default: 'new'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  evidence: [{
    type: {
      type: String,
      enum: ['url', 'screenshot', 'log', 'file', 'other']
    },
    value: String,
    description: String
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: [500, 'Resolution cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
alertSchema.index({ severity: 1, status: 1, createdAt: -1 });
alertSchema.index({ domain: 1 });
alertSchema.index({ category: 1 });
alertSchema.index({ source: 1 });

// Virtual for alert age
alertSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to mark as resolved
alertSchema.methods.resolve = function(userId, resolution) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = userId;
  this.resolution = resolution;
  return this.save();
};

module.exports = mongoose.model('Alert', alertSchema);
