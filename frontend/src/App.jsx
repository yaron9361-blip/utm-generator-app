import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    original_url: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Применяем тему Telegram
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.buttonColor);
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/utm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
        
        // Вибрация при успехе (если в Telegram)
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      } else {
        throw new Error(data.error || 'Ошибка создания UTM-метки');
      }
    } catch (err) {
      setError(err.message);
      
      // Вибрация при ошибке
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          message: 'Скопировано в буфер обмена!',
        });
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      } else {
        alert('Скопировано!');
      }
    });
  };

  const resetForm = () => {
    setFormData({
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
          <h1>🔗 UTM Generator</h1>
          <p>Создай UTM-метку за 30 секунд</p>
        </header>

        {!result ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="original_url">Ссылка *</label>
              <input
                type="url"
                id="original_url"
                name="original_url"
                value={formData.original_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="utm_source">Source (откуда) *</label>
              <input
                type="text"
                id="utm_source"
                name="utm_source"
                value={formData.utm_source}
                onChange={handleInputChange}
                placeholder="telegram, instagram, email"
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
                placeholder="social, cpc, email"
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
                placeholder="spring_sale"
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
                ⚠️ {error}
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