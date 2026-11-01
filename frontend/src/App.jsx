
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AccountTree } from "@mui/icons-material";

import PublicLayout from "./layouts/PublicLayout";
import WorkspaceLayout from "./layouts/WorkspaceLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import PatentDetailsPage from "./pages/PatentDetailsPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import KnowledgeGraphPage from "./pages/KnowledgeGraphPage";
import SavedPatentsPage from "./pages/SavedPatentsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "#F5FAF7",
        animation: "fadeIn 0.5s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          width: 82,
          height: 82,
          display: "grid",
          placeItems: "center",
          position: "relative",
          borderRadius: "50%",
          bgcolor: "#E2F4EC",
          color: "#07866F",
          animation: "float 1.8s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-7px)" },
          },
        }}
      >
        <AccountTree sx={{ fontSize: 43 }} />
        <CircularProgress
          size={82}
          thickness={2}
          sx={{
            color: "#07866F",
            position: "absolute",
            inset: 0,
          }}
        />
      </Box>

      <Typography
        sx={{
          mt: 1,
          color: "#173B32",
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        PatentGraph
      </Typography>

      <Typography sx={{ color: "#66736F", fontSize: 14 }}>
        Connecting patent knowledge...
      </Typography>
    </Box>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/workspace" element={<WorkspaceLayout />}>
        <Route index element={<HomePage />} />
        <Route path="history" element={<SearchHistoryPage />} />
        <Route path="graph" element={<KnowledgeGraphPage />} />
        <Route path="saved" element={<SavedPatentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/search" element={<SearchResultsPage />} />
      <Route
        path="/patent/:applicationNumber"
        element={<PatentDetailsPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {loading ? <LoadingScreen /> : <AppRoutes />}
    </BrowserRouter>
  );
}
