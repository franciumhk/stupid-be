import "../globals.css";
import Head from 'next/head';

interface PageHeadProps {
  title: string;
}

const PageHead = ({ title }: PageHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/img/favicon.ico" />
    </Head>
  );
};

export default PageHead;
