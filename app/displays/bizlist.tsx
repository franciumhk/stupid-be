import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { BizitemComponent } from './bizitem';
import { useInfiniteScroll } from '@/app/components/useInfiniteScroll';
import { BusinessItemViewIfc } from '@/app/types/ifc';
import { BACKEND_URL } from '@/app/types/config';
import SearchForm from '../forms/SearchForm';
import { DEFAULT_LIMITS } from '../types/const';

const MemoizedBusinessItems = React.memo(BizitemComponent);

const BizList: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    bizitems: [] as BusinessItemViewIfc[],
    page: 0,
    hasMore: true,
  });

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    priceRange: [DEFAULT_LIMITS.MIN_PRICE, DEFAULT_LIMITS.MAX_PRICE] as [number, number],
    turnoverRange: [DEFAULT_LIMITS.MIN_TURNOVER, DEFAULT_LIMITS.MAX_TURNOVER] as [number, number],
    location: '',
    business_type: '',
    industry: ''
  });

  const fetchBusinesses = useCallback(async (resetPage = false) => {
    if ((!state.hasMore && !resetPage) || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const queryParams = new URLSearchParams({
        skip: resetPage ? '0' : (state.page * DEFAULT_LIMITS.BIZ_FETCH_COUNT).toString(),
        limit: DEFAULT_LIMITS.BIZ_FETCH_COUNT.toString(),
      });

      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === 'priceRange' || key === 'turnoverRange') {
            queryParams.append(`${key}Min`, value[0].toString());
            queryParams.append(`${key}Max`, value[1].toString());
          }
        } else if (value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `${BACKEND_URL}/api/py/businesses/search`;
      const response = await fetch(`${endpoint}?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.status} ${response.statusText}`);
      }
      const data: BusinessItemViewIfc[] = await response.json();

      setState(prev => ({
        ...prev,
        bizitems: resetPage ? data : [...prev.bizitems, ...data],
        page: resetPage ? 1 : prev.page + 1,
        hasMore: data.length === DEFAULT_LIMITS.BIZ_FETCH_COUNT,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setState(prev => ({ ...prev, isLoading: false, hasMore: false }));
    }
  }, [state.page, state.hasMore, state.isLoading, searchParams]);

  useEffect(() => {
    fetchBusinesses(true);
  }, []);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loadMoreRef, () => {
    if (state.hasMore && !state.isLoading) {
      fetchBusinesses();
    }
  });

  const handleSearchChange = (name: string, value: string | number | [number, number]) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      page: 0,
      hasMore: true,
    }));
    await fetchBusinesses(true);
  };

  const handleResetSearch = useCallback(() => {
    setSearchParams({
      keyword: '',
      priceRange: [DEFAULT_LIMITS.MIN_PRICE, DEFAULT_LIMITS.MAX_PRICE],
      turnoverRange: [DEFAULT_LIMITS.MIN_TURNOVER, DEFAULT_LIMITS.MAX_TURNOVER],
      location: '',
      business_type: '',
      industry: ''
    });
    setState(prev => ({
      ...prev,
      page: 0,
      hasMore: true,
    }));
    fetchBusinesses(true);
  }, []);

  const filteredBizitems = useMemo(() => {
    return state.bizitems.filter(item => {
      return (
        (searchParams.keyword === '' || item.title.toLowerCase().includes(searchParams.keyword.toLowerCase())) &&
        item.price >= searchParams.priceRange[0] &&
        item.price <= searchParams.priceRange[1] &&
        item.turnover >= searchParams.turnoverRange[0] &&
        item.turnover <= searchParams.turnoverRange[1] &&
        (searchParams.location === '' || item.location === searchParams.location) &&
        (searchParams.industry === '' || item.industry.includes(searchParams.industry))
      );
    });
  }, [state.bizitems, searchParams]);

  return (
    <Container fluid className="py-5">
      <Container>
        <SearchForm
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          handleResetSearch={handleResetSearch}
        />

        <div className="tab-content">
          <div className="tab-pane fade show active p-0">
            {filteredBizitems.length > 0 ? (
              <>
                <MemoizedBusinessItems bizitems={filteredBizitems} />
                <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }} />
              </>
            ) : (
              <p className="text-center mt-3">No businesses found matching your criteria.</p>
            )}
            {!state.hasMore && filteredBizitems.length > 0 && (
              <p className="text-center mt-3">No more businesses to load.</p>
            )}
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default BizList;
