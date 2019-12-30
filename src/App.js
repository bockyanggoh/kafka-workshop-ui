import React from 'react';
import logo from './logo.svg';
import './App.css';
import Footer from "./components/Footer/Footer";
import OrderPage from "./components/OrderPage/OrderPage";

function App() {
  return (
    <div className="div_parent">
      <div className="div_menu">
        header
      </div>
      <div className="div_load_content">
        <OrderPage/>
      </div>
      <div className="div_footer">
        <Footer/>
      </div>
    </div>
  );
}

export default App
