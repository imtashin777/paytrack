import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getClients } from "@/lib/actions/clients"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import Link from "next/link"

export default async function ClientsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const clients = await getClients()

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
          {/* Unified Header with premium spacing */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
            {/* Left: Title Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Clients
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Manage your clients and their invoice history
              </p>
            </div>
          
          {/* Right: Actions Section - Aligned to same baseline */}
          <div className="flex-shrink-0">
            <Link href="/clients/new">
              <Button className="w-full sm:w-auto whitespace-nowrap" size="default">
                Add Client
              </Button>
            </Link>
            </div>
          </div>

          {clients.length === 0 ? (
            <Card className="relative overflow-hidden p-6 md:p-8">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <CardTitle>No Clients Yet</CardTitle>
              <CardDescription>
                Add your first client to start creating invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/clients/new">
                <Button>Add Your First Client</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border relative overflow-hidden overflow-x-auto w-full">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Name</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[120px] text-center sm:text-left">Total Invoices</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium break-words">{client.name}</TableCell>
                    <TableCell className="break-all text-sm sm:text-base">{client.email}</TableCell>
                    <TableCell className="text-center sm:text-left">{client.invoices.length}</TableCell>
                    <TableCell>
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

