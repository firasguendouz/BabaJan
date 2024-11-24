import './Home.css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import FruitsImage from '../assets/images/fruits.jpg';
import HomeBanner from '../assets/images/FruitsandVegetables_Home_Wallpaper.jpg';
import { Navigation } from 'swiper/modules';
import OrganicImage from '../assets/images/organic.jpg';
import React from 'react';
import VegetablesImage from '../assets/images/vegetables.jpg';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Baba Jan</h1>
          <p>
            Your one-stop shop for the freshest fruits and vegetables, delivered to your
            doorstep.
          </p>
          <a href="/shop" className="hero-button">
            Shop Now
          </a>
        </div>
        <div className="hero-image">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation
          >
            <SwiperSlide>
              <img src={HomeBanner} alt="Fresh Fruits and Vegetables" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={FruitsImage} alt="Fruits" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={VegetablesImage} alt="Vegetables" />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>



      {/* Promotions Section */}
      <section className="promotions-section">
        <h2>Special Promotions</h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          autoplay={{ delay: 4000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
        >
          <SwiperSlide>
            <div className="promotion-card">
              <h3>Fresh Apples</h3>
              <p>Get 20% off this week!</p>
              <a href="/shop?item=apple" className="promo-link">
                Shop Now
              </a>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="promotion-card">
              <h3>Organic Carrots</h3>
              <p>Buy 1kg and get 500g free!</p>
              <a href="/shop?item=carrot" className="promo-link">
                Shop Now
              </a>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>


    </div>
  );
};

export default Home;
