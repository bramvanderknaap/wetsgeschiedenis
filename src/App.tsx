import { createBrowserRouter, createHashRouter, createMemoryRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { Kopbalk } from "./components/Kopbalk";
import { Home } from "./pages/Home";
import { WetPagina } from "./pages/WetPagina";
import { ArtikelPagina } from "./pages/ArtikelPagina";
import { NietGevondenPagina } from "./pages/NietGevondenPagina";

function Schil() {
  return (
    <>
      <a className="sla-over" href="#inhoud">
        Naar de inhoud
      </a>
      <Kopbalk />
      <main id="inhoud">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}

const routes = [
  {
    element: <Schil />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/wet/:bwbId", element: <WetPagina /> },
      { path: "/wet/:bwbId/artikel/:nummer", element: <ArtikelPagina /> },
      { path: "*", element: <NietGevondenPagina /> },
    ],
  },
];

// "browser": nette URL's (standaard). "hash": werkt op elke statische host.
// "memory": voor een ingesloten voorvertoning waar de adresbalk niet van de app is.
const modus = import.meta.env.VITE_ROUTER;
const router =
  modus === "memory"
    ? createMemoryRouter(routes)
    : modus === "hash"
      ? createHashRouter(routes)
      : createBrowserRouter(routes);

export function App() {
  return <RouterProvider router={router} />;
}
