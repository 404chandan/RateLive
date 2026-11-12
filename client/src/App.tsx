import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExplorePage } from "./pages/ExplorePage";
import { BusinessDashboard } from "./pages/BusinessDashboard";
import { BusinessReviewsPage } from "./pages/BusinessReviewsPage";
import { BusinessSentimentPage } from "./pages/BusinessSentimentPage";
import { BusinessCompetitorsPage } from "./pages/BusinessCompetitorsPage";
import { LiveIntelligencePage } from "./pages/LiveIntelligencePage";
import { LoginPage } from "./pages/LoginPage";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Customer Routes */}
          <Route path="/" element={<ExplorePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/live" element={<LiveIntelligencePage />} />
          <Route path="/auth/login" element={<LoginPage />} />

          {/* Restaurant Business Intelligence Platform */}
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/reviews" element={<BusinessReviewsPage />} />
          <Route path="/business/sentiment" element={<BusinessSentimentPage />} />
          <Route path="/business/competitors" element={<BusinessCompetitorsPage />} />
          <Route path="/business/locations" element={<BusinessDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

