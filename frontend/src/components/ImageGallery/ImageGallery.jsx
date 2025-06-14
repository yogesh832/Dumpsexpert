import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Container, Row, Col, Card, Button, Form, Pagination } from 'react-bootstrap';

/**
 * ImageGallery component for displaying and managing uploaded images
 * @param {Object} props
 * @param {boolean} props.selectable - Whether images can be selected
 * @param {function} props.onSelect - Callback when an image is selected
 * @param {string} props.category - Filter images by category
 * @param {number} props.limit - Number of images per page
 */
const ImageGallery = ({ selectable = false, onSelect, category, limit = 12 }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch images when page, category, or search term changes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = { page, limit };
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        
        const response = await axios.get('/api/images', { params });
        
        setImages(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, selectedCategory, searchTerm, limit]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/images/categories');
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Handle image selection
  const handleSelect = (image) => {
    if (selectable && onSelect) {
      onSelect(image);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page when changing category
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  // Render pagination controls
  const renderPagination = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(page - 1)} 
        disabled={page === 1} 
      />
    );
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= page - 1 && i <= page + 1) // Pages around current page
      ) {
        items.push(
          <Pagination.Item 
            key={i} 
            active={i === page} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      } else if (i === page - 2 || i === page + 2) {
        // Ellipsis for skipped pages
        items.push(<Pagination.Ellipsis key={`ellipsis-${i}`} />);
      }
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(page + 1)} 
        disabled={page === totalPages} 
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container>
      {/* Search and filter controls */}
      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary" className="ms-2">
                Search
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6}>
          <Form.Select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Error message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loading spinner */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Image grid */}
          {images.length === 0 ? (
            <Alert variant="info">No images found.</Alert>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {images.map((image) => (
                <Col key={image._id}>
                  <Card 
                    className={`h-100 ${selectable ? 'cursor-pointer' : ''}`}
                    onClick={() => handleSelect(image)}
                  >
                    <Card.Img 
                      variant="top" 
                      src={image.imageUrl} 
                      alt={image.altText || image.title} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title className="text-truncate">{image.title}</Card.Title>
                      <Card.Text className="small text-muted">
                        {image.category && (
                          <span className="badge bg-secondary me-2">
                            {image.category}
                          </span>
                        )}
                        {image.format && (
                          <span className="badge bg-info me-2">
                            {image.format.toUpperCase()}
                          </span>
                        )}
                        {image.size && (
                          <span>
                            {Math.round(image.size / 1024)} KB
                          </span>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              {renderPagination()}
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ImageGallery;