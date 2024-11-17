'use client';
import React, { useState, useEffect } from 'react';
import { BusinessItemViewIfc } from '@/app/types/ifc';
import { BusinessItem } from '@/app/displays/bizitem';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/app/types/config';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import BuyerFormComponent from '../forms/buyer/page';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<BusinessItemViewIfc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    const favoriteIds = JSON.parse(Cookies.get('favorites') || '[]');
    
    if (favoriteIds.length === 0) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      const fetchedFavorites = await Promise.all(
        favoriteIds.map(async (id: string) => {
          const response = await fetch(`${BACKEND_URL}/api/py/businesses_info/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch business info for ID: ${id}`);
          }
          return response.json();
        })
      );

      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load some favorites. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;

  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <PageHeader pageName="Favorites" />
      {favorites.length === 0 ? (
        <div>
          <p>You have not added any favorites yet.</p>
          <Link href="/" className="btn btn-primary">
            Explore Businesses
          </Link>
        </div>
      ) : (
        <div>
          {favorites.map((business, index) => (
            <BusinessItem 
              key={business.ref_id} 
              business={business} 
              delay={0.1 * index}
            />
          ))}
        </div>
      )}
      <BuyerFormComponent />
    </div>
  );
}
