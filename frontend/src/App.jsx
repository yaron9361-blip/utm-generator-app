import { useState, useEffect } from 'react';
import './App.css';
import { utmTemplates } from './utmTemplates';

function App() {
  const [formData, setFormData] = useState({
    protocol: 'https://',
    original_url: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.buttonColor);
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'original_url') {
      // Удаляем протокол если пользователь его вставил
      const cleanValue = value.replace(/^https?:\/\//i, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      ...template.params
    }));
    setShowTemplates(false);
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000);

    try {
      const response = await fetch('https://yaron9361-blip-utm-backend-d48a.twc1.net/api/utm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          original_url: formData.original_url.startsWith('http') 
            ? formData.original_url 
            : formData.protocol + formData.original_url
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
        setError(null);
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      } else {
        throw new Error(data.error || 'Ошибка создания UTM-метки');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Превышено время ожидания. Попробуйте ещё раз.');
      } else {
        setError(err.message);
      }
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          message: 'Скопировано!',
        });
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      } else {
        alert('Скопировано!');
      }
    });
  };

  const resetForm = () => {
    setFormData({
      protocol: 'https://',
      original_url: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>⚡️ Быстрые UTM-метки</h1>
          <p>Создай за 15 секунд</p>
        </header>

        {!result && (
          <button 
            type="button"
            className="btn btn-templates"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            📋 {showTemplates ? 'Скрыть шаблоны' : 'Выбрать из шаблона'}
          </button>
        )}

        {showTemplates && !result && (
          <div className="templates-grid">
            {utmTemplates.map(template => (
              <div 
                key={template.id}
                className="template-card"
                onClick={() => applyTemplate(template)}
              >
                <span className="template-icon">{template.icon}</span>
                <span className="template-name">{template.name}</span>
              </div>
            ))}
          </div>
        )}

        {!result ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="original_url">Ссылка *</label>
              <div className="url-input-wrapper">
                <select 
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleInputChange}
                    className="protocol-select"
                  >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </select>
                <input
                  type="text"
                  id="original_url"
                  name="original_url"
                  value={formData.original_url}
                  onChange={handleInputChange}
                  placeholder="your-site.com/promo"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="utm_source">Source (откуда) *</label>
              <input
                type="text"
                id="utm_source"
                name="utm_source"
                value={formData.utm_source}
                onChange={handleInputChange}
                placeholder="telegram, instagram, vk"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="utm_medium">Medium (тип) *</label>
              <input
                type="text"
                id="utm_medium"
                name="utm_medium"
                value={formData.utm_medium}
                onChange={handleInputChange}
                placeholder="stories, post, ad"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="utm_campaign">Campaign (кампания) *</label>
              <input
                type="text"
                id="utm_campaign"
                name="utm_campaign"
                value={formData.utm_campaign}
                onChange={handleInputChange}
                placeholder="black_friday, new_product"
                required
              />
            </div>

            <details className="additional">
              <summary>Дополнительные параметры</summary>
              
              <div className="form-group">
                <label htmlFor="utm_term">Term (ключевое слово)</label>
                <input
                  type="text"
                  id="utm_term"
                  name="utm_term"
                  value={formData.utm_term}
                  onChange={handleInputChange}
                  placeholder="running+shoes"
                />
              </div>

              <div className="form-group">
                <label htmlFor="utm_content">Content (вариант)</label>
                <input
                  type="text"
                  id="utm_content"
                  name="utm_content"
                  value={formData.utm_content}
                  onChange={handleInputChange}
                  placeholder="banner_v1"
                />
              </div>
            </details>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Создаём...' : 'Создать UTM-метку'}
            </button>
          </form>
        ) : (
          <div className="result">
            <div className="result-header">
              <h2>✅ Метка создана!</h2>
            </div>

            <div className="result-item">
              <label>Полная ссылка</label>
              <div className="result-value">
                <code>{result.full_url}</code>
                <button 
                  className="btn btn-copy"
                  onClick={() => copyToClipboard(result.full_url)}
                >
                  Копировать
                </button>
              </div>
            </div>

            <div className="result-item">
              <label>Короткая ссылка</label>
              <div className="result-value">
                <code>{result.short_url}</code>
                <button 
                  className="btn btn-copy"
                  onClick={() => copyToClipboard(result.short_url)}
                >
                  Копировать
                </button>
              </div>
            </div>

            {result.qr_code && (
              <div className="result-item">
                <label>QR-код</label>
                <div className="qr-code">
                  <img src={result.qr_code} alt="QR Code" />
                </div>
              </div>
            )}

            <div className="result-actions">
              <button 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Создать ещё
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;