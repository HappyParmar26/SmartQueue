import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App.jsx";
// import Layout from "../Layout.jsx";
// import Login from "../components/auth/Login.jsx";
// import { Home, BookToken, Dashboard, Token } from "../pages";

export const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path="/app" element={<App />}>
    
  </Route>
),
);
