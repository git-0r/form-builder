import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { Navbar } from "./components/layout/Navbar";
import { SubmissionsTable } from "./components/submissions/SubmissionsTable";
import OnboardingForm from "./components/onboarding-form";
import { submissionSearchSchema } from "./lib/submissionSearchSchema";

const rootRoute = createRootRoute({
  component: () => (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: OnboardingForm,
});

const submissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submissions",
  component: SubmissionsTable,
  // Bind the Zod schema to validate URL params automatically
  validateSearch: (search) => submissionSearchSchema.parse(search),
});

const routeTree = rootRoute.addChildren([indexRoute, submissionsRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
