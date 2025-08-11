export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validate(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push('Ce champ est requis');
      return { isValid: false, errors };
    }

    if (!value || value.toString().trim() === '') {
      return { isValid: true, errors: [] };
    }

    const stringValue = value.toString();

    // Min length validation
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} caractères requis`);
    }

    // Max length validation
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} caractères autorisés`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      errors.push('Format invalide');
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateForm(data: Record<string, any>, schema: Record<string, ValidationRule>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    for (const [field, rules] of Object.entries(schema)) {
      results[field] = this.validate(data[field], rules);
    }

    return results;
  }

  static isFormValid(results: Record<string, ValidationResult>): boolean {
    return Object.values(results).every(result => result.isValid);
  }

  static getFormErrors(results: Record<string, ValidationResult>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    for (const [field, result] of Object.entries(results)) {
      if (!result.isValid) {
        errors[field] = result.errors;
      }
    }

    return errors;
  }
}

// Validation schemas
export const validationSchemas = {
  login: {
    phone: {
      required: true,
      pattern: /^0[3-9][0-9]{8}$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  },

  register: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    phone: {
      required: true,
      pattern: /^0[3-9][0-9]{8}$/,
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value: string) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
          return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
        }
        return null;
      },
    },
    confirmPassword: {
      required: true,
    },
    referralCode: {
      required: true,
      minLength: 6,
      maxLength: 10,
    },
  },

  deposit: {
    amount: {
      required: true,
      custom: (value: number) => {
        if (value < 1000) {
          return 'Le montant minimum est de 1,000 Ar';
        }
        if (value > 10000000) {
          return 'Le montant maximum est de 10,000,000 Ar';
        }
        return null;
      },
    },
    method: {
      required: true,
    },
  },

  withdrawal: {
    amount: {
      required: true,
      custom: (value: number) => {
        if (value < 5000) {
          return 'Le montant minimum est de 5,000 Ar';
        }
        return null;
      },
    },
    method: {
      required: true,
    },
    accountDetails: {
      required: true,
      minLength: 5,
    },
    withdrawalPassword: {
      required: true,
      minLength: 4,
    },
  },

  investment: {
    amount: {
      required: true,
      custom: (value: number) => {
        if (value < 50000) {
          return 'Le montant minimum est de 50,000 Ar';
        }
        return null;
      },
    },
  },

  points: {
    amount: {
      required: true,
      custom: (value: number) => {
        if (value < 1) {
          return 'Le nombre minimum de points est 1';
        }
        if (value > 10000) {
          return 'Le nombre maximum de points est 10,000';
        }
        return null;
      },
    },
  },

  task: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
    points: {
      required: true,
      custom: (value: number) => {
        if (value < 1) {
          return 'Le nombre minimum de points est 1';
        }
        if (value > 1000) {
          return 'Le nombre maximum de points est 1,000';
        }
        return null;
      },
    },
  },

  profile: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      required: true,
      pattern: /^0[3-9][0-9]{8}$/,
    },
  },
};

// Utility functions
export const validatePhone = (phone: string): boolean => {
  return /^0[3-9][0-9]{8}$/.test(phone);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule');
  }
  if (!/\d/.test(password)) {
    errors.push('Au moins un chiffre');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Au moins un caractère spécial');
  }
  
  return errors;
};

export const validateAmount = (amount: number, currency: 'ar' | 'usdt'): string | null => {
  if (currency === 'ar') {
    if (amount < 1000) return 'Montant minimum: 1,000 Ar';
    if (amount > 10000000) return 'Montant maximum: 10,000,000 Ar';
  } else {
    if (amount < 1) return 'Montant minimum: 1 USDT';
    if (amount > 10000) return 'Montant maximum: 10,000 USDT';
  }
  return null;
};