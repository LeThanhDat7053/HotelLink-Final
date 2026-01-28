import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FacilityList } from './FacilityList';
import { FacilityDetail } from './FacilityDetail';
import { useFacilityDetail, useFacilityDetailByCode } from '../../hooks/useFacility';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractCleanPath, getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { FacilityUIData } from '../../types/facility';

interface FacilityViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void; // Callback để thông báo vr_link cho parent
  initialCode?: string; // Code từ URL để hiển thị detail ngay khi load
}

export const FacilityView: FC<FacilityViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange,
  initialCode
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [currentCode, setCurrentCode] = useState<string | undefined>(initialCode);
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Sync initialCode from props when URL changes
  useEffect(() => {
    setCurrentCode(initialCode);
    if (!initialCode) {
      setSelectedFacilityId(null);
    }
  }, [initialCode]);

  // Fetch facility detail by ID when clicked from list
  const { facility: facilityById, loading: loadingById, error: errorById } = useFacilityDetail({
    propertyId,
    facilityId: selectedFacilityId,
    locale,
    enabled: selectedFacilityId !== null && selectedFacilityId > 0,
  });

  // Fetch facility detail by code when loaded from URL
  const { facility: facilityByCode, loading: loadingByCode, error: errorByCode } = useFacilityDetailByCode({
    propertyId,
    facilityCode: currentCode,
    locale,
    enabled: !!currentCode && (selectedFacilityId === null || selectedFacilityId <= 0),
  });

  // Combine results - prefer facilityById if selected, fallback facilityByCode
  const facility = selectedFacilityId && selectedFacilityId > 0 ? facilityById : facilityByCode;
  const loading = selectedFacilityId && selectedFacilityId > 0 ? loadingById : loadingByCode;
  const error = selectedFacilityId && selectedFacilityId > 0 ? errorById : errorByCode;

  const handleFacilityClick = useCallback((facility: FacilityUIData) => {
    setSelectedFacilityId(facility.id);
    setCurrentCode(facility.code);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${facility.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(facility.name);
    onVrLinkChange?.(facility.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedFacilityId(null);
    setCurrentCode(undefined);
    const cleanPath = '/tien-ich';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.facilities);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  // Update title when facility data changes
  useEffect(() => {
    if (facility && (selectedFacilityId || currentCode)) {
      onTitleChange?.(facility.name);
    }
  }, [facility, selectedFacilityId, currentCode, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (!selectedFacilityId && !currentCode) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.facilities);
    }
  }, [selectedFacilityId, currentCode, locale, onTitleChange]);

  // Show detail view when facility is selected (clicked from list)
  if (selectedFacilityId !== null && selectedFacilityId > 0) {
    return (
      <FacilityDetail 
        facility={facility} 
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
      <FacilityDetail 
        facility={facility} 
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
    <FacilityList 
      onFacilityClick={handleFacilityClick}
      className={className}
    />
  );
});

FacilityView.displayName = 'FacilityView';
