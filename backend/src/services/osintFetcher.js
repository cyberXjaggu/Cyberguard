const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const Alert = require('../models/Alert');
const SuspiciousDomain = require('../models/SuspiciousDomain');

class OSINTFetcher {
  constructor() {
    this.isRunning = false;
    this.lastFetch = null;
    this.fetchCount = 0;
    this.sources = {
      phishtank: {
        name: 'PhishTank',
        enabled: !!process.env.PHISHTANK_API_KEY,
        url: 'http://data.phishtank.com/data/online-valid.json',
        fallback: 'data/phishTankSample.json'
      },
      abusech: {
        name: 'Abuse.ch',
        enabled: true,
        url: 'https://feeds.abuse.ch/urlhaus.txt',
        fallback: 'data/abuseChSample.json'
      },
      virustotal: {
        name: 'VirusTotal',
        enabled: !!process.env.VIRUSTOTAL_API_KEY,
        url: 'https://www.virustotal.com/vtapi/v2/domain/report',
        fallback: 'data/virusTotalSample.json'
      }
    };
  }

  // Start the OSINT fetcher cron job
  start() {
    if (this.isRunning) {
      console.log('OSINT fetcher is already running');
      return;
    }

    // Run every minute in development, every hour in production
    const cronExpression = process.env.NODE_ENV === 'development' ? '* * * * *' : '0 * * * *';
    
    this.cronJob = cron.schedule(cronExpression, async () => {
      try {
        await this.fetchOSINTData();
      } catch (error) {
        console.error('OSINT fetch error:', error);
      }
    }, {
      scheduled: false
    });

    this.cronJob.start();
    this.isRunning = true;
    console.log('OSINT fetcher started');
  }

  // Stop the OSINT fetcher
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log('OSINT fetcher stopped');
  }

  // Fetch OSINT data from all sources
  async fetchOSINTData() {
    console.log('Starting OSINT data fetch...');
    const results = {
      totalFetched: 0,
      alertsCreated: 0,
      domainsAdded: 0,
      sources: {}
    };

    for (const [sourceKey, source] of Object.entries(this.sources)) {
      try {
        const sourceResult = await this.fetchFromSource(sourceKey, source);
        results.sources[sourceKey] = sourceResult;
        results.totalFetched += sourceResult.fetched || 0;
        results.alertsCreated += sourceResult.alertsCreated || 0;
        results.domainsAdded += sourceResult.domainsAdded || 0;
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.message);
        results.sources[sourceKey] = { error: error.message };
      }
    }

    this.lastFetch = new Date();
    this.fetchCount++;
    
    console.log('OSINT fetch completed:', results);
    return results;
  }

  // Fetch data from a specific source
  async fetchFromSource(sourceKey, source) {
    const result = { fetched: 0, alertsCreated: 0, domainsAdded: 0 };

    try {
      let data;
      
      if (source.enabled && source.url) {
        // Try to fetch from live API
        try {
          const response = await axios.get(source.url, {
            timeout: 30000,
            headers: {
              'User-Agent': 'CyberGuard-OSINT-Fetcher/1.0'
            }
          });
          data = response.data;
        } catch (apiError) {
          console.warn(`API fetch failed for ${source.name}, using fallback`);
          data = await this.loadFallbackData(source.fallback);
        }
      } else {
        // Use fallback data
        data = await this.loadFallbackData(source.fallback);
      }

      // Process data based on source
      switch (sourceKey) {
        case 'phishtank':
          result = await this.processPhishTankData(data);
          break;
        case 'abusech':
          result = await this.processAbuseChData(data);
          break;
        case 'virustotal':
          result = await this.processVirusTotalData(data);
          break;
      }

    } catch (error) {
      throw new Error(`Failed to fetch from ${source.name}: ${error.message}`);
    }

    return result;
  }

  // Load fallback data from local files
  async loadFallbackData(fallbackPath) {
    try {
      const fullPath = path.join(__dirname, '..', '..', fallbackPath);
      const data = await fs.readFile(fullPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.warn(`Fallback data not found: ${fallbackPath}`);
      return [];
    }
  }

  // Process PhishTank data
  async processPhishTankData(data) {
    const result = { fetched: 0, alertsCreated: 0, domainsAdded: 0 };
    
    if (!Array.isArray(data)) return result;

    for (const item of data.slice(0, 10)) { // Limit to 10 items for demo
      if (item.url && item.verified === 'yes') {
        const domain = this.extractDomain(item.url);
        
        // Add to suspicious domains
        const domainResult = await this.addSuspiciousDomain(domain, 'phishing', [
          {
            type: 'suspicious_content',
            description: 'Reported as phishing site by PhishTank',
            confidence: 95
          }
        ]);
        
        if (domainResult.added) result.domainsAdded++;
        
        // Create alert
        const alertResult = await this.createAlert({
          title: `Phishing Site Detected: ${domain}`,
          description: `Domain ${domain} has been reported as a phishing site by PhishTank. URL: ${item.url}`,
          severity: 'high',
          category: 'phishing',
          domain: domain,
          source: 'osint',
          tags: ['phishing', 'phishtank', 'osint']
        });
        
        if (alertResult.created) result.alertsCreated++;
        result.fetched++;
      }
    }

    return result;
  }

  // Process Abuse.ch data
  async processAbuseChData(data) {
    const result = { fetched: 0, alertsCreated: 0, domainsAdded: 0 };
    
    if (typeof data !== 'string') return result;

    const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    for (const line of lines.slice(0, 10)) { // Limit to 10 items for demo
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const url = parts[1];
        const domain = this.extractDomain(url);
        
        // Add to suspicious domains
        const domainResult = await this.addSuspiciousDomain(domain, 'malware', [
          {
            type: 'suspicious_content',
            description: 'Reported as malicious URL by Abuse.ch',
            confidence: 90
          }
        ]);
        
        if (domainResult.added) result.domainsAdded++;
        
        // Create alert
        const alertResult = await this.createAlert({
          title: `Malicious URL Detected: ${domain}`,
          description: `Domain ${domain} has been reported as hosting malicious content by Abuse.ch. URL: ${url}`,
          severity: 'high',
          category: 'malware',
          domain: domain,
          source: 'osint',
          tags: ['malware', 'abuse.ch', 'osint']
        });
        
        if (alertResult.created) result.alertsCreated++;
        result.fetched++;
      }
    }

    return result;
  }

  // Process VirusTotal data (simplified)
  async processVirusTotalData(data) {
    const result = { fetched: 0, alertsCreated: 0, domainsAdded: 0 };
    
    if (!Array.isArray(data)) return result;

    for (const item of data.slice(0, 5)) { // Limit to 5 items for demo
      if (item.domain) {
        // Add to suspicious domains
        const domainResult = await this.addSuspiciousDomain(item.domain, 'suspicious', [
          {
            type: 'suspicious_content',
            description: 'Flagged by VirusTotal analysis',
            confidence: item.detections > 0 ? 80 : 30
          }
        ]);
        
        if (domainResult.added) result.domainsAdded++;
        
        // Create alert if detections found
        if (item.detections > 0) {
          const alertResult = await this.createAlert({
            title: `Suspicious Domain Detected: ${item.domain}`,
            description: `Domain ${item.domain} has been flagged by ${item.detections} security engines on VirusTotal.`,
            severity: item.detections > 5 ? 'high' : 'medium',
            category: 'suspicious_domain',
            domain: item.domain,
            source: 'osint',
            tags: ['virustotal', 'osint', 'suspicious']
          });
          
          if (alertResult.created) result.alertsCreated++;
        }
        
        result.fetched++;
      }
    }

    return result;
  }

  // Add suspicious domain to database
  async addSuspiciousDomain(domain, category, indicators) {
    try {
      const existingDomain = await SuspiciousDomain.findOne({ domain });
      
      if (existingDomain) {
        // Update existing domain
        existingDomain.lastSeen = new Date();
        existingDomain.indicators.push(...indicators);
        await existingDomain.updateRiskScore();
        await existingDomain.save();
        return { added: false, updated: true };
      } else {
        // Create new domain
        const suspiciousDomain = new SuspiciousDomain({
          domain,
          category,
          source: 'osint',
          indicators
        });
        
        await suspiciousDomain.updateRiskScore();
        await suspiciousDomain.save();
        return { added: true, updated: false };
      }
    } catch (error) {
      console.error('Error adding suspicious domain:', error);
      return { added: false, updated: false, error: error.message };
    }
  }

  // Create alert in database
  async createAlert(alertData) {
    try {
      // Check if similar alert already exists
      const existingAlert = await Alert.findOne({
        domain: alertData.domain,
        title: alertData.title,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
      });
      
      if (existingAlert) {
        return { created: false, reason: 'Similar alert already exists' };
      }
      
      // Create new alert (without createdBy since this is system-generated)
      const alert = new Alert({
        ...alertData,
        createdBy: null // System-generated alert
      });
      
      await alert.save();
      return { created: true };
    } catch (error) {
      console.error('Error creating alert:', error);
      return { created: false, error: error.message };
    }
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      // If URL parsing fails, try to extract domain manually
      const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
      return match ? match[1].toLowerCase() : url.toLowerCase();
    }
  }

  // Get fetcher status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastFetch: this.lastFetch,
      fetchCount: this.fetchCount,
      sources: Object.keys(this.sources).map(key => ({
        key,
        name: this.sources[key].name,
        enabled: this.sources[key].enabled
      }))
    };
  }

  // Get sources configuration
  getSources() {
    return this.sources;
  }
}

// Create singleton instance
const osintFetcher = new OSINTFetcher();

module.exports = osintFetcher;
