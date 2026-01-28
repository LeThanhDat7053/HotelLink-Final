/**
 * useDining Hooks - React hooks cho dining data
 */

import { useState, useEffect, useMemo } from 'react';
import { diningService } from '../services/diningService';
import type { DiningUIData, GetDiningsParams } from '../types/dining';

// ===== HOOK PARAMS =====

interface UseDiningsParams {
  propertyId: number | null;
  locale: string;
  params?: GetDiningsParams;
}

interface UseDiningDetailParams {
  propertyId: number | null;
  diningId: number | null;
  locale: string;
  enabled?: boolean; // Chỉ fetch khi enabled = true
}

// ===== HOOKS =====

/**
 * Hook để fetch danh sách dinings
 */
export function useDinings({ propertyId, locale, params }: UseDiningsParams) {
  const [dinings, setDinings] = useState<DiningUIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize params để tránh re-render
  const memoizedParams = useMemo(() => params, [
    params?.skip,
    params?.limit,
    params?.dining_type,
  ]);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDinings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await diningService.getDiningsForUI(
          propertyId,
          locale,
          memoizedParams
        );

        if (!cancelled) {
          setDinings(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useDinings] Error fetching dinings:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch dinings'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDinings();

    return () => {
      cancelled = true;
    };
  }, [propertyId, locale, memoizedParams]);

  return { dinings, loading, error };
}

/**
 * Hook để fetch chi tiết một dining
 */
export function useDiningDetail({ 
  propertyId, 
  diningId, 
  locale,
  enabled = true 
}: UseDiningDetailParams) {
  const [dining, setDining] = useState<DiningUIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!propertyId || !diningId || !enabled) {
      setLoading(false);
      setDining(null);
      return;
    }

    let cancelled = false;

    const fetchDiningDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tất cả dinings và tìm dining theo id
        const allDinings = await diningService.getDiningsForUI(propertyId, locale);
        const foundDining = allDinings.find(d => d.id === diningId);

        if (!cancelled) {
          if (foundDining) {
            setDining(foundDining);
          } else {
            setError(new Error(`Dining with id ${diningId} not found`));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useDiningDetail] Error fetching dining:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch dining'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDiningDetail();

    return () => {
      cancelled = true;
    };
  }, [propertyId, diningId, locale, enabled]);

  return { dining, loading, error };
}

/**
 * Hook để fetch chi tiết một dining theo code (dùng cho URL routing)
 */
export function useDiningDetailByCode({ 
  propertyId, 
  diningCode, 
  locale,
  enabled = true 
}: {
  propertyId: number | null;
  diningCode: string | null | undefined;
  locale: string;
  enabled?: boolean;
}) {
  const [dining, setDining] = useState<DiningUIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!propertyId || !diningCode || !enabled) {
      setLoading(false);
      setDining(null);
      return;
    }

    let cancelled = false;

    const fetchDiningDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const foundDining = await diningService.getDiningByCode(propertyId, diningCode, locale);

        if (!cancelled) {
          if (foundDining) {
            setDining(foundDining);
          } else {
            setError(new Error(`Dining with code ${diningCode} not found`));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useDiningDetailByCode] Error fetching dining:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch dining'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDiningDetail();

    return () => {
      cancelled = true;
    };
  }, [propertyId, diningCode, locale, enabled]);

  return { dining, loading, error };
}
