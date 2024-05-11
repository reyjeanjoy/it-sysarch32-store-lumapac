import React, { useState, useEffect } from 'react';
import { db, storage } from './config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './App.css'; // Import CSS file

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, 'product'));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

function Products() {
  const [product, setProduct] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setProduct(data);
    }
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (productId) => {
    if (!image) return;

    try {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(image.name);
      await imageRef.put(image);
      const imageUrl = await imageRef.getDownloadURL();

      // Update the product in Firestore with the image URL
      await db.collection('product').doc(productId).update({
        product_img: imageUrl,
      });

      // Fetch updated data from Firestore
      const data = await fetchDataFromFirestore();
      setProduct(data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h1>Product</h1>
      <div className="product-container">
        {product.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="card-link">
            <div className="card">
              {product.product_image ? (
                <img
                  src={product.product_image}
                  alt="Product Image"
                  style={{ maxWidth: '200px' }}
                />
              ) : (
                <div>
                  <input type="file" onChange={handleImageChange} />
                  <button onClick={() => handleUpload(product.id)}>Upload Image</button>
                </div>
              )}
              <p>{product.product_name}</p>
              <p>Price: ${product.product_price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;

