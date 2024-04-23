import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Upload.css';

function Upload() {
  const [image, setImage] = useState({ preview: '', data: '' });
  const [status, setStatus] = useState('');
  const [dockerCredentials, setDockerCredentials] = useState({ id: '', password: '' });
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    // Process DockerHub credentials and image upload here
    //console.log('Submitting to DockerHub with ID:', dockerCredentials.id, 'and password:', dockerCredentials.password);
    // Clear form and status
    try {
      // Send the image data and DockerHub credentials to the backend
      const formData = new FormData();
      formData.append('image', image.data);
      formData.append('dockerhubUsername', dockerCredentials.id);
      formData.append('dockerhubPassword', dockerCredentials.password);
      await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('Image uploaded successfully!');
    } catch (error) {
      setStatus('Error uploading image.');
      console.error('Error uploading image:', error);
    }
    setImage({ preview: '', data: '' });
    setStatus('');
    setShowDialog(false);
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  const handleChange = (e) => {
    setDockerCredentials({ ...dockerCredentials, [e.target.name]: e.target.value });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className='upload'>
      <h1>Upload to server</h1>
      {image.preview && <img src={image.preview} width='100' height='100' />}
      <hr />
      <form onSubmit={handleSubmit}>
        <input type='file' name='file' onChange={handleFileChange} />
        <button type='submit'>Upload</button>
      </form>
      {status && <h4>{status}</h4>}
      <Link to="/Selection">
        <button>Go to Selection Page</button>
      </Link>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <span className="close" onClick={handleCloseDialog}>&times;</span>
            <h2>Enter DockerHub Credentials</h2>
            <form onSubmit={handleDialogSubmit}>
              <label htmlFor="dockerId">DockerHub ID:</label>
              <input type="text" id="dockerId" name="id" value={dockerCredentials.id} onChange={handleChange} required />
              <label htmlFor="dockerPassword">DockerHub Password:</label>
              <input type="password" id="dockerPassword" name="password" value={dockerCredentials.password} onChange={handleChange} required />
              <div className="dialog-buttons">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;