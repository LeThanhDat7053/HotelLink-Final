import { useState, useEffect } from 'react';
import { Typography, Spin, Alert, Button, Card, Divider, Tag } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ReloadOutlined,
  DatabaseOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useProperty, useFeatures, useFeatureCategories, useVR360Posts } from '../hooks/useAPI';
import { propertyService } from '../services/propertyService';

const { Title, Text, Paragraph } = Typography;

/**
 * Trang test kết nối API thực tế
 */
export default function APITestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  // Test với property code từ .env
  const propertyCode = import.meta.env.VITE_PROPERTY_CODE || 'fusion-suites-vung-tau';

  const runTests = async () => {
    setTesting(true);
    const results: any[] = [];

    // Test 1: Get Property
    try {
      const property = await propertyService.getPropertyByCode(propertyCode);
      results.push({
        test: 'Get Property by Code',
        endpoint: `/properties/by-code/${propertyCode}`,
        status: 'success',
        data: property,
      });
    } catch (err: any) {
      results.push({
        test: 'Get Property by Code',
        endpoint: `/properties/by-code/${propertyCode}`,
        status: 'error',
        error: err.message,
      });
    }

    // Test 2: Get Feature Categories
    try {
      const { data } = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/features/categories?include_system=true`,
        {
          headers: {
            'x-tenant-code': import.meta.env.VITE_TENANT_CODE,
          },
        }
      ).then(r => r.json());
      results.push({
        test: 'Get Feature Categories',
        endpoint: '/features/categories',
        status: 'success',
        data: data || [],
      });
    } catch (err: any) {
      results.push({
        test: 'Get Feature Categories',
        endpoint: '/features/categories',
        status: 'error',
        error: err.message,
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>
        <ApiOutlined /> API Connection Test
      </Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Paragraph>
          <Text strong>Backend:</Text> {import.meta.env.VITE_API_BASE_URL}
        </Paragraph>
        <Paragraph>
          <Text strong>Tenant:</Text> {import.meta.env.VITE_TENANT_CODE}
        </Paragraph>
        <Paragraph>
          <Text strong>Property Code:</Text> {propertyCode}
        </Paragraph>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={runTests}
          loading={testing}
        >
          Re-test Connection
        </Button>
      </Card>

      <Divider />

      {testing && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Testing API endpoints...</div>
        </div>
      )}

      {!testing && testResults.map((result, index) => (
        <Card 
          key={index}
          style={{ marginBottom: 16 }}
          title={
            <span>
              {result.status === 'success' ? (
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              )}
              {result.test}
            </span>
          }
          extra={<Tag color={result.status === 'success' ? 'success' : 'error'}>{result.status}</Tag>}
        >
          <Paragraph>
            <Text code>{result.endpoint}</Text>
          </Paragraph>
          
          {result.status === 'success' && result.data && (
            <div>
              <Text strong>Response:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 12, 
                borderRadius: 4,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
          
          {result.status === 'error' && (
            <Alert
              title="Error"
              message={result.error}
              type="error"
              showIcon
            />
          )}
        </Card>
      ))}

      <Divider />

      {/* Real-time hooks test */}
      <Title level={3}>
        <DatabaseOutlined /> React Hooks Test
      </Title>

      <HooksTestSection propertyCode={propertyCode} />
    </div>
  );
}

/**
 * Test hooks với real data
 */
function HooksTestSection({ propertyCode }: { propertyCode: string }) {
  const { property, loading: loadingProperty, error: errorProperty } = useProperty(propertyCode);
  const { categories, loading: loadingCategories, error: errorCategories } = useFeatureCategories();
  const { features, loading: loadingFeatures, error: errorFeatures } = useFeatures();
  const { posts, loading: loadingPosts, error: errorPosts } = useVR360Posts(property?.id);

  return (
    <div>
      {/* Property */}
      <Card title="useProperty Hook" style={{ marginBottom: 16 }}>
        {loadingProperty && <Spin />}
        {errorProperty && <Alert title={errorProperty.message} type="error" />}
        {property && (
          <div>
            <Paragraph>
              <Text strong>Name:</Text> {property.property_name}
            </Paragraph>
            <Paragraph>
              <Text strong>Code:</Text> {property.code}
            </Paragraph>
            <Paragraph>
              <Text strong>VR360 URL:</Text> {property.vr360_url || 'N/A'}
            </Paragraph>
          </div>
        )}
      </Card>

      {/* Categories */}
      <Card title="useFeatureCategories Hook" style={{ marginBottom: 16 }}>
        {loadingCategories && <Spin />}
        {errorCategories && <Alert title={errorCategories.message} type="error" />}
        {categories && (
          <div>
            <Text>Found {categories.length} categories</Text>
            <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
              {JSON.stringify(categories.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}
      </Card>

      {/* Features */}
      <Card title="useFeatures Hook" style={{ marginBottom: 16 }}>
        {loadingFeatures && <Spin />}
        {errorFeatures && <Alert title={errorFeatures.message} type="error" />}
        {features && (
          <div>
            <Text>Found {features.length} features</Text>
            <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
              {JSON.stringify(features.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}
      </Card>

      {/* VR360 Posts */}
      <Card title="useVR360Posts Hook" style={{ marginBottom: 16 }}>
        {loadingPosts && <Spin />}
        {errorPosts && <Alert title={errorPosts.message} type="error" />}
        {posts && (
          <div>
            <Text strong style={{ color: posts.length > 0 ? '#52c41a' : '#ff4d4f' }}>
              Found {posts.length} posts with VR360 URLs
            </Text>
            {posts.length > 0 && (
              <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
                {JSON.stringify(posts.slice(0, 2), null, 2)}
              </pre>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
