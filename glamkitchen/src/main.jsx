import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ComingSoonPage from './pages/ComingSoonPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<ComingSoonPage />}>

      </Route>
    </Route>))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
