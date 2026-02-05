import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Typography, Spin, Alert } from 'antd';
import { usePolicy } from '../../hooks/usePolicy';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';

const { Paragraph } = Typography;

interface PolicyContentProps {
  className?: string;
}

export const PolicyContent: FC<PolicyContentProps> = memo(({ className = '' }) => {
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

  // Paragraph style
  const paragraphStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
    marginBottom: 12,
    whiteSpace: 'pre-line' as const,
  };

  // Section title style
  const sectionTitleStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '24px',
    marginTop: 8,
    marginBottom: 8,
  };

  // Bullet item style  
  const bulletItemStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    marginBottom: 4,
    paddingLeft: 16,
  };

  /**
   * Render detailed content với sections và bullet points
   */
  const renderDetailedContent = (text: string) => {
    const sections = text.split('\n\n').filter(p => p.trim());
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n').filter(l => l.trim());
      
      // Nếu section có nhiều dòng và dòng đầu kết thúc bằng :, đó là title
      if (lines.length > 1 && lines[0].trim().endsWith(':')) {
        const title = lines[0].trim();
        const items = lines.slice(1);
        
        return (
          <div key={sectionIndex} style={{ marginBottom: 16 }}>
            <div style={sectionTitleStyle}>{title}</div>
            {items.map((item, itemIndex) => (
              <div key={itemIndex} style={bulletItemStyle}>
                {item.trim()}
              </div>
            ))}
          </div>
        );
      }
      
      // Nếu không, render như paragraph bình thường với pre-line
      return (
        <Paragraph key={sectionIndex} style={paragraphStyle}>
          {section}
        </Paragraph>
      );
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải chính sách...</p>
      </div>
    );
  }

  // Lỗi API
  if (error) {
    return (
      <Alert
        title="Lỗi"
        message={error.message || "Không thể tải thông tin chính sách"}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Không có dữ liệu - để trống
  if (!content) {
    return null;
  }

  return (
    <div className={`policy-content ${className}`} style={containerStyle}>
      {content.shortDescription && (
        <Paragraph style={{ ...paragraphStyle, fontWeight: 500, marginBottom: 16 }}>
          {content.shortDescription}
        </Paragraph>
      )}

      <div className="page-content">
        {renderDetailedContent(content.detailedContent)}
      </div>
    </div>
  );
});

PolicyContent.displayName = 'PolicyContent';
