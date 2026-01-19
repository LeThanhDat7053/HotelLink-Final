/**
 * useRooms Hook - Quản lý state và fetch rooms từ API
 * 
 * Features:
 * - Auto fetch khi propertyId/locale thay đổi
 * - Loading và error states
 * - Refetch manual
 * - Lọc theo room_type và status
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { roomService } from '../services/roomService';
import type { RoomUIData, GetRoomsParams } from '../types/room';

interface UseRoomsOptions {
  propertyId: number | null;
  locale: string;
  params?: GetRoomsParams;
  enabled?: boolean; // Cho phép disable auto fetch
}

interface UseRoomsReturn {
  rooms: RoomUIData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để fetch và quản lý danh sách phòng
 * 
 * @param options - Config options
 * @returns { rooms, loading, error, refetch }
 * 
 * @example
 * ```tsx
 * const { rooms, loading, error, refetch } = useRooms({
 *   propertyId: 10,
 *   locale: 'vi',
 *   params: { limit: 50, status: 'available' }
 * });
 * ```
 */
export const useRooms = (options: UseRoomsOptions): UseRoomsReturn => {
  const { propertyId, locale, params, enabled = true } = options;
  
  const [rooms, setRooms] = useState<RoomUIData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize params để tránh re-render vô hạn
  const stableParams = useMemo(() => params, [
    params?.skip,
    params?.limit,
    params?.room_type,
    params?.status,
  ]);

  const fetchRooms = useCallback(async () => {
    if (!propertyId || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await roomService.getRoomsForUI(propertyId, locale, stableParams);
      setRooms(data);
    } catch (err) {
      console.error('[useRooms] Failed to fetch rooms:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch rooms'));
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, locale, stableParams, enabled]);

  // Auto fetch khi dependencies thay đổi
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};

/**
 * Hook để lấy chi tiết 1 phòng theo ID
 * 
 * @param propertyId - ID của property
 * @param roomId - ID của room
 * @param locale - Mã ngôn ngữ
 * @returns { room, loading, error, refetch }
 * 
 * @example
 * ```tsx
 * const { room, loading } = useRoomDetail({ 
 *   propertyId: 10, 
 *   roomId: 1, 
 *   locale: 'vi' 
 * });
 * ```
 */
export const useRoomDetail = (options: {
  propertyId: number | null;
  roomId: number | null;
  locale: string;
  enabled?: boolean;
}): {
  room: RoomUIData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const { propertyId, roomId, locale, enabled = true } = options;
  
  const [room, setRoom] = useState<RoomUIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!propertyId || !roomId || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await roomService.getRoomById(propertyId, roomId, locale);
      setRoom(data);
    } catch (err) {
      console.error('[useRoomDetail] Failed to fetch room:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch room'));
      setRoom(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId, roomId, locale, enabled]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return {
    room,
    loading,
    error,
    refetch: fetchRoom,
  };
};
