/**
 * useOffers Hook - Manage offers data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import type { OfferUIData, GetOffersParams } from '../types/offer';
import { offerService } from '../services/offerService';

interface UseOffersOptions {
  propertyId?: number;
  locale: string;
  params?: GetOffersParams;
}

interface UseOffersResult {
  offers: OfferUIData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để fetch danh sách offers
 */
export function useOffers({
  propertyId,
  locale,
  params,
}: UseOffersOptions): UseOffersResult {
  const [offers, setOffers] = useState<OfferUIData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await offerService.getOffersForUI(propertyId, locale, params);
      setOffers(data);
    } catch (err) {
      console.error('[useOffers] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [propertyId, locale, params?.limit, params?.skip, params?.status]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
  };
}

interface UseOfferDetailOptions {
  propertyId?: number;
  code: string;
  locale: string;
}

interface UseOfferDetailResult {
  offer: OfferUIData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để fetch chi tiết một offer theo code
 */
export function useOfferDetail({
  propertyId,
  code,
  locale,
}: UseOfferDetailOptions): UseOfferDetailResult {
  const [offer, setOffer] = useState<OfferUIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOffer = useCallback(async () => {
    if (!propertyId || !code) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await offerService.getOfferByCode(propertyId, code, locale);
      setOffer(data);
    } catch (err) {
      console.error('[useOfferDetail] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [propertyId, code, locale]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  return {
    offer,
    loading,
    error,
    refetch: fetchOffer,
  };
}

export default useOffers;
