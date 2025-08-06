import { Commission } from '../types';

// Configuration des commissions par niveau
export const COMMISSION_CONFIG = {
  referral: {
    level1: 10, // 10%
    level2: 6,  // 6%
    level3: 3   // 3%
  },
  team: {
    level1: 6,  // 6%
    level2: 3,  // 3%
    level3: 1   // 1%
  }
};

/**
 * Calcule les commissions de parrainage pour un investissement
 */
export function calculateReferralCommissions(
  investmentAmount: number,
  currency: 'ar' | 'usdt',
  referralChain: string[]
): Array<{ userId: string; level: number; amount: number; percentage: number }> {
  const commissions = [];
  
  referralChain.forEach((userId, index) => {
    const level = index + 1;
    let percentage = 0;
    
    switch (level) {
      case 1:
        percentage = COMMISSION_CONFIG.referral.level1;
        break;
      case 2:
        percentage = COMMISSION_CONFIG.referral.level2;
        break;
      case 3:
        percentage = COMMISSION_CONFIG.referral.level3;
        break;
      default:
        return; // Pas de commission au-delà du niveau 3
    }
    
    const amount = (investmentAmount * percentage) / 100;
    
    commissions.push({
      userId,
      level,
      amount,
      percentage
    });
  });
  
  return commissions;
}

/**
 * Calcule les commissions d'équipe
 */
export function calculateTeamCommissions(
  investmentAmount: number,
  currency: 'ar' | 'usdt',
  teamLeaders: Array<{ userId: string; level: number }>
): Array<{ userId: string; level: number; amount: number; percentage: number }> {
  const commissions = [];
  
  teamLeaders.forEach(({ userId, level }) => {
    let percentage = 0;
    
    switch (level) {
      case 1:
        percentage = COMMISSION_CONFIG.team.level1;
        break;
      case 2:
        percentage = COMMISSION_CONFIG.team.level2;
        break;
      case 3:
        percentage = COMMISSION_CONFIG.team.level3;
        break;
      default:
        return;
    }
    
    const amount = (investmentAmount * percentage) / 100;
    
    commissions.push({
      userId,
      level,
      amount,
      percentage
    });
  });
  
  return commissions;
}