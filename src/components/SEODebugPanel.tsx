/**
 * SEO Debug Panel - Hiển thị thông tin SEO từ API
 * Giúp debug favicon và meta tags
 */

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const SEODebugPanel = () => {
  const { logoUrl, faviconUrl, seo, loading } = useTheme();
  const { locale } = useLanguage();
  
  // Chỉ hiển thị trong dev mode
  if (import.meta.env.PROD) return null;
  
  const seoData = seo?.[locale];
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.95)',
        color: '#fff',
        padding: '20px',
        borderRadius: '12px',
        fontSize: '13px',
        maxWidth: '400px',
        zIndex: 99999,
        fontFamily: 'monospace',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>
        🔍 SEO Debug Panel
      </h3>
      
      {loading && (
        <div style={{ color: '#fbbf24', marginBottom: '10px' }}>⏳ Loading API data...</div>
      )}
      
      <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #444' }}>
        <strong style={{ color: '#60a5fa' }}>Favicon:</strong>
        {faviconUrl ? (
          <div style={{ marginTop: '8px' }}>
            <div style={{ color: '#10b981', marginBottom: '5px' }}>✅ Có URL</div>
            <a 
              href={faviconUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', wordBreak: 'break-all', fontSize: '11px' }}
            >
              {faviconUrl}
            </a>
            <div style={{ marginTop: '8px' }}>
              <img 
                src={faviconUrl} 
                alt="favicon" 
                style={{ width: '32px', height: '32px', border: '1px solid #444' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.border = '2px solid #ef4444';
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ color: '#ef4444', marginTop: '5px' }}>❌ Không có favicon URL</div>
        )}
      </div>
      
      <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #444' }}>
        <strong style={{ color: '#60a5fa' }}>Logo (OG Image):</strong>
        {logoUrl ? (
          <div style={{ marginTop: '8px' }}>
            <div style={{ color: '#10b981', marginBottom: '5px' }}>✅ Có URL</div>
            <a 
              href={logoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', wordBreak: 'break-all', fontSize: '11px' }}
            >
              {logoUrl}
            </a>
            <div style={{ marginTop: '8px' }}>
              <img 
                src={logoUrl} 
                alt="logo" 
                style={{ maxWidth: '150px', maxHeight: '100px', border: '1px solid #444' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.border = '2px solid #ef4444';
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ color: '#ef4444', marginTop: '5px' }}>❌ Không có logo URL</div>
        )}
      </div>
      
      <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #444' }}>
        <strong style={{ color: '#60a5fa' }}>SEO Data (locale: {locale}):</strong>
        {seoData ? (
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Title:</strong>
              <div style={{ color: seoData.meta_title ? '#10b981' : '#ef4444', marginTop: '3px' }}>
                {seoData.meta_title || '❌ Không có'}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Description:</strong>
              <div style={{ color: seoData.meta_description ? '#10b981' : '#ef4444', marginTop: '3px' }}>
                {seoData.meta_description ? 
                  `${seoData.meta_description.substring(0, 80)}...` : 
                  '❌ Không có'}
              </div>
            </div>
            <div>
              <strong>Keywords:</strong>
              <div style={{ color: seoData.meta_keywords ? '#10b981' : '#ef4444', marginTop: '3px' }}>
                {seoData.meta_keywords || '❌ Không có'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#ef4444', marginTop: '5px' }}>❌ Không có SEO data cho locale này</div>
        )}
      </div>
      
      <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #444' }}>
        <strong style={{ color: '#60a5fa' }}>Raw API Data:</strong>
        <div style={{ marginTop: '8px', fontSize: '11px', background: '#1a1a1a', padding: '10px', borderRadius: '6px', overflow: 'auto', maxHeight: '200px' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify({ 
              seo, 
              logoUrl, 
              faviconUrl 
            }, null, 2)}
          </pre>
        </div>
      </div>
      
      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
        💡 <strong>Cách test:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Check favicon trên tab browser</li>
          <li>Share link lên Zalo để xem preview</li>
          <li>Dùng <a href="https://developers.facebook.com/tools/debug/" target="_blank" style={{ color: '#60a5fa' }}>FB Debugger</a> để test</li>
        </ul>
      </div>
    </div>
  );
};
