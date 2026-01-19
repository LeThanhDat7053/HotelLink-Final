/**
 * Contact Hook - React hook cho contact data fetching
 */

import { useState, useEffect } from 'react';
import { contactService } from '../services/contactService';
import type { ContactUIData } from '../types/contact';

interface UseContactResult {
  content: ContactUIData | null;
  vr360Link: string | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook để fetch contact data
 */
export function useContact(
  propertyId: number,
  locale: string
): UseContactResult {
  const [content, setContent] = useState<ContactUIData | null>(null);
  const [vr360Link, setVr360Link] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContact = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await contactService.getContactForUI(propertyId, locale);
        
        if (isMounted) {
          setContent(data);
          setVr360Link(data.vr360Link);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Lỗi khi tải thông tin liên hệ'));
          console.error('Error fetching contact:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContact();

    return () => {
      isMounted = false;
    };
  }, [propertyId, locale]);

  return { content, vr360Link, loading, error };
}
