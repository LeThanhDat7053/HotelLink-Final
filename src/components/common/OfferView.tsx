import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfferList } from './OfferList';
import { OfferDetail } from './OfferDetail';
import { useOfferDetail } from '../../hooks/useOffers';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { OfferUIData } from '../../types/offer';

interface OfferViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void;
  initialCode?: string; // Code từ URL để hiển thị detail ngay khi load
}

export const OfferView: FC<OfferViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange,
  initialCode
}) => {
  const [selectedOfferCode, setSelectedOfferCode] = useState<string | undefined>(initialCode);
  const navigate = useNavigate();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);

  // Sync initialCode from props when URL changes
  useEffect(() => {
    setSelectedOfferCode(initialCode);
  }, [initialCode]);

  // Fetch offer detail when selected
  const { offer, loading, error } = useOfferDetail({
    propertyId: propertyId ?? undefined,
    code: selectedOfferCode || '',
    locale,
  });

  const handleOfferClick = useCallback((offer: OfferUIData) => {
    setSelectedOfferCode(offer.code);
    const newPath = getLocalizedPath(`/uu-dai/${offer.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(offer.title);
    onVrLinkChange?.(offer.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  const handleBack = useCallback(() => {
    setSelectedOfferCode(undefined);
    const newPath = getLocalizedPath('/uu-dai', locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(t.offers);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale, t.offers]);

  // Update title when offer data changes
  useEffect(() => {
    if (offer && selectedOfferCode) {
      onTitleChange?.(offer.title);
    }
  }, [offer, selectedOfferCode, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (!selectedOfferCode) {
      onTitleChange?.(t.offers);
    }
  }, [selectedOfferCode, locale, onTitleChange, t.offers]);

  // Show detail view when offer is selected
  if (selectedOfferCode) {
    return (
      <OfferDetail 
        offer={offer} 
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
    <OfferList 
      onOfferClick={handleOfferClick}
      className={className}
    />
  );
});

OfferView.displayName = 'OfferView';

export default OfferView;
