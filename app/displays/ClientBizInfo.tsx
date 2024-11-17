'use client';

import { useEffect } from 'react';
import { BizSchema } from '../types/bizSchema';
import BizInfo from '@/app/displays/bizinfo';

export default function ClientBizInfo({ initialBusiness }: { initialBusiness: BizSchema }) {
  const business = initialBusiness;

  useEffect(() => {
    // You can add any client-side effects here if needed
  }, []);

  return <BizInfo business={business} />;
}
