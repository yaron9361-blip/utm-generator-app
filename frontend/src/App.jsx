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

  const downloadQRCode = async (qrUrl) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = qrUrl;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (window.Telegram?.WebApp) {
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `utm-qr-${Date.now()}.png`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          
          window.Telegram.WebApp.showPopup({
            message: 'QR-код сохранён. Проверьте загрузки или галерею.'
          });
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        } else {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `utm-qr-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(blobUrl);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Download failed:', error);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Не удалось сохранить. Сделайте скриншот QR-кода.');
      }
    }
  };

  const shareQRCode = async (qrUrl) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = qrUrl;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });
      
      const file = new File([blob], 'utm-qrcode.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'UTM QR-код'
        });
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      } else {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showPopup({
            message: 'Отправка недоступна. QR-код будет сохранён - отправьте его из галереи.',
            buttons: [{type: 'ok'}]
          });
        }
        
        await downloadQRCode(qrUrl);
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Share failed:', error);
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          message: 'Не удалось отправить. QR-код будет сохранён.',
          buttons: [{type: 'ok'}]
        });
      }
      
      await downloadQRCode(qrUrl);
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
              <p>Создай за 15 секунд</p>
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

              <div className="templates-container">
              <div className="templates-scroll">
                {utmTemplates.map(t => (
                  <button 
                    key={t.id}
                    className="template-card-large"
                    onClick={() => applyTemplate(t)}
                    type="button"
                  >
                    <div className="template-icon-large">{t.icon}</div>
                    <div className="template-info">
                      <div className="template-platform">{t.category}</div>
                      <div className="template-format">{t.name}</div>
                    </div>
                  </button>
                ))}
              </div>
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
              <div className="result-label">Полная ссылка</div>
              <div className="result-url">{result.full_url}</div>
              <button 
                className="btn-copy-full"
                onClick={() => copyToClipboard(result.full_url)}
              >
                Копировать
              </button>
            </div>

            <div className="result-card result-card-short">
              <div className="result-label">Короткая ссылка</div>
              <div className="result-short-wrapper">
                <div className="result-url">{result.short_url}</div>
                <button 
                  className="btn-copy-inline"
                  onClick={() => copyToClipboard(result.short_url)}
                >
                  Копировать
                </button>
              </div>
            </div>

            {result.qr_code && (
              <div className="result-card qr-card">
                <div className="result-label">QR-код</div>
                <p className="qr-hint">Долгое нажатие → Сохранить изображение</p>
                <div className="qr-image-wrapper">
                  <img src={result.qr_code} alt="QR Code" className="qr-image" />
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