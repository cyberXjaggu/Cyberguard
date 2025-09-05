const SuspiciousDomain = require('../models/SuspiciousDomain');
const Alert = require('../models/Alert');

// Get all suspicious domains with filtering and pagination
const getSuspiciousDomains = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      riskLevel,
      category,
      search,
      sortBy = 'riskScore',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (riskLevel) filter.riskLevel = riskLevel;
    if (category) filter.category = category;
    if (search) {
      filter.domain = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get domains with pagination
    const domains = await SuspiciousDomain.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await SuspiciousDomain.countDocuments(filter);

    res.json({
      success: true,
      data: {
        domains,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suspicious domains',
      error: error.message
    });
  }
};

// Get single domain by ID
const getDomain = async (req, res) => {
  try {
    const domain = await SuspiciousDomain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    res.json({
      success: true,
      data: { domain }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch domain',
      error: error.message
    });
  }
};

// Check domain for suspicious activity
const checkDomain = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required'
      });
    }

    // Normalize domain
    const normalizedDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

    // Check if domain exists in our database
    const existingDomain = await SuspiciousDomain.findOne({ domain: normalizedDomain });

    if (existingDomain) {
      return res.json({
        success: true,
        data: {
          domain: normalizedDomain,
          isSuspicious: true,
          riskLevel: existingDomain.riskLevel,
          riskScore: existingDomain.riskScore,
          category: existingDomain.category,
          indicators: existingDomain.indicators,
          firstSeen: existingDomain.firstSeen,
          lastSeen: existingDomain.lastSeen,
          source: 'database'
        }
      });
    }

    // Perform heuristic analysis
    const analysis = await performHeuristicAnalysis(normalizedDomain);

    res.json({
      success: true,
      data: {
        domain: normalizedDomain,
        isSuspicious: analysis.isSuspicious,
        riskLevel: analysis.riskLevel,
        riskScore: analysis.riskScore,
        category: analysis.category,
        indicators: analysis.indicators,
        source: 'heuristic'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check domain',
      error: error.message
    });
  }
};

// Add domain to suspicious list
const addSuspiciousDomain = async (req, res) => {
  try {
    const { domain, category, indicators, notes } = req.body;

    // Normalize domain
    const normalizedDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

    // Check if domain already exists
    const existingDomain = await SuspiciousDomain.findOne({ domain: normalizedDomain });

    if (existingDomain) {
      return res.status(400).json({
        success: false,
        message: 'Domain already exists in suspicious domains list'
      });
    }

    // Create new suspicious domain
    const suspiciousDomain = new SuspiciousDomain({
      domain: normalizedDomain,
      category: category || 'suspicious',
      source: 'manual',
      indicators: indicators || [],
      notes: notes ? [{ text: notes, addedBy: req.user._id }] : []
    });

    // Update risk score based on indicators
    await suspiciousDomain.updateRiskScore();
    await suspiciousDomain.save();

    // Create alert for the new suspicious domain
    const alert = new Alert({
      title: `New Suspicious Domain Detected: ${normalizedDomain}`,
      description: `Domain ${normalizedDomain} has been added to the suspicious domains list. Risk Level: ${suspiciousDomain.riskLevel}`,
      severity: suspiciousDomain.riskLevel === 'critical' ? 'critical' : 
                suspiciousDomain.riskLevel === 'high' ? 'high' : 'medium',
      category: 'suspicious_domain',
      domain: normalizedDomain,
      source: 'manual',
      createdBy: req.user._id,
      tags: ['domain', 'suspicious', suspiciousDomain.category]
    });

    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Domain added to suspicious list successfully',
      data: { domain: suspiciousDomain }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add suspicious domain',
      error: error.message
    });
  }
};

// Update domain
const updateDomain = async (req, res) => {
  try {
    const domain = await SuspiciousDomain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    // Update domain
    Object.assign(domain, req.body);
    await domain.updateRiskScore();
    await domain.save();

    res.json({
      success: true,
      message: 'Domain updated successfully',
      data: { domain }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update domain',
      error: error.message
    });
  }
};

// Delete domain (soft delete)
const deleteDomain = async (req, res) => {
  try {
    const domain = await SuspiciousDomain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    // Soft delete
    domain.isActive = false;
    await domain.save();

    res.json({
      success: true,
      message: 'Domain deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete domain',
      error: error.message
    });
  }
};

// Get domain statistics
const getDomainStats = async (req, res) => {
  try {
    const stats = await SuspiciousDomain.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          critical: { $sum: { $cond: [{ $eq: ['$riskLevel', 'critical'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$riskLevel', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$riskLevel', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$riskLevel', 'low'] }, 1, 0] } },
          avgRiskScore: { $avg: '$riskScore' }
        }
      }
    ]);

    const categoryStats = await SuspiciousDomain.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentDomains = await SuspiciousDomain.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('domain riskLevel category createdAt');

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          avgRiskScore: 0
        },
        categoryBreakdown: categoryStats,
        recentDomains
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch domain statistics',
      error: error.message
    });
  }
};

// Heuristic analysis function
const performHeuristicAnalysis = async (domain) => {
  const indicators = [];
  let riskScore = 0;
  let category = 'suspicious';

  // Check for typosquatting patterns
  const commonDomains = ['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com'];
  const suspiciousPatterns = commonDomains.map(d => d.replace('.com', ''));
  
  for (const pattern of suspiciousPatterns) {
    if (domain.includes(pattern) && domain !== `${pattern}.com`) {
      indicators.push({
        type: 'typosquatting',
        description: `Potential typosquatting of ${pattern}`,
        confidence: 80
      });
      riskScore += 80;
      category = 'phishing';
    }
  }

  // Check for suspicious TLDs
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
  const domainTLD = domain.substring(domain.lastIndexOf('.'));
  if (suspiciousTLDs.includes(domainTLD)) {
    indicators.push({
      type: 'suspicious_tld',
      description: `Suspicious TLD: ${domainTLD}`,
      confidence: 60
    });
    riskScore += 60;
  }

  // Check domain length (very long domains are suspicious)
  if (domain.length > 30) {
    indicators.push({
      type: 'suspicious_content',
      description: 'Unusually long domain name',
      confidence: 40
    });
    riskScore += 40;
  }

  // Check for numbers in domain (can be suspicious)
  const numberCount = (domain.match(/\d/g) || []).length;
  if (numberCount > 3) {
    indicators.push({
      type: 'suspicious_content',
      description: 'High number of digits in domain',
      confidence: 30
    });
    riskScore += 30;
  }

  // Check for hyphens (multiple hyphens can be suspicious)
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount > 2) {
    indicators.push({
      type: 'suspicious_content',
      description: 'Multiple hyphens in domain',
      confidence: 25
    });
    riskScore += 25;
  }

  // Determine risk level
  let riskLevel = 'low';
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';

  return {
    isSuspicious: riskScore > 30,
    riskLevel,
    riskScore: Math.min(riskScore, 100),
    category,
    indicators
  };
};

module.exports = {
  getSuspiciousDomains,
  getDomain,
  checkDomain,
  addSuspiciousDomain,
  updateDomain,
  deleteDomain,
  getDomainStats
};
