import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './css/_style.css';

import App from './App';
import routes from './Routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes
  }
]);

createRoot(document.querySelector('#root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);