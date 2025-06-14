import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Tab, Nav, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { ImageField } from '../ImageGallery/ImageSelector';

/**
 * SEOManager component for managing SEO settings in the admin panel
 */
const SEOManager = () => {
  const [activeTab, setActiveTab] = useState('default');
  const [customPages, setCustomPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch custom SEO pages on component mount
  useEffect(() => {
    const fetchCustomPages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/seo/pages');
        setCustomPages(response.data.data || []);
      } catch (err) {
        console.error('Error fetching custom SEO pages:', err);
        setError('Failed to load custom SEO pages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomPages();
  }, []);

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setSuccess(null);
    setError(null);
  };

  // Handle adding a new page
  const handleAddPage = (pagePath) => {
    if (pagePath && !customPages.includes(pagePath)) {
      setCustomPages([...customPages, pagePath]);
      setActiveTab(pagePath);
    }
  };

  return (
    <Container fluid>
      <h1 className="mb-4">SEO Manager</h1>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Header>SEO Pages</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item 
                  action 
                  active={activeTab === 'default'}
                  onClick={() => handleTabChange('default')}
                >
                  Default SEO Settings
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'new'}
                  onClick={() => handleTabChange('new')}
                >
                  Add New Page
                </ListGroup.Item>
                {customPages.length > 0 && (
                  <>
                    <ListGroup.Item className="bg-light">
                      <strong>Custom Pages</strong>
                    </ListGroup.Item>
                    {customPages.map((page) => (
                      <ListGroup.Item 
                        key={page} 
                        action 
                        active={activeTab === page}
                        onClick={() => handleTabChange(page)}
                      >
                        {page}
                      </ListGroup.Item>
                    ))}
                  </>
                )}
              </ListGroup>
            </Card>
          </Col>
          
          <Col md={9}>
            {activeTab === 'new' ? (
              <NewPageForm onAddPage={handleAddPage} existingPages={customPages} />
            ) : (
              <SEOForm 
                page={activeTab === 'default' ? 'default' : activeTab} 
                isDefault={activeTab === 'default'}
                onSuccess={(message) => setSuccess(message)}
                onError={(message) => setError(message)}
              />
            )}
            
            {/* Success message */}
            {success && (
              <Alert variant="success" className="mt-3" dismissible onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}
            
            {/* Error message */}
            {error && (
              <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

/**
 * SEOForm component for editing SEO settings
 * @param {Object} props
 * @param {string} props.page - Page identifier
 * @param {boolean} props.isDefault - Whether this is the default SEO settings
 * @param {function} props.onSuccess - Callback on successful save
 * @param {function} props.onError - Callback on error
 */
const SEOForm = ({ page, isDefault, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    schema: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [useDefault, setUseDefault] = useState(false);

  // Fetch SEO data for the page
  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true);
        
        let endpoint = isDefault ? '/api/seo' : `/api/seo/${page}`;
        const response = await axios.get(endpoint);
        
        const data = isDefault ? response.data.data.default : response.data.data;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          keywords: data.keywords || '',
          ogTitle: data.ogTitle || '',
          ogDescription: data.ogDescription || '',
          ogImage: data.ogImage || '',
          twitterTitle: data.twitterTitle || '',
          twitterDescription: data.twitterDescription || '',
          twitterImage: data.twitterImage || '',
          canonicalUrl: data.canonicalUrl || '',
          schema: data.schema || ''
        });
        
        setUseDefault(response.data.isDefault || false);
      } catch (err) {
        console.error('Error fetching SEO data:', err);
        if (onError) onError('Failed to load SEO data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (page) {
      fetchSEOData();
    }
  }, [page, isDefault, onError]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (url, field) => {
    setFormData({ ...formData, [field]: url });
  };

  // Format JSON schema
  const formatSchema = () => {
    try {
      if (!formData.schema) return;
      
      const parsed = JSON.parse(formData.schema);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormData({ ...formData, schema: formatted });
    } catch (err) {
      if (onError) onError('Invalid JSON schema format');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validate schema if provided
      if (formData.schema) {
        try {
          JSON.parse(formData.schema);
        } catch (err) {
          if (onError) onError('Invalid JSON schema format');
          setSaving(false);
          return;
        }
      }
      
      // Prepare data for submission
      const submitData = { ...formData };
      
      // Add useDefault flag for page-specific settings
      if (!isDefault) {
        submitData.useDefault = useDefault;
      }
      
      // Submit data
      const endpoint = isDefault ? '/api/seo/default' : `/api/seo/${page}`;
      const response = await axios.put(endpoint, submitData);
      
      if (onSuccess) {
        onSuccess(isDefault 
          ? 'Default SEO settings saved successfully' 
          : `SEO settings for '${page}' saved successfully`);
      }
    } catch (err) {
      console.error('Error saving SEO data:', err);
      if (onError) onError(err.response?.data?.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete (revert to default)
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete custom SEO settings for '${page}'?`)) {
      return;
    }
    
    try {
      setSaving(true);
      
      await axios.delete(`/api/seo/${page}`);
      
      setUseDefault(true);
      
      if (onSuccess) {
        onSuccess(`Custom SEO settings for '${page}' deleted successfully`);
      }
    } catch (err) {
      console.error('Error deleting SEO data:', err);
      if (onError) onError(err.response?.data?.message || 'Failed to delete SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">
          {isDefault ? 'Default SEO Settings' : `SEO Settings for '${page}'`}
        </h4>
      </Card.Header>
      <Card.Body>
        {!isDefault && (
          <Form.Check 
            type="switch"
            id="use-default-switch"
            label="Use default SEO settings"
            checked={useDefault}
            onChange={(e) => setUseDefault(e.target.checked)}
            className="mb-3"
          />
        )}
        
        {!useDefault && (
          <Form onSubmit={handleSubmit}>
            <Tab.Container defaultActiveKey="basic">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="basic">Basic SEO</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="social">Social Media</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="advanced">Advanced</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                <Tab.Pane eventKey="basic">
                  {/* Basic SEO fields */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Title</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="title" 
                          value={formData.title} 
                          onChange={handleChange}
                          maxLength={60}
                        />
                        <Form.Text className="text-muted">
                          {formData.title.length}/60 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Meta Keywords</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="keywords" 
                          value={formData.keywords} 
                          onChange={handleChange}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange}
                      maxLength={160}
                    />
                    <Form.Text className="text-muted">
                      {formData.description.length}/160 characters
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Canonical URL</Form.Label>
                    <Form.Control 
                      type="url" 
                      name="canonicalUrl" 
                      value={formData.canonicalUrl} 
                      onChange={handleChange}
                      placeholder="https://example.com/page"
                    />
                  </Form.Group>
                </Tab.Pane>
                
                <Tab.Pane eventKey="social">
                  {/* Open Graph fields */}
                  <h5 className="mb-3">Open Graph (Facebook)</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>OG Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="ogTitle" 
                      value={formData.ogTitle} 
                      onChange={handleChange}
                      placeholder={formData.title || 'Same as Meta Title'}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>OG Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      name="ogDescription" 
                      value={formData.ogDescription} 
                      onChange={handleChange}
                      placeholder={formData.description || 'Same as Meta Description'}
                    />
                  </Form.Group>
                  
                  <ImageField 
                    label="OG Image" 
                    value={formData.ogImage} 
                    onChange={(url) => handleImageChange(url, 'ogImage')}
                    category="seo"
                  />
                  
                  {/* Twitter Card fields */}
                  <h5 className="mb-3 mt-4">Twitter Card</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Twitter Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="twitterTitle" 
                      value={formData.twitterTitle} 
                      onChange={handleChange}
                      placeholder={formData.ogTitle || formData.title || 'Same as OG Title'}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Twitter Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      name="twitterDescription" 
                      value={formData.twitterDescription} 
                      onChange={handleChange}
                      placeholder={formData.ogDescription || formData.description || 'Same as OG Description'}
                    />
                  </Form.Group>
                  
                  <ImageField 
                    label="Twitter Image" 
                    value={formData.twitterImage} 
                    onChange={(url) => handleImageChange(url, 'twitterImage')}
                    category="seo"
                  />
                </Tab.Pane>
                
                <Tab.Pane eventKey="advanced">
                  {/* JSON-LD Schema */}
                  <Form.Group className="mb-3">
                    <Form.Label>JSON-LD Schema</Form.Label>
                    <div className="d-flex justify-content-end mb-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={formatSchema}
                      >
                        Format JSON
                      </Button>
                    </div>
                    <Form.Control 
                      as="textarea" 
                      rows={10} 
                      name="schema" 
                      value={formData.schema} 
                      onChange={handleChange}
                      placeholder={`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description"
}`}
                    />
                    <Form.Text className="text-muted">
                      Enter valid JSON-LD schema markup
                    </Form.Text>
                  </Form.Group>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
            
            <div className="d-flex justify-content-between mt-4">
              {!isDefault && (
                <Button 
                  variant="outline-danger" 
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Delete Custom Settings
                </Button>
              )}
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : 'Save Settings'}
              </Button>
            </div>
          </Form>
        )}
        
        {!isDefault && useDefault && (
          <div className="text-center py-4">
            <p>This page is using the default SEO settings.</p>
            <Button 
              variant="primary" 
              onClick={() => setUseDefault(false)}
            >
              Customize SEO Settings
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

/**
 * NewPageForm component for adding a new page with custom SEO settings
 * @param {Object} props
 * @param {function} props.onAddPage - Callback when a new page is added
 * @param {Array} props.existingPages - List of existing custom pages
 */
const NewPageForm = ({ onAddPage, existingPages = [] }) => {
  const [pagePath, setPagePath] = useState('');
  const [error, setError] = useState(null);
  
  // Common page suggestions
  const pageSuggestions = [
    'home',
    'about',
    'contact',
    'blog',
    'products',
    'services',
    'faq',
    'privacy-policy',
    'terms-of-service'
  ].filter(page => !existingPages.includes(page));
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate page path
    if (!pagePath.trim()) {
      setError('Please enter a page path');
      return;
    }
    
    // Check if page already exists
    if (existingPages.includes(pagePath.trim())) {
      setError('This page already has custom SEO settings');
      return;
    }
    
    // Add new page
    onAddPage(pagePath.trim());
    setPagePath('');
    setError(null);
  };
  
  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Add New Page</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Page Path</Form.Label>
            <Form.Control 
              type="text" 
              value={pagePath} 
              onChange={(e) => setPagePath(e.target.value)}
              placeholder="e.g., about, blog, products/item-1"
            />
            <Form.Text className="text-muted">
              Enter the path of the page without leading or trailing slashes
            </Form.Text>
          </Form.Group>
          
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          
          <Button variant="primary" type="submit" className="mt-2">
            Add Page
          </Button>
        </Form>
        
        {pageSuggestions.length > 0 && (
          <div className="mt-4">
            <h5>Suggestions</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {pageSuggestions.map(page => (
                <Button 
                  key={page} 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setPagePath(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SEOManager;