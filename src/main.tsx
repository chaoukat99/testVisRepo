import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { TaxonomyProvider } from "./hooks/useTaxonomy.tsx";

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TaxonomyProvider>
        <App />
      </TaxonomyProvider>
    </ThemeProvider>
  </HelmetProvider>
);
