import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductJewellery() {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch images from the server (replace with the correct API endpoint)
    axios.get("http://localhost:5000/images")
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        setMessage("Error loading images.");
      });
  }, []);

  const handleSkip = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  const handleSkipAll = () => {
    setImages([]);
  };

  const handleEdit = (id) => {
    // Implement the edit functionality (open a modal or form to edit the image details)
    console.log("Edit image", id);
  };

  const handleUpload = async (e) => {
    const formData = new FormData();
    for (let file of e.target.files) {
      formData.append("images", file);
    }

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || "Images uploaded successfully!");
      setImages([...images, ...response.data.images]);
    } catch (error) {
      setMessage("Error uploading images.");
    }
  };

  return (
    <div>
      <h2>Jewellery Products</h2>

      <input type="file" multiple onChange={handleUpload} />
      <p>{message}</p>

      <div>
        <button onClick={handleSkipAll}>Skip All</button>
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id}>
              <img src={image.url} alt={image.name} width="100" />
              <p>{image.name}</p>
              <button onClick={() => handleSkip(image.id)}>Skip</button>
              <button onClick={() => handleEdit(image.id)}>Edit</button>
            </div>
          ))
        ) : (
          <p>No images to display.</p>
        )}
      </div>
    </div>
  );
}

export default ProductJewellery;
