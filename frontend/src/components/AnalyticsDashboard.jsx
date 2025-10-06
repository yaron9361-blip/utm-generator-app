import { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const BACKEND_URL = 'https://yaron9361-blip-utm-backend-d48a.twc1.net';

function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Обновляем каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/analytics/stats`),
        fetch(`${BACKEND_URL}/api/analytics/recent?limit=20`)
      ]);

      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (eventsData.success) setRecentEvents(eventsData.events);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Аналитика</h1>
        <button className="btn-refresh" onClick={loadAnalytics}>
          Обновить
        </button>
      </div>

      {/* Карточки со статистикой */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total_events || 0}</div>
          <div className="stat-label">Всего событий</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats?.unique_sessions || 0}</div>
          <div className="stat-label">Уникальные сессии</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats?.unique_users || 0}</div>
          <div className="stat-label">Пользователи</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats?.events_last_24h || 0}</div>
          <div className="stat-label">За 24 часа</div>
        </div>
      </div>

      {/* События по типам */}
      <div className="section">
        <h2>События по типам</h2>
        <div className="events-types">
          {stats?.events_by_type && Object.entries(stats.events_by_type).map(([type, count]) => (
            <div key={type} className="event-type-row">
              <span className="event-type-name">{type}</span>
              <span className="event-type-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Последние события */}
      <div className="section">
        <h2>Последние события</h2>
        <div className="events-list">
          {recentEvents.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-type">{event.event_type}</div>
              <div className="event-details">
                <span className="event-time">
                  {new Date(event.timestamp).toLocaleString('ru-RU')}
                </span>
                {event.user_id && (
                  <span className="event-user">User: {event.user_id}</span>
                )}
              </div>
              {event.properties && Object.keys(event.properties).length > 0 && (
                <div className="event-props">
                  {JSON.stringify(event.properties)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;