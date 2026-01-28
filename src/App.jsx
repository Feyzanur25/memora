import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import UseCases from "./components/UseCases";
import Footer from "./components/Footer";

import CreateCapsule from "./pages/CreateCapsule";
import MyCapsules from "./pages/MyCapsules";
import CapsuleDetail from "./pages/CapsuleDetail";
import Success from "./pages/Success";
import WalletLogin from "./pages/WalletLogin";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <HowItWorks />
              <UseCases />
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<WalletLogin />} />
        <Route path="/create-capsule" element={<CreateCapsule />} />
        <Route path="/my-capsules" element={<MyCapsules />} />
        <Route path="/capsules/:id" element={<CapsuleDetail />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
}

export default App;
