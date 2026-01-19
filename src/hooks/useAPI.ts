import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { featureService } from '../services/featureService';
import { postService } from '../services/postService';
import type { PropertyResponse, FeatureResponse, PostResponse } from '../types/api';

/**
 * Hook lấy property theo code
 */
export function useProperty(propertyCode: string) {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyByCode(propertyCode);
        if (mounted) {
          setProperty(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      mounted = false;
    };
  }, [propertyCode]);

  return { property, loading, error };
}

/**
 * Hook lấy danh sách features
 */
export function useFeatures(categoryId?: number) {
  const [features, setFeatures] = useState<FeatureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await featureService.getFeatures({ 
          category_id: categoryId,
          include_system: true 
        });
        if (mounted) {
          setFeatures(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatures();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { features, loading, error, refetch: () => {} };
}

/**
 * Hook lấy danh sách feature categories
 */
export function useFeatureCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await featureService.getCategories({ include_system: true });
        if (mounted) {
          setCategories(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
}

/**
 * Hook lấy posts có VR360
 */
export function useVR360Posts(propertyId?: number, featureId?: number) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts({
          property_id: propertyId,
          feature_id: featureId,
          status: 'PUBLISHED',
        });
        
        // Filter posts có vr360_url
        const vr360Posts = data.filter(post => post.vr360_url);
        
        if (mounted) {
          setPosts(vr360Posts);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [propertyId, featureId]);

  return { posts, loading, error };
}

/**
 * Hook lấy tất cả posts
 */
export function usePosts(params?: {
  property_id?: number;
  feature_id?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts(params);
        if (mounted) {
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [params?.property_id, params?.feature_id, params?.status]);

  return { posts, loading, error };
}
