export class StorageService {
  private static instance: StorageService;
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic methods
  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return defaultValue || null;
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  // Auth specific methods
  setAuthToken(token: string): void {
    this.set('authToken', token);
  }

  getAuthToken(): string | null {
    return this.get<string>('authToken');
  }

  removeAuthToken(): void {
    this.remove('authToken');
  }

  setUser(user: any): void {
    this.set('user', user);
  }

  getUser(): any {
    return this.get('user');
  }

  removeUser(): void {
    this.remove('user');
  }

  // Admin specific methods
  setAdminToken(token: string): void {
    this.set('adminToken', token);
  }

  getAdminToken(): string | null {
    return this.get<string>('adminToken');
  }

  removeAdminToken(): void {
    this.remove('adminToken');
  }

  setAdmin(admin: any): void {
    this.set('admin', admin);
  }

  getAdmin(): any {
    return this.get('admin');
  }

  removeAdmin(): void {
    this.remove('admin');
  }

  // Settings specific methods
  setLanguage(language: string): void {
    this.set('language', language);
  }

  getLanguage(): string {
    return this.get<string>('language', 'fr');
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.set('theme', theme);
  }

  getTheme(): 'light' | 'dark' {
    return this.get<'light' | 'dark'>('theme', 'light');
  }

  // Cache specific methods
  setCache<T>(key: string, value: T, ttl: number = 3600000): void {
    const cacheItem = {
      value,
      timestamp: Date.now(),
      ttl
    };
    this.set(`cache_${key}`, cacheItem);
  }

  getCache<T>(key: string): T | null {
    const cacheItem = this.get<{ value: T; timestamp: number; ttl: number }>(`cache_${key}`);
    
    if (!cacheItem) {
      return null;
    }

    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;
    if (isExpired) {
      this.remove(`cache_${key}`);
      return null;
    }

    return cacheItem.value;
  }

  clearCache(): void {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        this.remove(key);
      }
    });
  }

  // Form data methods
  saveFormData(formName: string, data: any): void {
    this.set(`form_${formName}`, data);
  }

  getFormData(formName: string): any {
    return this.get(`form_${formName}`);
  }

  clearFormData(formName: string): void {
    this.remove(`form_${formName}`);
  }

  // Notification methods
  setNotifications(notifications: any[]): void {
    this.set('notifications', notifications);
  }

  getNotifications(): any[] {
    return this.get<any[]>('notifications', []);
  }

  addNotification(notification: any): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    this.setNotifications(notifications);
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.setNotifications(notifications);
    }
  }

  // Preferences methods
  setPreferences(preferences: any): void {
    this.set('preferences', preferences);
  }

  getPreferences(): any {
    return this.get('preferences', {});
  }

  updatePreference(key: string, value: any): void {
    const preferences = this.getPreferences();
    preferences[key] = value;
    this.setPreferences(preferences);
  }

  // Session methods
  setSessionData(key: string, value: any): void {
    this.set(`session_${key}`, value);
  }

  getSessionData(key: string): any {
    return this.get(`session_${key}`);
  }

  clearSessionData(key: string): void {
    this.remove(`session_${key}`);
  }

  clearAllSessionData(): void {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith('session_')) {
        this.remove(key);
      }
    });
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();