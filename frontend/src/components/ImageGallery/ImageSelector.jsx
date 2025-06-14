import React, { useState, useEffect } from 'react';
import { Modal, Button, Nav, Tab, Form, Image } from 'react-bootstrap';
import ImageGallery from './ImageGallery';
import ImageUploader from './ImageUploader';
import axios from 'axios';

/**
 * ImageSelector component for selecting or uploading images
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {function} props.onHide - Function to call when hiding the modal
 * @param {function} props.onSelect - Function to call when an image is selected
 * @param {string} props.selectedImage - Currently selected image URL
 * @param {string} props.category - Default category filter for the gallery
 */
const ImageSelector = ({ show, onHide, onSelect, selectedImage, category }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [categories, setCategories] = useState([]);
  const [selectedImageData, setSelectedImageData] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/images/categories');
        setCategories(response.data.data || ['general']);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show]);

  // Handle image selection from gallery
  const handleImageSelect = (image) => {
    setSelectedImageData(image);
  };

  // Handle image upload success
  const handleUploadSuccess = (image) => {
    setSelectedImageData(image);
    setActiveTab('gallery');
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (selectedImageData && onSelect) {
      onSelect(selectedImageData);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Select Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="gallery">Image Gallery</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="upload">Upload New Image</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="gallery">
              {/* Selected image preview */}
              {selectedImageData && (
                <div className="mb-3 p-3 border rounded">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Image 
                        src={selectedImageData.imageUrl} 
                        alt={selectedImageData.altText || selectedImageData.title} 
                        thumbnail 
                        style={{ maxWidth: '100px', maxHeight: '100px' }} 
                      />
                    </div>
                    <div>
                      <h5 className="mb-1">{selectedImageData.title}</h5>
                      <p className="mb-0 text-muted small">
                        {selectedImageData.category && (
                          <span className="badge bg-secondary me-2">
                            {selectedImageData.category}
                          </span>
                        )}
                        {selectedImageData.format && (
                          <span className="badge bg-info me-2">
                            {selectedImageData.format.toUpperCase()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image gallery */}
              <ImageGallery 
                selectable={true} 
                onSelect={handleImageSelect} 
                category={category}
                limit={12}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="upload">
              <ImageUploader 
                onUploadSuccess={handleUploadSuccess} 
                categories={categories}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirmSelection}
          disabled={!selectedImageData}
        >
          Select Image
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * ImageField component for form fields that require image selection
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current image URL value
 * @param {function} props.onChange - Function to call when value changes
 * @param {string} props.category - Default category filter for the gallery
 */
export const ImageField = ({ label, value, onChange, category }) => {
  const [showSelector, setShowSelector] = useState(false);
  
  // Handle image selection
  const handleSelect = (image) => {
    if (onChange) {
      onChange(image.imageUrl, image);
    }
  };
  
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center mb-2">
        <Button 
          variant="outline-primary" 
          onClick={() => setShowSelector(true)}
          className="me-2"
        >
          {value ? 'Change Image' : 'Select Image'}
        </Button>
        {value && (
          <Button 
            variant="outline-danger" 
            onClick={() => onChange('', null)}
            size="sm"
          >
            Remove
          </Button>
        )}
      </div>
      
      {/* Image preview */}
      {value && (
        <div className="mt-2">
          <Image 
            src={value} 
            alt="Selected image" 
            thumbnail 
            style={{ maxWidth: '200px', maxHeight: '200px' }} 
          />
        </div>
      )}
      
      {/* Image selector modal */}
      <ImageSelector 
        show={showSelector} 
        onHide={() => setShowSelector(false)} 
        onSelect={handleSelect}
        selectedImage={value}
        category={category}
      />
    </Form.Group>
  );
};

export default ImageSelector;