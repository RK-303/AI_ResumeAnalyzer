// Simple pass-through layout for auth pages.
// Auth redirect logic is handled client-side by the form components
// (they call /api/auth/me on mount and redirect to /dashboard if already logged in).

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
