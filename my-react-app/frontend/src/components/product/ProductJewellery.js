import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import "./ProductJewellery.css";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchImages = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/images`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setImages(data.images);
        setTotalPages(data.pages);
      } else {
        console.error("Error fetching images:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  return (
    <div className="gallery-container">
      <h1>Image Gallery</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="image-grid">
            {images.map((img, index) => (
              <div key={index} className="image-card">
                <img src={img} alt={`Image ${index}`} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default ImageGallery;
