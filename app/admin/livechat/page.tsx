import React from 'react';
import dynamic from 'next/dynamic';

const AdminLiveChat = dynamic(() => import('../../components/AdminLiveChat'), { ssr: false });

const AdminLiveChatPage: React.FC = () => {
  return (
    <div>
      <AdminLiveChat />
    </div>
  );
};

export default AdminLiveChatPage;
