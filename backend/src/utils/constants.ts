// Application constants
export const APP_CONFIG = {
  NAME: 'CUIZ Investment',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plateforme d\'investissement moderne avec système de parrainage',
  AUTHOR: 'CUIZ Team',
  SUPPORT_EMAIL: 'support@cuiz.com',
  SUPPORT_PHONE: '+261 34 12 345 67',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ADMIN_LOGIN: '/admin/login',
  },
  USER: {
    PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    UPDATE_PROFILE: '/user/profile',
  },
  TRANSACTIONS: {
    DEPOSIT: '/transactions/deposit',
    WITHDRAWAL: '/transactions/withdrawal',
    HISTORY: '/transactions/history',
  },
  INVESTMENTS: {
    PLANS: '/investments/plans',
    CREATE: '/investments/create',
    ACTIVE: '/investments/active',
  },
  POINTS: {
    BUY: '/points/buy',
    EXCHANGE: '/points/exchange',
    BALANCE: '/points/balance',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    COMPLETE: '/tasks/:id/complete',
  },
  TEAM: {
    MEMBERS: '/team/members',
    STATS: '/team/stats',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    DEPOSITS: '/admin/deposits',
    WITHDRAWALS: '/admin/withdrawals',
    LOGS: '/admin/logs',
    NOTIFICATIONS: '/admin/notifications',
    REPORTS: '/admin/reports',
  },
};

// Investment plans
export const INVESTMENT_PLANS = [
  {
    id: '1',
    name: 'CUIZ 1',
    description: 'Plan d\'entrée idéal pour débuter vos investissements',
    minAmount: 50000,
    maxAmount: 500000,
    dailyReturn: 3,
    duration: 30,
    totalReturn: 90,
    features: ['Rendement quotidien garanti', 'Support 24/7', 'Retrait flexible'],
    status: 'active'
  },
  {
    id: '2',
    name: 'CUIZ 2',
    description: 'Plan intermédiaire avec des rendements optimisés',
    minAmount: 100000,
    maxAmount: 2000000,
    dailyReturn: 3.5,
    duration: 60,
    totalReturn: 210,
    features: ['Rendement quotidien garanti', 'Support prioritaire', 'Bonus de parrainage'],
    isPopular: true,
    status: 'active'
  },
  {
    id: '3',
    name: 'CUIZ 3',
    description: 'Plan premium pour investisseurs expérimentés',
    minAmount: 500000,
    maxAmount: 10000000,
    dailyReturn: 4,
    duration: 90,
    totalReturn: 360,
    features: ['Rendement quotidien garanti', 'Support VIP', 'Bonus exclusifs', 'Accès prioritaire'],
    isRecommended: true,
    status: 'active'
  },
  {
    id: '4',
    name: 'CUIZ 4',
    description: 'Plan expert avec les meilleurs rendements',
    minAmount: 1000000,
    maxAmount: 50000000,
    dailyReturn: 5,
    duration: 120,
    totalReturn: 600,
    features: ['Rendement quotidien garanti', 'Support dédié', 'Bonus VIP', 'Accès exclusif'],
    status: 'active'
  }
];

// Payment methods
export const PAYMENT_METHODS = {
  MOBILE_MONEY: {
    MVOLA: {
      name: 'MVola',
      code: 'mvola',
      icon: '📱',
      color: '#FF6B35',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    AIRTEL: {
      name: 'Airtel Money',
      code: 'airtel',
      icon: '📱',
      color: '#FF0000',
      minAmount: 1000,
      maxAmount: 1000000,
    },
    ORANGE: {
      name: 'Orange Money',
      code: 'orange',
      icon: '📱',
      color: '#FF6600',
      minAmount: 1000,
      maxAmount: 1000000,
    },
  },
  CRYPTO: {
    USDT: {
      name: 'USDT TRC20',
      code: 'usdt',
      icon: '₮',
      color: '#26A17B',
      minAmount: 1,
      maxAmount: 10000,
    },
  },
};

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  COMMISSION: 'commission',
  BONUS: 'bonus',
  POINTS_EXCHANGE: 'points_exchange',
  POINTS_PURCHASE: 'points_purchase',
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

// User statuses
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

// Task types
export const TASK_TYPES = {
  SOCIAL_MEDIA: 'social_media',
  SURVEY: 'survey',
  REFERRAL: 'referral',
  CONTENT: 'content',
  OTHER: 'other',
};

// Task statuses
export const TASK_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

// Commission rates
export const COMMISSION_RATES = {
  REFERRAL: {
    LEVEL_1: 10, // 10%
    LEVEL_2: 6,  // 6%
    LEVEL_3: 3,  // 3%
  },
  TEAM: {
    LEVEL_1: 6,  // 6%
    LEVEL_2: 3,  // 3%
    LEVEL_3: 1,  // 1%
  },
};

// Points configuration
export const POINTS_CONFIG = {
  EXCHANGE_RATE_INVESTOR: 100, // 1 point = 100 Ar for investors
  EXCHANGE_RATE_NON_INVESTOR: 10, // 1 point = 10 Ar for non-investors
  MIN_PURCHASE: 1,
  MAX_PURCHASE: 10000,
  MIN_EXCHANGE: 1,
  MAX_EXCHANGE: 10000,
};

// Validation rules
export const VALIDATION_RULES = {
  PHONE: /^0[3-9][0-9]{8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  REFERRAL_CODE_LENGTH: 8,
  MIN_DEPOSIT_AMOUNT: 1000,
  MAX_DEPOSIT_AMOUNT: 10000000,
  MIN_WITHDRAWAL_AMOUNT: 5000,
  MIN_INVESTMENT_AMOUNT: 50000,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  UNAUTHORIZED: 'Accès non autorisé. Veuillez vous reconnecter.',
  FORBIDDEN: 'Accès interdit.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos informations.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  INSUFFICIENT_BALANCE: 'Solde insuffisant.',
  INVALID_AMOUNT: 'Montant invalide.',
  INVALID_PHONE: 'Numéro de téléphone invalide.',
  INVALID_EMAIL: 'Adresse email invalide.',
  WEAK_PASSWORD: 'Mot de passe trop faible.',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.',
  INVALID_REFERRAL_CODE: 'Code de parrainage invalide.',
  FILE_TOO_LARGE: 'Fichier trop volumineux.',
  INVALID_FILE_TYPE: 'Type de fichier non supporté.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  REGISTER_SUCCESS: 'Inscription réussie !',
  PROFILE_UPDATED: 'Profil mis à jour avec succès !',
  PASSWORD_CHANGED: 'Mot de passe modifié avec succès !',
  DEPOSIT_SUBMITTED: 'Dépôt soumis avec succès !',
  WITHDRAWAL_SUBMITTED: 'Demande de retrait soumise avec succès !',
  INVESTMENT_CREATED: 'Investissement créé avec succès !',
  POINTS_PURCHASED: 'Points achetés avec succès !',
  POINTS_EXCHANGED: 'Points échangés avec succès !',
  TASK_CREATED: 'Tâche créée avec succès !',
  TASK_COMPLETED: 'Tâche complétée avec succès !',
  FILE_UPLOADED: 'Fichier téléchargé avec succès !',
  SETTINGS_SAVED: 'Paramètres sauvegardés avec succès !',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Log levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

// Log categories
export const LOG_CATEGORIES = {
  SYSTEM: 'system',
  USER: 'user',
  SECURITY: 'security',
  DATABASE: 'database',
  TRANSACTION: 'transaction',
};

// Report periods
export const REPORT_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Export formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#006B76',
  SECONDARY: '#FF6B35',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  LIGHT: '#F9FAFB',
  DARK: '#111827',
};

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
};