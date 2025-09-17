import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import i18nInstance from './i18n';
import { I18nextProvider } from 'react-i18next';
import { AppContextProvider } from 'packages/contexts/src/AppContext';
import { NotificationProvider } from 'packages/contexts/src/NotificationContext';
import { MessagingProvider } from 'packages/contexts/src/MessagingContext';
import { CartProvider } from 'packages/contexts/src/CartContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-surface-0 text-text-default">Loading Dashboard...</div>}>
      <I18nextProvider i18n={i18nInstance}>
        <HashRouter>
          <AppContextProvider>
            <NotificationProvider>
              <CartProvider>
                <MessagingProvider>
                    <App />
                </MessagingProvider>
              </CartProvider>
            </NotificationProvider>
          </AppContextProvider>
        </HashRouter>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);