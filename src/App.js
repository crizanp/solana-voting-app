import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import VotingApp from './VotingApp';

const App = () => {
  return (
    <div className="App">
      <WalletMultiButton />
      <VotingApp />
    </div>
  );
};

export default App;
