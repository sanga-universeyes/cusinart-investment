export const formatCurrency = (amount: number, currency: 'ar' | 'usdt' | 'points' = 'ar'): string => {
  if (currency === 'ar') {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  if (currency === 'usdt') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  if (currency === 'points') {
    return `${amount.toLocaleString('fr-MG')} points`;
  }
  
  return amount.toLocaleString('fr-MG');
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-MG').format(number);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const convertCurrency = (
  amount: number,
  fromCurrency: 'ar' | 'usdt',
  toCurrency: 'ar' | 'usdt',
  rates: { arToUsdt: number; usdtToAr: number }
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  if (fromCurrency === 'ar' && toCurrency === 'usdt') {
    return amount * rates.arToUsdt;
  }
  
  if (fromCurrency === 'usdt' && toCurrency === 'ar') {
    return amount * rates.usdtToAr;
  }
  
  return amount;
};