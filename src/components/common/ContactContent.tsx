import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Spin, Alert, Space } from 'antd';
import { InstagramOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import type { ContactUIData } from '../../types/contact';

interface ContactContentProps {
  className?: string;
  content: ContactUIData | null;
  loading?: boolean;
  error?: Error | null;
}

export const ContactContent: FC<ContactContentProps> = memo(({ 
  className = '',
  content,
  loading: dataLoading = false,
  error = null
}) => {
  const { primaryColor } = useTheme();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
  };

  // Contact info styles (thẻ 1)
  const contactInfoStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    lineHeight: '22px',
    color: 'rgba(255, 255, 255, 0.8)',
  };

  // Contact message styles (thẻ 2)
  const contactMesStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '22px',
  };

  // Link styles
  const linkStyle: CSSProperties = {
    color: primaryColor,
    textDecoration: 'none',
  };

  // Strong text style
  const strongStyle: CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
  };

  // Social button style
  const socialBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    textAlign: 'center',
    borderRadius: 8,
    transition: 'all 200ms linear',
    color: 'white',
    textDecoration: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className={`contact-content ${className}`} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`contact-content ${className}`} style={{ padding: '20px' }}>
        <Alert
          title="Lỗi"
          message={error.message || 'Không thể tải thông tin liên hệ'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // No content - để trống khi không có dữ liệu
  if (!content) {
    return null;
  }

  return (
    <div className={`contact-content contact-page ${className}`} style={containerStyle}>
      {/* Thẻ 1: Contact Info */}
      <p className="contact-info-bg" style={contactInfoStyle}>
        <span style={strongStyle}>{t.address}:</span> {content.address || t.notAvailable}
        <br />
        <span style={strongStyle}>{t.email}:</span>{' '}
        {content.email ? (
          <a href={`mailto:${content.email}`} style={linkStyle}>
            {content.email}
          </a>
        ) : (
          t.notAvailable
        )}
        <br />
        <span style={strongStyle}>{t.phone}:</span>{' '}
        {content.phone ? (
          <a href={`tel:${content.phone}`} style={linkStyle}>
            {content.phone}
          </a>
        ) : (
          t.notAvailable
        )}
        {content.website && (
          <>
            <br />
            <span style={strongStyle}>{t.website}:</span>{' '}
            <a href={content.website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {content.website}
            </a>
          </>
        )}
        {content.workingHours && (
          <>
            <br />
            <span style={strongStyle}>{t.workingHours}:</span> {content.workingHours}
          </>
        )}
      </p>

      {/* Thẻ 2: Contact Message - chỉ hiển thị nếu có description từ API */}
      {content.description && (
        <p className="contact-mes" style={contactMesStyle}>
          {content.description}
        </p>
      )}

      {/* Social Media Links */}
      {(content.socialMedia?.facebook || content.socialMedia?.instagram || content.socialMedia?.twitter || content.socialMedia?.youtube) && (
        <div style={{ marginTop: 20 }}>
          <span style={strongStyle}>{t.followUs}:</span>
          <Space size={10} style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
            {content.socialMedia?.facebook && (
              <a
                href={content.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                title="Facebook"
              >
                <svg viewBox="0 0 320 512" style={{ width: 18, height: 18, fill: 'currentColor' }}>
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
            )}
            {content.socialMedia?.instagram && (
              <a
                href={content.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                title="Instagram"
              >
                <InstagramOutlined style={{ fontSize: 18 }} />
              </a>
            )}
            {content.socialMedia?.twitter && (
              <a
                href={content.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                title="Twitter"
              >
                <TwitterOutlined style={{ fontSize: 18 }} />
              </a>
            )}
            {content.socialMedia?.youtube && (
              <a
                href={content.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                title="YouTube"
              >
                <YoutubeOutlined style={{ fontSize: 18 }} />
              </a>
            )}
          </Space>
        </div>
      )}
    </div>
  );
});

ContactContent.displayName = 'ContactContent';
