const osintFetcher = require('../services/osintFetcher');

// Trigger manual OSINT fetch
const triggerFetch = async (req, res) => {
  try {
    const result = await osintFetcher.fetchOSINTData();
    
    res.json({
      success: true,
      message: 'OSINT fetch completed',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OSINT fetch failed',
      error: error.message
    });
  }
};

// Get OSINT fetch status
const getFetchStatus = async (req, res) => {
  try {
    const status = osintFetcher.getStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get fetch status',
      error: error.message
    });
  }
};

// Get OSINT sources configuration
const getSources = async (req, res) => {
  try {
    const sources = osintFetcher.getSources();
    
    res.json({
      success: true,
      data: { sources }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get sources',
      error: error.message
    });
  }
};

module.exports = {
  triggerFetch,
  getFetchStatus,
  getSources
};
