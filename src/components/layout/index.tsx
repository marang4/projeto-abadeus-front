import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import Tabs from '../tabs';

const Layout: React.FC = () => {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Header />

      <div className="app-body flex-grow-1">
        <main className="app-main">
          <Outlet />
        </main>
      </div>

      <Footer />
      
      <Tabs />
    </div>
  );
};

export default Layout;