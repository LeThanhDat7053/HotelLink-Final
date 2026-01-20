/**
 * PropertySelector Component
 * 
 * Hiển thị dropdown để user chọn property khi họ có quyền truy cập nhiều properties
 * Chỉ hiển thị khi có >1 property
 */

import React from 'react';
import { Select } from 'antd';
import { usePropertyContext } from '../../context/PropertyContext';

interface PropertySelectorProps {
  className?: string;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({ className }) => {
  const { loading } = usePropertyContext();

  // Placeholder - không hiển thị gì
  if (!loading) {
    return null;
  }

  return (
    <Select
      className={className}
      loading={loading}
      style={{ minWidth: 200 }}
      options={[]}
      placeholder="Đang tải..."
    />
  );
};

export default PropertySelector;
