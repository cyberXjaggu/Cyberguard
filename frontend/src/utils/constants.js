// Severity levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Alert categories
export const ALERT_CATEGORIES = {
  PHISHING: 'phishing',
  MALWARE: 'malware',
  SUSPICIOUS_DOMAIN: 'suspicious_domain',
  DATA_BREACH: 'data_breach',
  VULNERABILITY: 'vulnerability',
  OTHER: 'other'
};

// Alert statuses
export const ALERT_STATUSES = {
  NEW: 'new',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false_positive'
};

// Domain categories
export const DOMAIN_CATEGORIES = {
  PHISHING: 'phishing',
  MALWARE: 'malware',
  SPAM: 'spam',
  SUSPICIOUS: 'suspicious',
  UNKNOWN: 'unknown'
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Indicator types
export const INDICATOR_TYPES = {
  TYPOSQUATTING: 'typosquatting',
  SUSPICIOUS_TLD: 'suspicious_tld',
  RECENT_REGISTRATION: 'recent_registration',
  NO_SSL: 'no_ssl',
  SUSPICIOUS_CONTENT: 'suspicious_content',
  BLACKLISTED_IP: 'blacklisted_ip',
  OTHER: 'other'
};

// Color mappings
export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.LOW]: 'success',
  [SEVERITY_LEVELS.MEDIUM]: 'primary',
  [SEVERITY_LEVELS.HIGH]: 'warning',
  [SEVERITY_LEVELS.CRITICAL]: 'danger'
};

export const STATUS_COLORS = {
  [ALERT_STATUSES.NEW]: 'blue',
  [ALERT_STATUSES.INVESTIGATING]: 'yellow',
  [ALERT_STATUSES.RESOLVED]: 'green',
  [ALERT_STATUSES.FALSE_POSITIVE]: 'gray'
};

export const RISK_COLORS = {
  [RISK_LEVELS.LOW]: 'success',
  [RISK_LEVELS.MEDIUM]: 'primary',
  [RISK_LEVELS.HIGH]: 'warning',
  [RISK_LEVELS.CRITICAL]: 'danger'
};

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm:ss'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },
  ALERTS: {
    LIST: '/alerts',
    CREATE: '/alerts',
    UPDATE: '/alerts',
    DELETE: '/alerts',
    STATS: '/alerts/stats'
  },
  DOMAINS: {
    LIST: '/domains',
    CHECK: '/domains/check',
    CREATE: '/domains',
    UPDATE: '/domains',
    DELETE: '/domains',
    STATS: '/domains/stats'
  },
  OSINT: {
    FETCH: '/osint/fetch',
    STATUS: '/osint/status',
    SOURCES: '/osint/sources'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  SETTINGS: 'settings'
};

// Demo data
export const DEMO_CREDENTIALS = {
  EMAIL: 'admin@cyberguard.com',
  PASSWORD: 'admin123'
};

// App configuration
export const APP_CONFIG = {
  NAME: 'CyberGuard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Threat Detection & Domain Analysis Platform',
  AUTHOR: 'CyberGuard Team',
  REPO_URL: 'https://github.com/cyberguard/cyberguard'
};
