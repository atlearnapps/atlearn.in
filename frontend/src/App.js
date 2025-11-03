import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { Suspense, lazy, useEffect } from 'react';
import AOS from 'aos';

// Styles
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Redux
import store from './Redux/store';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// Lazy loaded components
const ThemeProvider = lazy(() => import('./theme'));
const Router = lazy(() => import('./routes'));
const AppWrapper = lazy(() => import('./utils/UseAuth/AppWrapper'));

/**
 * Main App component that sets up the application with providers and routing
 */
export default function App() {
  useEffect(() => {
    // Initialize animations
    AOS.init({
      duration: 1000,
      once: true,
      disable: window.innerWidth < 768, // Disable on mobile for better performance
    });

    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingState fullscreen />}>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <AppWrapper>
                  <Router />
                </AppWrapper>
              </ThemeProvider>
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  );
}
