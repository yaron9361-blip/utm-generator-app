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
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'original_url') {
    // Определяем протокол из вставленной ссылки
    const httpMatch = value.match(/^(https?):\/\//i);
    
    if (httpMatch) {
      const detectedProtocol = httpMatch[1].toLowerCase() + '://';
      const cleanValue = value.replace(/^https?:\/\//i, '');
      
      setFormData(prev => ({
        ...prev,
        protocol: detectedProtocol,
        [name]: cleanValue
      }));
      return;
    }
    
    // Если протокола нет, просто сохраняем значение
    setFormData(prev => ({ ...prev, [name]: value }));
    return;
  }
  
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({ ...prev, ...template.params }));
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://yaron9361-blip-utm-backend-d48a.twc1.net/api/utm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          original_url: formData.original_url.startsWith('http') 
            ? formData.original_url 
            : formData.protocol + formData.original_url
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      }
    } catch (err) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Ошибка создания метки');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    });
  };

  const shareToTelegram = () => {
    if (window.Telegram?.WebApp && result) {
      const text = `Моя UTM-ссылка:\n${result.short_url}`;
      window.Telegram.WebApp.shareMessage(text);
    }
  };

  const downloadQRCode = async (qrUrl) => {
  try {
    // Загружаем изображение через fetch
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    
    // Создаём Object URL
    const blobUrl = URL.createObjectURL(blob);
    
    // Создаём временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `utm-qrcode-${Date.now()}.png`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Очистка
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      window.Telegram.WebApp.showPopup({
        message: 'QR-код сохранён в загрузки'
      });
    }
  } catch (error) {
    console.error('Download failed:', error);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('Ошибка сохранения QR-кода');
    }
  }
};

const shareQRCode = async (qrUrl) => {
  try {
    // Загружаем изображение
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const file = new File([blob], 'utm-qrcode.png', { type: 'image/png' });
    
    // Проверяем поддержку Web Share API
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'UTM QR-код',
        text: 'Сканируй QR-код для перехода по ссылке'
      });
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } else {
      // Fallback - сохраняем и показываем уведомление
      await downloadQRCode(qrUrl);
    }
  } catch (error) {
    // Если пользователь отменил отправку - не ошибка
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error);
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Не удалось отправить. QR-код будет сохранён.');
      }
      
      await downloadQRCode(qrUrl);
    }
  }
};

  const reset = () => {
    setFormData({
      protocol: 'https://',
      original_url: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
    });
    setResult(null);
  };

  return (
    <div className="app">
      <div className="container">
        
        {!result ? (
          <>
            <div className="header">
              <h1>Быстрые UTM-метки</h1>
              <p>Шаблоны для популярных платформ</p>
            </div>

            <div className="templates">
              {utmTemplates.slice(0, 6).map(t => (
                <button 
                  key={t.id}
                  className="template-btn"
                  onClick={() => applyTemplate(t)}
                  type="button"
                >
                  <span className="template-icon">{t.icon}</span>
                  <span className="template-text">{t.name}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="input-group">
                <label>Ссылка</label>
                <div className="url-input">
                  <select 
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleInputChange}
                  >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </select>
                  <input
                    type="text"
                    name="original_url"
                    value={formData.original_url}
                    onChange={handleInputChange}
                    placeholder="your-site.com"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Источник <span className="hint">откуда пришли</span></label>
                <input
                  type="text"
                  name="utm_source"
                  value={formData.utm_source}
                  onChange={handleInputChange}
                  placeholder="telegram"
                  required
                />
              </div>

              <div className="input-group">
                <label>Тип <span className="hint">канал трафика</span></label>
                <input
                  type="text"
                  name="utm_medium"
                  value={formData.utm_medium}
                  onChange={handleInputChange}
                  placeholder="social"
                  required
                />
              </div>

              <div className="input-group">
                <label>Кампания <span className="hint">название акции</span></label>
                <input
                  type="text"
                  name="utm_campaign"
                  value={formData.utm_campaign}
                  onChange={handleInputChange}
                  placeholder="black_friday"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Создаём...' : 'Создать метку'}
              </button>
            </form>
          </>
        ) : (
          <div className="result">
            <div className="result-header">
              <h2>Готово</h2>
              <button className="btn-reset" onClick={reset}>Создать ещё</button>
            </div>

            <div className="result-card">
              <div className="result-label">Короткая ссылка</div>
              <div className="result-url">{result.short_url}</div>
              <div className="result-actions">
                <button 
                  className="btn-copy"
                  onClick={() => copyToClipboard(result.short_url)}
                >
                  {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
                <button 
                  className="btn-share"
                  onClick={shareToTelegram}
                >
                  Отправить
                </button>
              </div>
            </div>

            <details className="result-details">
              <summary>Полная ссылка</summary>
              <div className="result-full">{result.full_url}</div>
              <button 
                className="btn-copy-small"
                onClick={() => copyToClipboard(result.full_url)}
              >
                Копировать
              </button>
            </details>
            {result.qr_code && (
              <div className="result-card qr-card">
                <div className="result-label">QR-код</div>
                <div className="qr-image-wrapper">
                  <img src={result.qr_code} alt="QR Code" className="qr-image" />
                </div>
                <div className="result-actions">
                  <button 
                    className="btn-copy"
                    onClick={() => downloadQRCode(result.qr_code)}
                  >
                    Сохранить
                  </button>
                  <button 
                    className="btn-share"
                    onClick={() => shareQRCode(result.qr_code)}
                  >
                    Отправить
                  </button>
                </div>
              </div>
)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;