import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Spin, Alert } from 'antd';
import { useTheme } from '../../context/ThemeContext';
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

  // No content
  if (!content) {
    return (
      <div className={`contact-content ${className}`} style={{ padding: '20px' }}>
        <Alert
          title="Thông báo"
          message="Chưa có thông tin liên hệ"
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={`contact-content contact-page ${className}`} style={containerStyle}>
      {/* Thẻ 1: Contact Info */}
      <p className="contact-info-bg" style={contactInfoStyle}>
        <span style={strongStyle}>Địa chỉ:</span> {content.address || 'Chưa cập nhật'}
        <br />
        <span style={strongStyle}>Email:</span>{' '}
        {content.email ? (
          <a href={`mailto:${content.email}`} style={linkStyle}>
            {content.email}
          </a>
        ) : (
          'Chưa cập nhật'
        )}
        <br />
        <span style={strongStyle}>Điện thoại:</span>{' '}
        {content.phone ? (
          <a href={`tel:${content.phone}`} style={linkStyle}>
            {content.phone}
          </a>
        ) : (
          'Chưa cập nhật'
        )}
        {content.website && (
          <>
            <br />
            <span style={strongStyle}>Website:</span>{' '}
            <a href={content.website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {content.website}
            </a>
          </>
        )}
        {content.workingHours && (
          <>
            <br />
            <span style={strongStyle}>Giờ làm việc:</span> {content.workingHours}
          </>
        )}
      </p>

      {/* Thẻ 2: Contact Message */}
      <p className="contact-mes" style={contactMesStyle}>
        {content.description || 'Nếu bạn có câu hỏi hoặc ý kiến gì, xin vui lòng liên hệ với chúng tôi. Chúng tôi sẽ trả lời bạn trong thời gian sớm nhất có thể.'}
      </p>
    </div>
  );
});

ContactContent.displayName = 'ContactContent';
