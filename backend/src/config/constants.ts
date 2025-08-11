export const EXCHANGE_RATES = {
  AR_TO_USDT: 0.0002, // 1 AR = 0.0002 USDT
  USDT_TO_AR: 5000,   // 1 USDT = 5000 AR
  POINTS_TO_AR_INVESTOR: 100, // 1 point = 100 AR pour investisseurs
  POINTS_TO_AR_NON_INVESTOR: 10, // 1 point = 10 AR pour non-investisseurs
  MIN_WITHDRAWAL_AR: 4800,
  MIN_WITHDRAWAL_USDT: 1,
  WITHDRAWAL_FEE: 0.1, // 10%
  MIN_DEPOSIT_AR: 10000,
  MIN_DEPOSIT_USDT: 2,
  SIGNUP_BONUS_AR: 2000,
  TASK_TIMER_SECONDS: 15
};

export const INVESTMENT_PLANS = [
  {
    id: 'cuiz1',
    name: 'CUIZ 1',
    minAmount: { ar: 10000, usdt: 2 },
    maxAmount: { ar: 400000, usdt: 80 },
    minAddition: { ar: 10000, usdt: 2 },
    dailyReturn: 3,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz2',
    name: 'CUIZ 2',
    minAmount: { ar: 405000, usdt: 81 },
    maxAmount: { ar: 1200000, usdt: 240 },
    minAddition: { ar: 50000, usdt: 10 },
    dailyReturn: 3.5,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz3',
    name: 'CUIZ 3',
    minAmount: { ar: 1205000, usdt: 241 },
    maxAmount: { ar: 2500000, usdt: 500 },
    minAddition: { ar: 100000, usdt: 20 },
    dailyReturn: 4,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz4',
    name: 'CUIZ 4',
    minAmount: { ar: 2505000, usdt: 501 },
    maxAmount: { ar: 3750000, usdt: 750 },
    minAddition: { ar: 100000, usdt: 20 },
    dailyReturn: 4.5,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz5',
    name: 'CUIZ 5',
    minAmount: { ar: 3755000, usdt: 751 },
    maxAmount: { ar: 5000000, usdt: 1000 },
    minAddition: { ar: 100000, usdt: 20 },
    dailyReturn: 4.75,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz6',
    name: 'CUIZ 6',
    minAmount: { ar: 5005000, usdt: 1001 },
    maxAmount: { ar: 7500000, usdt: 1500 },
    minAddition: { ar: 200000, usdt: 40 },
    dailyReturn: 5,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  },
  {
    id: 'cuiz7',
    name: 'CUIZ 7',
    minAmount: { ar: 7505000, usdt: 1501 },
    maxAmount: { ar: 10000000, usdt: 2000 },
    minAddition: { ar: 200000, usdt: 40 },
    dailyReturn: 5.5,
    referralCommission: { level1: 10, level2: 6, level3: 3 },
    teamCommission: { level1: 6, level2: 3, level3: 1 }
  }
];

export const DEFAULT_AGENTS = [
  { id: '1', name: 'Andry', phone: '034 36 953 81', method: 'mvola' as const },
  { id: '2', name: 'Andry', phone: '033 68 556 36', method: 'airtel' as const },
  { id: '3', name: 'Andry', phone: '032 XX XXX XX', method: 'orange' as const },
  { id: '4', name: 'Crypto Wallet', phone: 'TLuPRrRJGWhBAenUwHY7LbR2pxwW8rAhtn', method: 'usdt' as const }
];