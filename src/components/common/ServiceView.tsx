import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceList } from './ServiceList';
import { ServiceDetail } from './ServiceDetail';
import { useServiceDetail, useServiceDetailByCode } from '../../hooks/useService';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractCleanPath, getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { ServiceUIData } from '../../types/service';

interface ServiceViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void;
  initialCode?: string; // Code từ URL để hiển thị detail ngay khi load
}

export const ServiceView: FC<ServiceViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange,
  initialCode
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [currentCode, setCurrentCode] = useState<string | undefined>(initialCode);
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Sync initialCode from props when URL changes
  useEffect(() => {
    setCurrentCode(initialCode);
    if (!initialCode) {
      setSelectedServiceId(null);
    }
  }, [initialCode]);

  // Fetch service detail by ID when clicked from list
  const { service: serviceById, loading: loadingById, error: errorById } = useServiceDetail({
    propertyId: propertyId || 0,
    locale,
    serviceId: selectedServiceId,
  });

  // Fetch service detail by code when loaded from URL
  const { service: serviceByCode, loading: loadingByCode, error: errorByCode } = useServiceDetailByCode({
    propertyId,
    serviceCode: currentCode,
    locale,
    enabled: !!currentCode && (selectedServiceId === null || selectedServiceId <= 0),
  });

  // Combine results - prefer serviceById if selected, fallback serviceByCode
  const service = selectedServiceId && selectedServiceId > 0 ? serviceById : serviceByCode;
  const loading = selectedServiceId && selectedServiceId > 0 ? loadingById : loadingByCode;
  const error = selectedServiceId && selectedServiceId > 0 ? errorById : errorByCode;

  const handleServiceClick = useCallback((service: ServiceUIData) => {
    setSelectedServiceId(service.id);
    setCurrentCode(service.code);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${service.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(service.name);
    onVrLinkChange?.(service.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedServiceId(null);
    setCurrentCode(undefined);
    const cleanPath = '/dich-vu';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.services);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  // Update title when service selected
  useEffect(() => {
    if (service && (selectedServiceId !== null || currentCode)) {
      onTitleChange?.(service.name);
    }
  }, [service, selectedServiceId, currentCode, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (selectedServiceId === null && !currentCode) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.services);
    }
  }, [selectedServiceId, currentCode, locale, onTitleChange]);

  // Show detail view when service is selected (clicked from list)
  if (selectedServiceId !== null && selectedServiceId > 0) {
    return (
      <ServiceDetail 
        service={service} 
        loading={loading}
        error={error}
        onBack={handleBack}
        onVrLinkChange={onVrLinkChange}
        className={className}
      />
    );
  }

  // Show detail view when code is in URL (page load with slug)
  if (currentCode) {
    return (
      <ServiceDetail 
        service={service} 
        loading={loading}
        error={error}
        onBack={handleBack}
        onVrLinkChange={onVrLinkChange}
        className={className}
      />
    );
  }

  // Show list view
  return (
    <ServiceList 
      onServiceClick={handleServiceClick}
      className={className}
    />
  );
});

ServiceView.displayName = 'ServiceView';
