/**
 * Policy Hook - React hook cho policy data fetching
 */

import { useState, useEffect } from 'react';
import { policyService } from '../services/policyService';
import type { PolicyUIData } from '../types/policy';

interface UsePolicyResult {
  content: PolicyUIData | null;
  vr360Link: string | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook để fetch policy data
 */
export function usePolicy(
  propertyId: number,
  locale: string,
  tenantCode: string = import.meta.env.VITE_TENANT_CODE || ''
): UsePolicyResult {
  const [content, setContent] = useState<PolicyUIData | null>(null);
  const [vr360Link, setVr360Link] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPolicy = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await policyService.getPolicyForUI(propertyId, locale, tenantCode);
        
        if (isMounted) {
          setContent(data);
          setVr360Link(data.vr360Link);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Lỗi khi tải chính sách'));
          console.error('Error fetching policy:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPolicy();

    return () => {
      isMounted = false;
    };
  }, [propertyId, locale, tenantCode]);

  return { content, vr360Link, loading, error };
}
