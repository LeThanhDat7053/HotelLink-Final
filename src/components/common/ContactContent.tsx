import type { FC, CSSProperties } from 'react';
import { memo, useState, useCallback } from 'react';
import { Form, Input, Button, message, Spin, Alert } from 'antd';
import type { ContactUIData } from '../../types/contact';

interface ContactFormValues {
  fullName: string;
  phone: string;
  email?: string;
  message: string;
}

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
  const [form] = Form.useForm<ContactFormValues>();
  const [submitting, setSubmitting] = useState(false);

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

  // Contact form container styles (thẻ 3)
  const contactFormStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    marginTop: 16,
  };

  // Link styles
  const linkStyle: CSSProperties = {
    color: '#ecc56d',
    textDecoration: 'none',
  };

  // Strong text style
  const strongStyle: CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
  };

  // Input/Textarea styles
  const inputStyle: CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    fontSize: 13,
    resize: 'none' as const,
    padding: '1px 10px 3px 10px',
    background: 'none',
    color: '#fff',
    border: '1px solid rgba(236, 197, 109, 0.5)',
    outline: 'none',
    height: 38,
    borderRadius: 2,
  };

  const textareaStyle: CSSProperties = {
    ...inputStyle,
    height: 80,
    padding: '8px 10px',
  };

  // Submit button styles - theo CSS cf-send
  const submitButtonStyle: CSSProperties = {
    position: 'relative',
    float: 'left',
    width: '100%',
    height: 42,
    lineHeight: '44px',
    marginTop: 5,
    padding: 0,
    color: '#fff',
    textTransform: 'uppercase',
    background: '#ECC56D',
    border: 'none',
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    borderRadius: 6,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 300ms linear',
  };

  // Form field wrapper style
  const formFieldStyle: CSSProperties = {
    marginBottom: 12,
  };

  const handleSubmit = useCallback(async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      // TODO: Gọi API gửi form liên hệ
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

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
