import 'swiper/css';
import 'swiper/css/autoplay';
import './Promotions.css';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay } from 'swiper/modules';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/promotions/active'); // Call the active promotions API
        const data = await response.json();
        if (response.ok) {
          setPromotions(data.data); // Assuming `data.data` contains the array of promotions
        } else {
          setError(data.message || 'Failed to load promotions');
        }
      } catch (err) {
        setError('Error fetching promotions');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <div>Loading promotions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
        {promotions.map((promo) => (
          <SwiperSlide key={promo._id.$oid || promo._id}>
            <div className="promotion-card">
              <h3>{promo.title}</h3>
              <p>
                {promo.type === 'percentage'
                  ? `${promo.discountValue}% Off`
                  : `Flat €${promo.discountValue} Off`}
              </p>
              <p>Valid until: {new Date(promo.endDate.$date || promo.endDate).toLocaleDateString()}</p>
              <a href={`/items?categories=${promo.applicableTo.categories.join(',')}`} className="promo-link">
                Shop Now
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Promotions;
