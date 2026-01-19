import type { FC } from 'react';
import { memo } from 'react';

/**
 * RoomsPage - Trang hiển thị danh sách phòng nghỉ
 * 
 * Hiện tại sử dụng mock data, sau này sẽ kết nối API
 */
const RoomsPage: FC = memo(() => {
  // Component này hiện tại không render gì vì
  // nội dung được hiển thị trong InfoBox thông qua App.tsx
  return null;
});

RoomsPage.displayName = 'RoomsPage';

export default RoomsPage;
