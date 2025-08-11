import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatCurrency } from '../../utils/currency';

export function NotificationBanner() {
  const { notifications } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<typeof notifications>([]);

  useEffect(() => {
    // Afficher seulement les 3 notifications les plus récentes non lues
    const recent = notifications
      .filter(n => !n.read)
      .slice(0, 3);
    setVisibleNotifications(recent);
  }, [notifications]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const removeNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`p-4 rounded-lg border shadow-lg ${getStatusColor(notification.status)}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                {notification.amount && notification.currency && (
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {formatCurrency(notification.amount, notification.currency)}
                  </p>
                )}
                {notification.reference && (
                  <p className="text-xs text-gray-500 mt-1">
                    Réf: {notification.reference}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}