import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateClientForm } from "@/components/create-client-form"

export default async function NewClientPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Add Client</h1>
          <p className="text-muted-foreground">
            Add a new client to your account
          </p>
        </div>

        <CreateClientForm />
      </div>
    </DashboardLayout>
  )
}











