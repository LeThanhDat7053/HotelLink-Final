import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Grid } from 'antd';
import { useLanguage } from '../../context/LanguageContext';
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

const linkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: '100%',
  color: '#ecc56d',
  fontSize: 13,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
};

export const BottomBar: FC<BottomBarProps> = memo(({ className = '' }) => {
  const screens = useBreakpoint();
  const { locale } = useLanguage();

  // Lấy translations theo locale hiện tại
  const t = useMemo(() => getMenuTranslations(locale), [locale]);

  // Footer links với translations động theo locale
  const footerLinks: FooterLink[] = useMemo(() => [
    { path: '/thu-vien-anh', label: t.gallery },
    { path: '/noi-quy-khach-san', label: t.regulation },
    { path: '/tin-tuc-su-kien', label: t.news },
  ], [t]);

  const responsiveFooterStyle: CSSProperties = {
    ...footerStyle,
    left: screens.md ? 15 : 10,
    bottom: screens.md ? 15 : 10,
    width: screens.md ? 522 : screens.sm ? '90%' : 'calc(100% - 20px)',
    maxWidth: screens.md ? 522 : 450,
    height: screens.md ? 36 : 32,
  };

  const responsiveLinkStyle: CSSProperties = {
    ...linkStyle,
    fontSize: screens.md ? 13 : screens.sm ? 12 : 11,
  };

  return (
    <Flex 
      component="footer" 
      className={className}
      style={responsiveFooterStyle}
      align="center"
    >
      {footerLinks.map((link, index) => (
        <Link
          key={link.path}
          to={getLocalizedPath(link.path, locale)}
          style={{
            ...responsiveLinkStyle,
            borderRight: index === footerLinks.length - 1 ? 'none' : linkStyle.borderRight,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(236, 197, 109, 0.2)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ecc56d';
          }}
        >
          {link.label}
        </Link>
      ))}
    </Flex>
  );
});

BottomBar.displayName = 'BottomBar';
