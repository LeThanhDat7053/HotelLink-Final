/**
 * Debug Component - Hiển thị Property State
 * Temporary component để debug PropertyContext
 */

import { usePropertyContext } from '../context/PropertyContext';

export const PropertyDebug = () => {
  const { property, loading, error } = usePropertyContext();

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div><strong>PropertyContext Debug:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Error: {error ? error.message : 'null'}</div>
      <div>Property: {property ? property.property_name : 'null'}</div>
      <div>Code: {property?.code || 'null'}</div>
      <div>ID: {property?.id || 'null'}</div>
    </div>
  );
};
