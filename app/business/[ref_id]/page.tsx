import { Suspense } from 'react';
import "../../globals.css";
import { BizSchema } from '../../types/bizSchema';
import { BACKEND_URL } from '@/app/types/config';
import ClientBizInfo from '../../displays/ClientBizInfo';
import PageHeader from "../../components/PageHeader";

async function getBusinessListing(ref_id: string): Promise<BizSchema> {
  const res = await fetch(`${BACKEND_URL}/api/py/businesses_info/${ref_id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch business listing');
  return res.json();
}

export default async function BizInfoPage({ params }: { params: { ref_id: string } }) {
  const business = await getBusinessListing(params.ref_id);

  return (
    <div>
      <PageHeader pageName={`${business.title}`} />
      <Suspense fallback={<div>Loading...</div>}>
        <ClientBizInfo initialBusiness={business} />
      </Suspense>
      <br />
    </div>
  );
}
