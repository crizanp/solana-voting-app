import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new createRoot API
import App from './App';
import WalletConnectionProvider from './WalletProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WalletConnectionProvider>
      <App />
    </WalletConnectionProvider>
  </React.StrictMode>
);
