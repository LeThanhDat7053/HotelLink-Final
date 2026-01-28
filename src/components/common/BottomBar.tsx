import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flex, Grid } from 'antd';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { usePropertyContext } from '../../context/PropertyContext';
import { useRegulation } from '../../hooks/useRegulation';
import { useVrHotelSettings } from '../../hooks/useVR360';
import { getMenuTranslations } from '../../constants/translations';
import { getLocalizedPath } from '../../constants/routes';

const { useBreakpoint } = Grid;

interface FooterLink {
  path: string;
  label: string;
}

interface BottomBarProps {
  className?: string;
}

const footerStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 999,
  left: 15,
  bottom: 15,
  background: 'rgba(0, 0, 0, 0.68)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  height: 36,
  width: 522,
  borderRadius: 12,
};

const linkStyleBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: '100%',
  fontSize: 13,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
};

export const BottomBar: FC<BottomBarProps> = memo(({ className = '' }) => {
  const screens = useBreakpoint();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();
  const { property } = usePropertyContext();
  const location = useLocation();

  // Fetch data để check isDisplaying
  const { content: regulationData, loading: regulationLoading } = useRegulation(property?.id || 0, locale, 'fusion');
  const { settings, loading: settingsLoading } = useVrHotelSettings(property?.id || null);

  // Chỉ hiển thị footer khi đã load xong data
  const isDataReady = !regulationLoading && !settingsLoading;

  // Lấy translations theo locale hiện tại
  const t = useMemo(() => getMenuTranslations(locale), [locale]);

  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === getLocalizedPath(path, locale) || 
           location.pathname.startsWith(getLocalizedPath(path, locale) + '/');
  };

  // Footer links với translations động theo locale
  const allFooterLinks: FooterLink[] = useMemo(() => [
    { path: '/thu-vien-anh', label: t.gallery },
    { path: '/noi-quy-khach-san', label: t.regulation },
    { path: '/uu-dai', label: t.offers },
  ], [t]);

  // Filter ra các links có isDisplaying = true
  const visibleFooterLinks = useMemo(() => {
    return allFooterLinks.filter(link => {
      // Gallery: luôn hiển thị (không đụng vào theo yêu cầu)
      if (link.path === '/thu-vien-anh') return true;
      
      // Regulation: check từ API
      if (link.path === '/noi-quy-khach-san') {
        return regulationData?.isDisplaying !== false;
      }
      
      // Offers: check từ settings
      if (link.path === '/uu-dai') {
        return settings?.pages?.offers?.is_displaying !== false;
      }
      
      return true;
    });
  }, [allFooterLinks, regulationData, settings]);

  const responsiveFooterStyle: CSSProperties = {
    ...footerStyle,
    left: screens.md ? 15 : 10,
    bottom: screens.md ? 15 : 10,
    width: screens.md ? 522 : screens.sm ? '90%' : 'calc(100% - 20px)',
    maxWidth: screens.md ? 522 : 450,
    height: screens.md ? 36 : 32,
    opacity: isDataReady ? 1 : 0,
    transform: isDataReady ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    pointerEvents: isDataReady ? 'auto' : 'none',
  };

  const responsiveLinkStyle: CSSProperties = {
    ...linkStyleBase,
    color: primaryColor,
    fontSize: screens.md ? 13 : screens.sm ? 12 : 11,
  };

  // Không render gì cả nếu đang loading
  if (!isDataReady) {
    return null;
  }

  return (
    <Flex 
      component="footer" 
      className={className}
      style={responsiveFooterStyle}
      align="center"
    >
      {visibleFooterLinks.map((link, index) => {
        const active = isActive(link.path);
        return (
          <Link
            key={link.path}
            to={getLocalizedPath(link.path, locale)}
            style={{
              ...responsiveLinkStyle,
              borderRight: index === visibleFooterLinks.length - 1 ? 'none' : linkStyleBase.borderRight,
              background: active ? `${primaryColor}33` : 'transparent',
              color: active ? '#fff' : primaryColor,
              fontWeight: active ? 600 : 400,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primaryColor}33`;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = primaryColor;
              }
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </Flex>
  );
});

BottomBar.displayName = 'BottomBar';
