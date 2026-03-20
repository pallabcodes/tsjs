import React from "react";
import { AppProvider } from "../store/index.js";
import { MainLayout } from "./MainLayout.js";

function AppContent() {
  return <MainLayout />;
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
