import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PF6Rv2LbQSFBqvklpA7iqVOFUsJSxceTQsFi9BPtodsDS43aZxWRC0XREpgGeUutvh4Zfbq5znpVvUwPJl66mkG00ZIH9vU7R');

function productDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const docRef = doc(db, 'product', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log('No such document!');
      }
    }
    fetchProduct();
  }, [id]);

  const handleClick = async (productName, price) => {
    const stripe = await stripePromise;

    // Send a request to the backend to create a checkout session
    const response = await fetch('http://34.87.89.205/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName, price }), // Send product name and price to the backend
    });

    if (response.ok) {
      // If the request is successful, retrieve the session ID from the response
      const session = await response.json();

      // Redirect the user to the Stripe Checkout page using the session ID
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        // If there is an error during the redirect, display the error message
        setError(result.error.message);
      }
    } else {
      // If there is an error creating the checkout session, display an error message
      setError('Error creating checkout session');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      <div>
        <img src={product.product_image} alt="Product" />
        <p>Name: {product.product_name}</p>
        <p>Price: ${product.product_price}</p>

        <p>Description: {product.product_description}</p>
        <p>Quantity: {product.product_quantity}</p>

      <button onClick={()=>handleClick(product.productName,product.price*100)}>CHECKOUT</button>
    </div>
    </div>
    
  );
}

export default productDetails;
