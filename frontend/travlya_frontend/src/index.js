import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { Clips } from "./components/clips/Clips"
import { dataLoader, Videos } from './components/videos/Videos';
import { dataLoader as videosDataLoader } from './components/videos/Videos';
import { dataLoader as clipsDataLoader } from "./components/clips/Clips";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "videos",
        element: <Videos />,
        loader: videosDataLoader
      },
      {
        path: "clips",
        element: <Clips />,
        loader: clipsDataLoader
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </React.StrictMode>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
