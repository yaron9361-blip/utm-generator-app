import { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const BACKEND_URL = 'https://yaron9361-blip-utm-backend-d48a.twc1.net';

function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [funnelGroupBy, setFunnelGroupBy] = useState('sessions'); // sessions или users

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [funnelGroupBy]);

  const loadAnalytics = async () => {
    try {
      const [statsRes, funnelRes, eventsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/analytics/stats`),
        fetch(`${BACKEND_URL}/api/analytics/funnel?group_by=${funnelGroupBy}`),
        fetch(`${BACKEND_URL}/api/analytics/recent?limit=20`)
      ]);

      const statsData = await statsRes.json();
      const funnelData = await funnelRes.json();
      const eventsData = await eventsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (funnelData.success) setFunnel(funnelData.funnel);
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

      {/* Воронка конверсии с переключателем */}
      <div className="section">
        <div className="section-header">
          <h2>Воронка конверсии</h2>
          <div className="funnel-toggle">
            <button 
              className={`toggle-btn ${funnelGroupBy === 'sessions' ? 'active' : ''}`}
              onClick={() => setFunnelGroupBy('sessions')}
            >
              По сессиям
            </button>
            <button 
              className={`toggle-btn ${funnelGroupBy === 'users' ? 'active' : ''}`}
              onClick={() => setFunnelGroupBy('users')}
            >
              По юзерам
            </button>
          </div>
        </div>

        {funnel && (
          <div className="funnel">
            <div className="funnel-step">
              <div className="funnel-bar" style={{ width: '100%' }}>
                <span className="funnel-label">Открыли приложение</span>
                <span className="funnel-value">{funnel.opened}</span>
              </div>
            </div>
            
            <div className="funnel-step">
              <div className="funnel-bar" style={{ 
                width: `${Math.max((funnel.template_selected / funnel.opened) * 100, 15)}%`,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }}>
                <span className="funnel-label">Выбрали шаблон</span>
                <span className="funnel-value">{funnel.template_selected}</span>
              </div>
            </div>
            
            <div className="funnel-step">
              <div className="funnel-bar" style={{ 
                width: `${Math.max((funnel.generated / funnel.opened) * 100, 15)}%`,
                background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <span className="funnel-label">Создали метку</span>
                <span className="funnel-value">{funnel.generated}</span>
              </div>
              <div className="funnel-conversion">
                Конверсия от открытия: {funnel.conversion_to_generated}%
              </div>
            </div>
            
            <div className="funnel-step">
              <div className="funnel-bar" style={{ 
                width: `${Math.max((funnel.copied / funnel.opened) * 100, 15)}%`,
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
              }}>
                <span className="funnel-label">Скопировали ссылку</span>
                <span className="funnel-value">{funnel.copied}</span>
              </div>
              <div className="funnel-conversion">
                Конверсия от создания: {funnel.conversion_to_copied}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* События по типам */}
      <div className="section">
        <h2>События по типам</h2>
        <div className="events-types">
          {stats?.events_by_type && Object.entries(stats.events_by_type)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
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