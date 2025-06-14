import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';

/**
 * ImageUploader component for uploading images to the server
 * @param {Object} props
 * @param {Function} props.onUploadSuccess - Callback function called after successful upload
 * @param {Array} props.categories - List of available categories
 */
const ImageUploader = ({ onUploadSuccess, categories = ['general', 'blog', 'product', 'banner'] }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      // Set default title from filename if not already set
      if (!title) {
        const fileName = selectedFile.name.split('.')[0];
        setTitle(fileName.replace(/[-_]/g, ' '));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image to upload');
      return;
    }
    
    if (!title) {
      setError('Please enter a title for the image');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('altText', altText || title);
      formData.append('category', category);
      
      // Upload image
      const response = await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Handle success
      setSuccess(true);
      setFile(null);
      setPreview(null);
      setTitle('');
      setAltText('');
      setCategory('general');
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.data.data);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL when component unmounts or when preview changes
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Upload New Image</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              {/* File input */}
              <Form.Group className="mb-3">
                <Form.Label>Select Image</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Supported formats: JPG, PNG, GIF, SVG
                </Form.Text>
              </Form.Group>
              
              {/* Title input */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                  disabled={loading}
                  required
                />
              </Form.Group>
              
              {/* Alt text input */}
              <Form.Group className="mb-3">
                <Form.Label>Alt Text</Form.Label>
                <Form.Control 
                  type="text" 
                  value={altText} 
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Enter alternative text"
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Describe the image for accessibility (defaults to title if left empty)
                </Form.Text>
              </Form.Group>
              
              {/* Category select */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              {/* Submit button */}
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !file}
                className="mt-2"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Uploading...
                  </>
                ) : 'Upload Image'}
              </Button>
            </Col>
            
            <Col md={6}>
              {/* Image preview */}
              {preview ? (
                <div className="text-center">
                  <p className="mb-2">Preview:</p>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="img-fluid mb-3" 
                    style={{ 
                      maxHeight: '300px', 
                      border: '1px solid #dee2e6',
                      borderRadius: '0.25rem'
                    }} 
                  />
                </div>
              ) : (
                <div className="text-center p-5 bg-light rounded">
                  <p className="text-muted mb-0">Image preview will appear here</p>
                </div>
              )}
            </Col>
          </Row>
          
          {/* Error message */}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          
          {/* Success message */}
          {success && (
            <Alert variant="success" className="mt-3">
              Image uploaded successfully!
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ImageUploader;