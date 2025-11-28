import "./App.css";
import { useState } from "react";
import Form from "./components/onboarding-form";
import { SubmissionsTable } from "./components/submissions/SubmissionsTable";
import { Navbar } from "./components/layout/Navbar";

function App() {
  const [currentView, setCurrentView] = useState<"form" | "table">("form");

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 container mx-auto">
        <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentView === "form" ? (
            <Form />
          ) : (
            <div className="space-y-8 px-4 py-12 sm:px-6 lg:px-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Submissions
                </h1>
                <p className="text-lg text-zinc-400 max-w-2xl">
                  View and manage all employee onboarding entries stored in the
                  system.
                </p>
              </div>

              <SubmissionsTable />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
