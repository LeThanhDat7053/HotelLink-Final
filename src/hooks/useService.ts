/**
 * Service Hooks - React hooks cho service data fetching
 */

import { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import type { ServiceUIData, GetServicesParams } from '../types/service';

interface UseServicesParams {
  propertyId: number;
  locale: string;
  params?: GetServicesParams;
}

interface UseServicesResult {
  services: ServiceUIData[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook để fetch danh sách services
 */
export function useServices({ propertyId, locale, params }: UseServicesParams): UseServicesResult {
  const [services, setServices] = useState<ServiceUIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await serviceService.getServicesForUI(propertyId, locale, params);
        
        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu dịch vụ');
          console.error('Error fetching services:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, [propertyId, locale, params]);

  return { services, loading, error };
}

interface UseServiceDetailParams {
  propertyId: number;
  locale: string;
  serviceId: number | null;
}

interface UseServiceDetailResult {
  service: ServiceUIData | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook để fetch chi tiết 1 service
 */
export function useServiceDetail({ 
  propertyId, 
  locale, 
  serviceId 
}: UseServiceDetailParams): UseServiceDetailResult {
  const [service, setService] = useState<ServiceUIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServiceDetail = async () => {
      if (!propertyId || serviceId === null) {
        setService(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch tất cả services rồi tìm theo ID
        const allServices = await serviceService.getServicesForUI(propertyId, locale);
        const foundService = allServices.find(s => s.id === serviceId);
        
        if (isMounted) {
          setService(foundService || null);
          if (!foundService) {
            setError(new Error('Không tìm thấy dịch vụ'));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Lỗi khi tải chi tiết dịch vụ'));
          console.error('Error fetching service detail:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServiceDetail();

    return () => {
      isMounted = false;
    };
  }, [propertyId, locale, serviceId]);

  return { service, loading, error };
}

/**
 * Hook để fetch chi tiết 1 service theo code (dùng cho URL routing)
 */
export function useServiceDetailByCode({ 
  propertyId, 
  serviceCode, 
  locale,
  enabled = true 
}: {
  propertyId: number | null;
  serviceCode: string | null | undefined;
  locale: string;
  enabled?: boolean;
}): UseServiceDetailResult {
  const [service, setService] = useState<ServiceUIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServiceDetail = async () => {
      if (!propertyId || !serviceCode) {
        setService(null);
        setLoading(false);
        return;
      }

      if (!enabled) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const foundService = await serviceService.getServiceByCode(propertyId, serviceCode, locale);
        
        if (isMounted) {
          setService(foundService || null);
          if (!foundService) {
            setError(new Error('Không tìm thấy dịch vụ'));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Lỗi khi tải chi tiết dịch vụ'));
          console.error('Error fetching service detail by code:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServiceDetail();

    return () => {
      isMounted = false;
    };
  }, [propertyId, locale, serviceCode, enabled]);

  return { service, loading, error };
}
