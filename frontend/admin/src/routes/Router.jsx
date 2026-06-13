// import LandingPage from '../pages/LandingPage'
// import OTPLogin from '../pages/OTPLogin'
// import CitizenDashboard from '../pages/CitizenDashboard'
// import TokenBooking from '../pages/TokenBooking'
// import QueueTracking from '../pages/QueueTracking'
// import AIPrediction from '../pages/AIPrediction'
// import Notifications from '../pages/Notifications'
// import AccessibilitySettings from '../pages/AccessibilitySettings'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App.jsx";
import Layout from "../Layout.jsx";
import Login from "../components/auth/Login.jsx";
import { Home, BookToken, Dashboard, Token } from "../pages";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/book-token" element={<BookToken />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/track-token/:tokenId" element={<Token />} />

      <Route path="/app" element={<App />} />

      {/*
//       <Route path='/' element={<Home />} />
//       <Route path='/about' element={<About />} />
//       <Route path='/contact' element={<Contact />} />
//       <Route path='user/:userid' element={<User />} />
//       <Route
//         loader={githubInfoLoader}
//         path='/github'
//         element={<Github />}
//       /> */}
      {/* <Route path='/layout' element={<Layout />} /> */}
    </Route>,
  ),
);
