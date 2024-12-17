import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductJewellery.css";

function ProductJewels() {
  const [image, setImage] = useState(null); // File to upload
  const [preview, setPreview] = useState(null); // Preview of the image
  const [uploadedImages, setUploadedImages] = useState([]); // List of images fetched from the backend
  const [message, setMessage] = useState(""); // Message for upload status

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview of the image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("email", "user@example.com"); // Replace with the actual logged-in user's email
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || "Image uploaded successfully!");
      fetchUploadedImages(); // Refresh the list of uploaded images
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  // Fetch all uploaded images
  const fetchUploadedImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images?email=user@example.com"); // Replace with actual user's email
      setUploadedImages(response.data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <div className="product-jewels-container">
      <h1>Upload and View Images</h1>

      {/* Image Upload Section */}
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>
      <p className="message">{message}</p>

      {/* Display Uploaded Images */}
      <div className="uploaded-images">
        <h2>Uploaded Images</h2>
        {uploadedImages.length === 0 ? (
          <p>No images uploaded yet.</p>
        ) : (
          <div className="image-grid">
            {uploadedImages.map((img) => (
              <div key={img._id} className="image-item">
                <img src={`http://localhost:5000/${img.filepath}`} alt={img.filename} />
                <p>{img.filename}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductJewels;
