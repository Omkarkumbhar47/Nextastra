import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyUploads = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImages = async () => {
      if (!token) return;
  
      try {
        const res = await fetch("http://localhost:5000/api/image/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Fetched image data:", data); // debug
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
      }
    };
  
    fetchImages();
  }, [token]);
  

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-900">
        <p className="text-xl mb-4">Please log in to see your uploads.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gray-900">
        <p className="animate-pulse">Loading your images...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Uploaded Images</h1>

      {images.length === 0 ? (
        <p>No images uploaded yet. Go to the editor and upload some!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={img.imageUrl}
                alt="uploaded"
                className="w-full h-48 object-cover rounded"
              />
               <button
                onClick={() => navigate(`/edit/${img.imageId || img._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
