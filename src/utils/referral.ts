/**
 * Génère un code de parrainage à partir d'un numéro WhatsApp
 * Extrait les 6 derniers chiffres du numéro et génère USR_XXXXXX
 */
export function generateReferralCode(phoneNumber: string): string {
  // Nettoie le numéro (enlève espaces, tirets, etc.)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Prend les 6 derniers chiffres
  const lastSixDigits = cleanPhone.slice(-6);
  
  // Si moins de 6 chiffres, complète avec des 0
  const baseCode = lastSixDigits.padStart(6, '0');
  
  // Format USR_XXXXXX
  return `USR_${baseCode}`;
}

/**
 * Vérifie l'unicité du code de parrainage
 * En cas de collision, ajoute un suffixe
 */
export function ensureUniqueReferralCode(baseCode: string, existingCodes: string[]): string {
  let uniqueCode = baseCode;
  let suffix = 1;
  
  while (existingCodes.includes(uniqueCode)) {
    // Ajoute une lettre ou un chiffre
    const suffixChar = suffix <= 9 ? suffix.toString() : String.fromCharCode(65 + (suffix - 10));
    uniqueCode = `${baseCode.slice(0, -1)}${suffixChar}`;
    suffix++;
  }
  
  return uniqueCode;
}

/**
 * Génère le lien de parrainage complet
 */
export function generateReferralLink(referralCode: string, baseUrl: string = window.location.origin): string {
  return `${baseUrl}/register?ref=${referralCode}`;
}

/**
 * Valide un numéro de téléphone malgache/international
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Formats acceptés:
  // - Madagascar: 032XXXXXXX, 033XXXXXXX, 034XXXXXXX, 038XXXXXXX (10 chiffres)
  // - International: +261XXXXXXXXX (12 chiffres avec indicatif)
  
  if (cleanPhone.length === 10) {
    return /^(032|033|034|038)/.test(cleanPhone);
  }
  
  if (cleanPhone.length === 12) {
    return /^261(32|33|34|38)/.test(cleanPhone);
  }
  
  return false;
}