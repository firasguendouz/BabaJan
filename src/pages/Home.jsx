import './Home.css';

import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Baba Jan</h1>
          <p>Your one-stop shop for the freshest fruits and vegetables, delivered to your doorstep.</p>
          <a href="/shop" className="hero-button">Shop Now</a>
        </div>
        <div className="hero-image">
          <img src="/images/hero-fruits-veggies.jpg" alt="Fresh Fruits and Vegetables" />
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories">
          <div className="category-card">
            <img src="/images/fruits.jpg" alt="Fruits" />
            <a href="/shop?category=fruits" className="category-name">Fruits</a>
          </div>
          <div className="category-card">
            <img src="/images/vegetables.jpg" alt="Vegetables" />
            <a href="/shop?category=vegetables" className="category-name">Vegetables</a>
          </div>
          <div className="category-card">
            <img src="/images/organic.jpg" alt="Organic" />
            <a href="/shop?category=organic" className="category-name">Organic</a>
          </div>
        </div>
      </section>

      <section className="promotions-section">
        <h2>Special Promotions</h2>
        <div className="promotions">
          <div className="promotion-card">
            <h3>Fresh Apples</h3>
            <p>Get 20% off this week!</p>
            <a href="/shop?item=apple" className="promo-link">Shop Now</a>
          </div>
          <div className="promotion-card">
            <h3>Organic Carrots</h3>
            <p>Buy 1kg and get 500g free!</p>
            <a href="/shop?item=carrot" className="promo-link">Shop Now</a>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>"The freshest produce I've ever bought online! The delivery was quick and the quality was exceptional."</p>
            <h4>- Sarah J.</h4>
          </div>
          <div className="testimonial-card">
            <p>"Amazing variety and great deals. I love how easy it is to shop for healthy groceries here."</p>
            <h4>- Mark T.</h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
