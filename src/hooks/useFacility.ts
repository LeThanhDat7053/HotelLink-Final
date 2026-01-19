/**
 * useFacility Hooks - React hooks cho facility data
 */

import { useState, useEffect, useMemo } from 'react';
import { facilityService } from '../services/facilityService';
import type { FacilityUIData, GetFacilitiesParams } from '../types/facility';

// ===== HOOK PARAMS =====

interface UseFacilitiesParams {
  propertyId: number | null;
  locale: string;
  params?: GetFacilitiesParams;
}

interface UseFacilityDetailParams {
  propertyId: number | null;
  facilityId: number | null;
  locale: string;
  enabled?: boolean; // Chỉ fetch khi enabled = true
}

// ===== HOOKS =====

/**
 * Hook để fetch danh sách facilities
 */
export function useFacilities({ propertyId, locale, params }: UseFacilitiesParams) {
  const [facilities, setFacilities] = useState<FacilityUIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize params để tránh re-render
  const memoizedParams = useMemo(() => params, [
    params?.skip,
    params?.limit,
    params?.facility_type,
  ]);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await facilityService.getFacilitiesForUI(
          propertyId,
          locale,
          memoizedParams
        );

        if (!cancelled) {
          setFacilities(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useFacilities] Error fetching facilities:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch facilities'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFacilities();

    return () => {
      cancelled = true;
    };
  }, [propertyId, locale, memoizedParams]);

  return { facilities, loading, error };
}

/**
 * Hook để fetch chi tiết một facility
 */
export function useFacilityDetail({ 
  propertyId, 
  facilityId, 
  locale,
  enabled = true 
}: UseFacilityDetailParams) {
  const [facility, setFacility] = useState<FacilityUIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!propertyId || !facilityId || !enabled) {
      setLoading(false);
      setFacility(null);
      return;
    }

    let cancelled = false;

    const fetchFacilityDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tất cả facilities và tìm facility theo id
        const allFacilities = await facilityService.getFacilitiesForUI(propertyId, locale);
        const foundFacility = allFacilities.find(f => f.id === facilityId);

        if (!cancelled) {
          if (foundFacility) {
            setFacility(foundFacility);
          } else {
            setError(new Error(`Facility with id ${facilityId} not found`));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useFacilityDetail] Error fetching facility:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch facility'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFacilityDetail();

    return () => {
      cancelled = true;
    };
  }, [propertyId, facilityId, locale, enabled]);

  return { facility, loading, error };
}
