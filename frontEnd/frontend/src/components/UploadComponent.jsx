import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import axios from 'axios';

export default function UploadComponent() {
  const [uploadType, setUploadType] = useState('Video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    
    if (uploadType === 'Image') {
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviewUrls(prev => [...prev, ...urls]);
    } else {
      setFiles([selectedFiles[0]]);
      setPreviewUrls([urls[0]]);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        
        const contentTypeMap = {
          'Video': 'reel',
          'Image': 'post',
          'Stack Overflow': 'qa'
        };
        formData.append('contentType', contentTypeMap[uploadType]);
        formData.append('category', 'technology');
        
        if (files.length > 0) {
          files.forEach(file => {
            formData.append('media', file);
          });
        }
        
        const response = await axios.post('/api/posts/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          setTitle('');
          setDescription('');
          setFiles([]);
          setPreviewUrls([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setErrors({ success: 'Content uploaded successfully! 🎉' });
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setErrors({ general: 'Upload failed' });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleTypeChange = (e) => {
    setUploadType(e.target.value);
    setFiles([]);
    setPreviewUrls([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    alert: (type) => ({
      padding: '1rem',
      marginBottom: '1.5rem',
      borderRadius: '12px',
      fontSize: '0.95rem',
      fontWeight: '500',
      backgroundColor: type === 'error' ? '#fef2f2' : '#f0fdf4',
      border: type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
      color: type === 'error' ? '#dc2626' : '#166534'
    }),
    formGroup: {
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem'
    },
    select: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#f9fafb'
    },
    dropZone: {
      border: '2px dashed #d1d5db',
      borderRadius: '12px',
      padding: '3rem 2rem',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      minHeight: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    input: (hasError) => ({
      width: '100%',
      padding: '1rem',
      border: `2px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#f9fafb'
    }),
    textarea: (hasError) => ({
      width: '100%',
      padding: '1rem',
      border: `2px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      backgroundColor: '#f9fafb'
    }),
    error: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: '#ef4444',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚀 Upload Content</h2>
      
      {errors.general && (
        <div style={styles.alert('error')}>
          ⚠️ {errors.general}
        </div>
      )}
      
      {errors.success && (
        <div style={styles.alert('success')}>
          ✅ {errors.success}
        </div>
      )}
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Upload Type</label>
        <select value={uploadType} onChange={handleTypeChange} style={styles.select}>
          <option value="Video">🎥 Video Content</option>
          <option value="Image">🖼️ Image Post</option>
          <option value="Stack Overflow">❓ Q&A Discussion</option>
        </select>
      </div>

      {uploadType !== 'Stack Overflow' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Add {uploadType}</label>
          
          {files.length === 0 ? (
            <div style={styles.dropZone} onClick={() => fileInputRef.current?.click()}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {uploadType === 'Video' ? '🎥' : '🖼️'}
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
                  Add {uploadType.toLowerCase()}
                </p>
                <Button variant="solid" size="md">
                  Choose {uploadType}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={uploadType === 'Video' ? 'video/*' : 'image/*'}
                multiple={uploadType === 'Image'}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: uploadType === 'Image' ? 'repeat(auto-fit, minmax(150px, 1fr))' : '1fr',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                {previewUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    {uploadType === 'Video' ? (
                      <video 
                        src={url} 
                        controls 
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        style={{ 
                          width: '100%', 
                          height: '150px', 
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <button
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onClick={() => {
                        const newFiles = files.filter((_, i) => i !== index);
                        const newUrls = previewUrls.filter((_, i) => i !== index);
                        setFiles(newFiles);
                        setPreviewUrls(newUrls);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  {uploadType === 'Image' ? 'Add More Images' : 'Change Video'}
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => {
                    setFiles([]);
                    setPreviewUrls([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remove All
                </Button>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={uploadType === 'Video' ? 'video/*' : 'image/*'}
                multiple={uploadType === 'Image'}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a compelling title..."
          style={styles.input(errors.title)}
        />
        {errors.title && <p style={styles.error}>{errors.title}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide a detailed description of your content..."
          style={styles.textarea(errors.description)}
        />
        {errors.description && <p style={styles.error}>{errors.description}</p>}
      </div>

      <Button
        variant="solid"
        size="lg"
        onClick={handleSubmit}
        disabled={uploading}
        style={{ 
          width: '100%', 
          backgroundColor: uploading ? '#9ca3af' : '#10b981',
          minHeight: '48px'
        }}
      >
        {uploading ? '⏳ Uploading...' : `🚀 Upload ${uploadType}`}
      </Button>
    </div>
  );
}