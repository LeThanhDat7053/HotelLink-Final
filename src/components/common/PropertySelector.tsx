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
  const { properties, propertyId, selectProperty, loading } = usePropertyContext();

  // Không hiển thị nếu chỉ có 1 property
  if (properties.length <= 1) {
    return null;
  }

  return (
    <Select
      className={className}
      value={propertyId}
      onChange={selectProperty}
      loading={loading}
      style={{ minWidth: 200 }}
      options={properties.map(p => ({
        value: p.id,
        label: p.property_name,
      }))}
      placeholder="Chọn khách sạn"
    />
  );
};

export default PropertySelector;
