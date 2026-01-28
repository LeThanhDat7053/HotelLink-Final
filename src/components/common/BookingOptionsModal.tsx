import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Modal, Button, message } from 'antd';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import { getBookingUrlWithMessage, createBookingMessage, copyToClipboard } from '../../utils/bookingHelper';

// Custom Messenger Icon - Simple white lightning bolt
const MessengerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.15 2 11.25c0 2.91 1.45 5.51 3.71 7.25V22l3.71-2.03c.99.27 2.04.42 3.12.42 5.52 0 10-4.15 10-9.25S17.52 2 12 2zm1.03 12.43l-2.49-2.65-4.86 2.65 5.36-5.68 2.55 2.65 4.8-2.65-5.36 5.68z" />
  </svg>
);

// Custom Zalo Icon - Simple white chat bubble with Z
const ZaloIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.15 2 11.14c0 3.12 1.95 5.88 4.95 7.52l-.95 3.48 3.48-1.85c1.39.49 2.89.76 4.45.76 5.52 0 10-4.15 10-9.14S17.52 2 12 2zm3.5 9.14H9.7l3.95-4.57h-5.2v-1.5h5.8l-3.95 4.57h4.7v1.5z" />
  </svg>
);

// Custom Booking Icon - Simple white calendar with check
const BookingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5l-4 4 1.41 1.41L10 16.17l4.59 4.58L16 19.34l-4-4z" />
  </svg>
);

export interface BookingOption {
  type: 'messenger' | 'zalo' | 'booking';
  url: string;
  label: string;
  icon: React.ReactNode;
}

interface BookingOptionsModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  messengerUrl?: string | null;
  zaloPhone?: string | null;
  bookingUrl?: string | null;
  wantToBookText: string;
  messageCopiedText: string;
  primaryColor: string;
}

/**
 * Modal hiển thị các lựa chọn đặt phòng
 * - Nếu chỉ có 1 option → không cần modal, component cha sẽ redirect trực tiếp
 * - Nếu có 2-3 options → hiện modal để chọn
 */
export const BookingOptionsModal: FC<BookingOptionsModalProps> = memo(({
  open,
  onClose,
  itemName,
  messengerUrl,
  zaloPhone,
  bookingUrl,
  wantToBookText,
  messageCopiedText,
  primaryColor,
}) => {
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);

  // Build available options
  const options = useMemo<BookingOption[]>(() => {
    const result: BookingOption[] = [];

    // 1. Messenger
    if (messengerUrl && messengerUrl.trim() !== '') {
      // Nếu chỉ là ID/username, convert thành m.me URL
      const messengerLink = messengerUrl.startsWith('http') 
        ? messengerUrl 
        : `https://m.me/${messengerUrl}`;
      
      result.push({
        type: 'messenger',
        url: messengerLink,
        label: 'Messenger',
        icon: <MessengerIcon />,
      });
    }

    // 2. Zalo (từ phone_number)
    if (zaloPhone && zaloPhone.trim() !== '') {
      // Nếu đã là URL đầy đủ, dùng trực tiếp; nếu không thì thêm prefix
      const zaloLink = zaloPhone.startsWith('http') 
        ? zaloPhone 
        : `https://zalo.me/${zaloPhone}`;
      
      result.push({
        type: 'zalo',
        url: zaloLink,
        label: 'Zalo',
        icon: <ZaloIcon />,
      });
    }

    // 3. Booking URL (Booking.com, website riêng, etc.)
    if (bookingUrl && bookingUrl.trim() !== '') {
      result.push({
        type: 'booking',
        url: bookingUrl,
        label: t.booking || 'Booking',
        icon: <BookingIcon />,
      });
    }

    return result;
  }, [messengerUrl, zaloPhone, bookingUrl, t.booking]);

  // Handle click option
  const handleOptionClick = async (option: BookingOption) => {
    let finalUrl = option.url;

    // Xử lý Messenger - thêm pre-fill message
    if (option.type === 'messenger') {
      finalUrl = getBookingUrlWithMessage(option.url, itemName, wantToBookText);
    }

    // Xử lý Zalo - copy message và thêm ?text= parameter
    if (option.type === 'zalo') {
      const bookingMessage = createBookingMessage(itemName, wantToBookText);
      
      // Copy message vào clipboard
      const copied = await copyToClipboard(bookingMessage);
      if (copied) {
        message.success(messageCopiedText);
      }
      
      // Thêm ?text= parameter (có thể work trên một số platform)
      const encodedMessage = encodeURIComponent(bookingMessage);
      finalUrl = `${option.url}?text=${encodedMessage}`;
    }

    // Open URL
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Styles
  const modalBodyStyle: CSSProperties = {
    padding: '24px',
    background: 'rgba(0, 0, 0, 0.68)',
  };

  const modalHeaderStyle = `
    .booking-modal {
      z-index: 9999 !important;
    }
    .booking-modal .ant-modal-wrap {
      /* Center modal vertically and horizontally on all screen sizes */
      align-items: center !important;
      padding-top: 0 !important;
      z-index: 9999 !important;
    }
    .booking-modal .ant-modal-mask {
      z-index: 9998 !important;
    }
    .booking-modal .ant-modal-container {
      background-color: transparent !important;
    }
    .booking-modal .ant-modal-content {
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border-radius: 16px;
      overflow: hidden;
      padding: 0 !important;
      --ant-modal-content-bg: transparent;
    }
    .booking-modal .ant-modal-header {
      background: linear-gradient(135deg, ${primaryColor}dd 0%, ${primaryColor}99 100%);
      border-bottom: none;
      padding: 20px 24px;
      border-radius: 16px 16px 0 0;
      margin: 0;
      position: relative;
    }
    .booking-modal .ant-modal-title {
      color: white !important;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin: 0;
    }
    .booking-modal .ant-modal-body {
      background: rgba(0, 0, 0, 0.68);
      border-radius: 0 0 16px 16px;
      padding: 24px !important;
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .booking-modal .ant-modal {
        max-width: calc(100vw - 32px) !important;
      }
    }
  `;

  const optionButtonStyle: CSSProperties = {
    width: '100%',
    height: 'auto',
    padding: '16px 20px',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    border: 'none',
  };

  const messengerStyle: CSSProperties = {
    ...optionButtonStyle,
    background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
    color: 'white',
  };

  const zaloStyle: CSSProperties = {
    ...optionButtonStyle,
    background: 'linear-gradient(135deg, #0099FF 0%, #0055FF 100%)',
    color: 'white',
  };

  const bookingStyle: CSSProperties = {
    ...optionButtonStyle,
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
    color: 'white',
  };

  const getButtonStyle = (type: BookingOption['type']): CSSProperties => {
    switch (type) {
      case 'messenger': return messengerStyle;
      case 'zalo': return zaloStyle;
      case 'booking': return bookingStyle;
      default: return optionButtonStyle;
    }
  };

  return (
    <>
      <style>{modalHeaderStyle}</style>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={t.bookNow || 'Đặt ngay'}
        centered={true}
        width={420}
        wrapClassName="booking-modal"
        closable={false}
        styles={{ body: modalBodyStyle }}
        zIndex={9999}
      >
        <div style={{ marginTop: 8 }}>
          {options.map((option) => (
            <Button
              key={option.type}
              type="primary"
              style={{
                ...getButtonStyle(option.type),
                transition: 'all 0.3s ease',
              }}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLElement;
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLElement;
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </Button>
          ))}
          
          {options.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 20 }}>
              {t.notAvailable || 'Không có phương thức đặt phòng'}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
});

/**
 * Helper function để xác định có cần show modal hay không
 * @returns { shouldShowModal, singleOption }
 */
export const getBookingBehavior = (
  messengerUrl?: string | null,
  zaloPhone?: string | null,
  bookingUrl?: string | null
): { shouldShowModal: boolean; singleOption: BookingOption | null; optionCount: number } => {
  const options: BookingOption[] = [];

  if (messengerUrl && messengerUrl.trim() !== '') {
    const messengerLink = messengerUrl.startsWith('http') 
      ? messengerUrl 
      : `https://m.me/${messengerUrl}`;
    options.push({
      type: 'messenger',
      url: messengerLink,
      label: 'Facebook Messenger',
      icon: null,
    });
  }

  if (zaloPhone && zaloPhone.trim() !== '') {
    // Nếu đã là URL đầy đủ, dùng trực tiếp; nếu không thì thêm prefix
    const zaloLink = zaloPhone.startsWith('http') 
      ? zaloPhone 
      : `https://zalo.me/${zaloPhone}`;
    options.push({
      type: 'zalo',
      url: zaloLink,
      label: 'Zalo',
      icon: null,
    });
  }

  if (bookingUrl && bookingUrl.trim() !== '') {
    options.push({
      type: 'booking',
      url: bookingUrl,
      label: 'Booking',
      icon: null,
    });
  }

  return {
    shouldShowModal: options.length > 1,
    singleOption: options.length === 1 ? options[0] : null,
    optionCount: options.length,
  };
};
