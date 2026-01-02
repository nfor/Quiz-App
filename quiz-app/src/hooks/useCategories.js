import { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants/config';

/**
 * Custom hook to fetch and manage trivia categories
 * @returns {Object} { categories, isLoading, error, refetch }
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_CONFIG.TRIVIA_CATEGORIES_URL);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.trivia_categories || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, isLoading, error, refetch: fetchCategories };
}
