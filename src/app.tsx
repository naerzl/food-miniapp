import React from 'react';
import { AppStoreProvider } from './store';
import { WebSocketProvider } from './store/WebSocketContext';
import './styles/common.scss';

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppStoreProvider>
      <WebSocketProvider>
        {children}
      </WebSocketProvider>
    </AppStoreProvider>
  );
};

export default App;
