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
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your clients and their invoice history
            </p>
          </div>
          <Link href="/clients/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Add Client</Button>
          </Link>
        </div>

        {clients.length === 0 ? (
          <Card className="relative overflow-hidden">
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
          <div className="rounded-md border relative overflow-hidden overflow-x-auto">
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
                  <TableHead className="min-w-[120px]">Total Invoices</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="break-all">{client.email}</TableCell>
                    <TableCell>{client.invoices.length}</TableCell>
                    <TableCell>
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
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
    </DashboardLayout>
  )
}

