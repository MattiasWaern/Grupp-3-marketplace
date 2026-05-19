import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './CSS/_index.css';

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