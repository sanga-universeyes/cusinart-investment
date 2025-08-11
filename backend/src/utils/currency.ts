import { EXCHANGE_RATES } from '../config/constants';

export function convertArToUsdt(amountAr: number): number {
  return Math.round((amountAr * EXCHANGE_RATES.AR_TO_USDT) * 100) / 100;
}

export function convertUsdtToAr(amountUsdt: number): number {
  return Math.round(amountUsdt * EXCHANGE_RATES.USDT_TO_AR);
}

export function formatCurrency(amount: number, currency: 'ar' | 'usdt' | 'points'): string {
  switch (currency) {
    case 'ar':
      return `${amount.toLocaleString()} Ar`;
    case 'usdt':
      return `${amount.toFixed(2)} USDT`;
    case 'points':
      return `${amount.toLocaleString()} pts`;
    default:
      return amount.toString();
  }
}

export function convertPointsToAr(points: number, isInvestor: boolean = false): number {
  const rate = isInvestor ? EXCHANGE_RATES.POINTS_TO_AR_INVESTOR : EXCHANGE_RATES.POINTS_TO_AR_NON_INVESTOR;
  return Math.round(points * rate);
}

export function convertPointsToUsdt(points: number, isInvestor: boolean = false): number {
  const arAmount = convertPointsToAr(points, isInvestor);
  return convertArToUsdt(arAmount);
}

export function calculateWithdrawalAmount(amount: number): { net: number; fee: number } {
  const fee = amount * EXCHANGE_RATES.WITHDRAWAL_FEE;
  const net = amount - fee;
  return { net, fee };
}

export function validateAmount(amount: number, type: 'deposit' | 'withdrawal', currency: 'ar' | 'usdt'): boolean {
  if (type === 'deposit') {
    const minAmount = currency === 'ar' ? EXCHANGE_RATES.MIN_DEPOSIT_AR : EXCHANGE_RATES.MIN_DEPOSIT_USDT;
    return amount >= minAmount;
  } else {
    const minAmount = currency === 'ar' ? EXCHANGE_RATES.MIN_WITHDRAWAL_AR : EXCHANGE_RATES.MIN_WITHDRAWAL_USDT;
    return amount >= minAmount;
  }
}