import './Home.css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import FruitsImage from '../assets/images/fruits.jpg';
import HomeBanner from '../assets/images/FruitsandVegetables_Home_Wallpaper.jpg';
import Promotions from '../components/item/Promotions';
import React from 'react';
import VegetablesImage from '../assets/images/vegetables.jpg';

const Home = () => {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Babacan</h1>
          <p>
            Your one-stop shop for the freshest fruits and vegetables, delivered to your doorstep.
          </p>
          <a href="/items" className="hero-button">
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
      <Promotions />
    </main>
  );
};

export default Home;
