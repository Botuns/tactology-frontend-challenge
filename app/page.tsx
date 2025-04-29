import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium tracking-tight">Department Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Login to manage your organization</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
