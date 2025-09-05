const mongoose = require('mongoose');

const suspiciousDomainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Please enter a valid domain']
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['phishing', 'malware', 'spam', 'suspicious', 'unknown'],
    required: true,
    default: 'suspicious'
  },
  source: {
    type: String,
    enum: ['manual', 'osint', 'api', 'heuristic'],
    required: true,
    default: 'manual'
  },
  firstSeen: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  indicators: [{
    type: {
      type: String,
      enum: ['typosquatting', 'suspicious_tld', 'recent_registration', 'no_ssl', 'suspicious_content', 'blacklisted_ip', 'other']
    },
    description: String,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  ipAddresses: [{
    ip: String,
    country: String,
    isp: String,
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  whois: {
    registrar: String,
    registrationDate: Date,
    expirationDate: Date,
    nameServers: [String],
    country: String
  },
  sslInfo: {
    hasSSL: {
      type: Boolean,
      default: false
    },
    issuer: String,
    validFrom: Date,
    validTo: Date,
    isExpired: {
      type: Boolean,
      default: false
    }
  },
  reputation: {
    totalChecks: {
      type: Number,
      default: 0
    },
    positiveChecks: {
      type: Number,
      default: 0
    },
    negativeChecks: {
      type: Number,
      default: 0
    }
  },
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
suspiciousDomainSchema.index({ domain: 1 });
suspiciousDomainSchema.index({ riskLevel: 1, isActive: 1 });
suspiciousDomainSchema.index({ category: 1 });
suspiciousDomainSchema.index({ firstSeen: -1 });
suspiciousDomainSchema.index({ riskScore: -1 });

// Virtual for reputation percentage
suspiciousDomainSchema.virtual('reputationPercentage').get(function() {
  if (this.reputation.totalChecks === 0) return 0;
  return Math.round((this.reputation.positiveChecks / this.reputation.totalChecks) * 100);
});

// Method to update risk score
suspiciousDomainSchema.methods.updateRiskScore = function() {
  let score = 0;
  
  // Base score from indicators
  this.indicators.forEach(indicator => {
    score += indicator.confidence || 50;
  });
  
  // Adjust based on category
  const categoryScores = {
    phishing: 90,
    malware: 95,
    spam: 60,
    suspicious: 40,
    unknown: 30
  };
  score = Math.max(score, categoryScores[this.category] || 30);
  
  // Adjust based on SSL
  if (!this.sslInfo.hasSSL) score += 20;
  if (this.sslInfo.isExpired) score += 15;
  
  // Adjust based on registration age (newer = more suspicious)
  if (this.whois.registrationDate) {
    const daysSinceRegistration = (Date.now() - this.whois.registrationDate) / (1000 * 60 * 60 * 24);
    if (daysSinceRegistration < 30) score += 25;
    else if (daysSinceRegistration < 90) score += 15;
  }
  
  this.riskScore = Math.min(Math.max(score, 0), 100);
  
  // Update risk level based on score
  if (this.riskScore >= 80) this.riskLevel = 'critical';
  else if (this.riskScore >= 60) this.riskLevel = 'high';
  else if (this.riskScore >= 40) this.riskLevel = 'medium';
  else this.riskLevel = 'low';
  
  return this.save();
};

// Method to add indicator
suspiciousDomainSchema.methods.addIndicator = function(type, description, confidence = 50) {
  this.indicators.push({ type, description, confidence });
  this.lastSeen = new Date();
  return this.updateRiskScore();
};

module.exports = mongoose.model('SuspiciousDomain', suspiciousDomainSchema);
