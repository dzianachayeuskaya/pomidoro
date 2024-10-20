import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Layout } from './components/Layout';
import { Stat } from './pages/Stat';
import { NotFound } from './pages/NotFound';
import { MainContent } from './components/MainContent';
import { TimerBlock } from './components/TimerBlock';
import { Info } from './pages/Info';
import { Settings } from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <MainContent />,
        children: [
          {
            path: 'task/:taskId',
            element: <TimerBlock />,
          },
        ],
      },
      {
        path: 'statistics',
        element: <Stat />,
      },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
