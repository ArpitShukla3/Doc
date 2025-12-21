import { ThemeProvider } from "@components/theme-provider";
import { Spinner } from "@components/ui/spinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="lg" variant="primary" />
      </div>
    }>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </ThemeProvider>
    </Suspense>
  );
}