import { createRootRoute,} from "@tanstack/react-router";
import {RootLayout} from "../components/RootLayout.tsx";


export const Route = createRootRoute({
  component: RootLayout,
})