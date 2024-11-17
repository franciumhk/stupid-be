"use client";
import './globals.css';

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from 'react';
import PageHead from './components/PageHead';
import PageFooter from './components/PageFooter';
import NavBar from './components/NavBar';
import BackToTop from './components/BackToTop';
import Loading from './components/Loading';
import LiveChat from './components/LiveChat';
import WhatsApp from './components/WhatsApp';
import Share from './components/Share';
import { FavoritesProvider } from './components/FavoritesContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <html lang="en">
      <body>
      <SessionProvider>
      <FavoritesProvider>
        <PageHead title={'StartUp Dream'}/> 
        <div className="container-xxl bg-white p-0">
        <NavBar />
        {isLoading ? <Loading /> : children}
        <BackToTop/>
        <WhatsApp 
          phoneNumber="+447563784038"
          initialMessage="I am interested in ..."
          bottomPosition={80}
        />
        <LiveChat bottomPosition={140}/>
        <Share bottomPosition={200} 
        whatsappNumber="+447563784038"
        />
        <PageFooter />
        </div>
        </FavoritesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
