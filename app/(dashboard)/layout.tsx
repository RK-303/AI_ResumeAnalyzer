import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token || !verifyJWT(token)) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="flex h-screen flex-col bg-background">
        {/* Top navbar */}
        <Navbar />

        {/* Body: sidebar + main */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — hidden on mobile */}
          <Sidebar className="hidden md:flex" />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
