import React from 'react';
import { AppStoreProvider } from './store';
import './styles/common.scss';

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppStoreProvider>
      {children}
    </AppStoreProvider>
  );
};

export default App;
