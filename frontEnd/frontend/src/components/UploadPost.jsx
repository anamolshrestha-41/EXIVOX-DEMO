import { useState } from 'react';
import axios from 'axios';

export default function UploadPost() {
  const [form, setForm] = useState({
    title: '', description: '', tags: ''
  });
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('tags', form.tags);
    formData.append('media', media);

    try {
      const res = await axios.post('/api/posts/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
      
      <input type="file" accept="image/*,video/*" onChange={handleFile} required />
      {preview && (
        <>
          {media?.type.startsWith('video') ? (
            <video width="300" controls src={preview}></video>
          ) : (
            <img width="200" src={preview} alt="preview" />
          )}
        </>
      )}
      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
}
