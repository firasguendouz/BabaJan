import { useEffect, useState } from 'react';

import axiosInstance from '../api/axiosInstance';

const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Track component mounting status to prevent state updates on unmounted components
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance(url, options);
        if (isMounted) {
          // Safely update state if the component is still mounted
          setData(response.data?.data || []); // Extract `data` or default to an empty array
        }
      } catch (err) {
        if (isMounted) {
          // Handle error state
          setError(err.response?.data?.message || err.message || 'Something went wrong');
        }
      } finally {
        if (isMounted) {
          // Safely set loading to false if mounted
          setLoading(false);
        }
      }
    };

    if (url) fetchData(); // Only fetch if URL is provided

    return () => {
      // Cleanup function to prevent memory leaks
      isMounted = false;
    };
  }, [url, ...dependencies]); // Spread dependencies to track dynamic changes

  return { data, loading, error };
};

export default useFetch;
