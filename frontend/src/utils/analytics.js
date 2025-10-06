const BACKEND_URL = 'https://yaron9361-blip-utm-backend-d48a.twc1.net';

let sessionId = null;

// Генерируем уникальный ID сессии
function getSessionId() {
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Сохраняем в sessionStorage чтобы сессия сохранялась при перезагрузке
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Получаем ID пользователя из Telegram
function getUserId() {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return `tg_${window.Telegram.WebApp.initDataUnsafe.user.id}`;
  }
  return null; // Анонимный пользователь
}

// Основная функция трекинга
export async function trackEvent(eventType, properties = {}) {
  try {
    // Не отправляем в dev режиме (опционально)
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventType, properties);
      return;
    }

    const response = await fetch(`${BACKEND_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        user_id: getUserId(),
        session_id: getSessionId(),
        properties
      })
    });

    if (!response.ok) {
      throw new Error(`Analytics failed: ${response.status}`);
    }
  } catch (error) {
    // Тихо фейлимся - аналитика не должна ломать приложение
    console.warn('Analytics error:', error);
  }
}

// Хелпер для восстановления session_id при загрузке
export function initAnalytics() {
  const savedSessionId = sessionStorage.getItem('analytics_session_id');
  if (savedSessionId) {
    sessionId = savedSessionId;
  }
  trackEvent('app_opened');
}