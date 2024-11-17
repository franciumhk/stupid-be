import "../globals.css";
import React from 'react';

const PageHeader = ({ pageName }: { pageName: string } ) => {
  return (
    <div className="container-xxl py-5 bg-dark page-header mb-5">
      <div className="container my-5 pt-5 pb-4">
        <h1 className="display-3 text-white mb-3 animated slideInDown title-wrap">
          {pageName}
        </h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb text-uppercase">
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default PageHeader;
