import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Typography, Grid, Spin, Alert } from 'antd';
import { usePolicy } from '../../hooks/usePolicy';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface PolicyContentProps {
  className?: string;
}

export const PolicyContent: FC<PolicyContentProps> = memo(({ className = '' }) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch policy data from API
  const { content, loading, error } = usePolicy(propertyId || 0, locale);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
  };

  // Title styles
  const titleStyle: CSSProperties = {
    color: '#ecc56d',
    fontSize: screens.md ? 18 : 16,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  };

  const firstTitleStyle: CSSProperties = {
    ...titleStyle,
    marginTop: 0,
  };

  const subTitleStyle: CSSProperties = {
    ...titleStyle,
    fontSize: screens.md ? 16 : 14,
  };

  // Paragraph style
  const paragraphStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
    marginBottom: 12,
  };

  // List styles
  const listStyle: CSSProperties = {
    paddingLeft: 20,
    marginBottom: 12,
  };

  const listItemStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    marginBottom: 6,
  };

  const linkStyle: CSSProperties = {
    color: '#ecc56d',
    textDecoration: 'none',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải chính sách...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <Alert
        title="Lỗi"
        message={error?.message || "Không thể tải thông tin chính sách"}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Tách detailedContent thành các đoạn
  const paragraphs = content.detailedContent.split('\n\n').filter(p => p.trim());

  return (
    <div className={`policy-content ${className}`} style={containerStyle}>
      {content.shortDescription && (
        <Paragraph style={{ ...paragraphStyle, fontWeight: 500 }}>
          {content.shortDescription}
        </Paragraph>
      )}

      <div className="page-content">
        {paragraphs.map((paragraph, index) => (
          <Paragraph 
            key={index} 
            style={paragraphStyle}
          >
            {paragraph}
          </Paragraph>
        ))}
      </div>
    </div>
  );
});

PolicyContent.displayName = 'PolicyContent';
