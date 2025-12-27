"use client"

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadPDFButton } from "@/components/ui/download-pdf-button-inline";

interface Contributor {
  src: string;
  alt: string;
  fallback: string;
}

type StatusVariant = "active" | "inProgress" | "onHold";

export interface Project {
  id: string;
  name: string;
  repository: string;
  team: string;
  tech: string;
  createdAt: string;
  contributors: Contributor[];
  status: {
    text: string;
    variant: StatusVariant;
  };
  // Optional: for invoice download
  invoiceData?: {
    amount: number;
    dueDate: Date;
    createdAt: Date;
    notes?: string | null;
    client: {
      name: string;
      email: string;
    };
  };
}

interface ProjectDataTableProps {
  projects: Project[];
  visibleColumns: Array<keyof Project> | Set<keyof Project>;
}

const badgeVariants = cva("capitalize text-white", {
  variants: {
    variant: {
      active: "bg-green-500 hover:bg-green-600",
      inProgress: "bg-yellow-500 hover:bg-yellow-600",
      onHold: "bg-red-500 hover:bg-red-600",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

export const ProjectDataTable = ({ projects, visibleColumns }: ProjectDataTableProps) => {
  // Convert to Set if it's an array
  const visibleColumnsSet = React.useMemo(() => {
    return visibleColumns instanceof Set ? visibleColumns : new Set(visibleColumns);
  }, [visibleColumns]);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  const tableHeaders: { key: keyof Project | "actions"; label: string }[] = [
    { key: "name", label: "Project" },
    { key: "repository", label: "Repository" },
    { key: "team", label: "Team" },
    { key: "tech", label: "Tech" },
    { key: "createdAt", label: "Created At" },
    { key: "contributors", label: "Contributors" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders
                .filter((header) => header.key === "actions" || visibleColumnsSet.has(header.key as keyof Project))
                .map((header) => (
                  <TableHead key={header.key}>{header.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {visibleColumnsSet.has("name") && (
                    <TableCell className="font-medium min-w-[120px]">{project.name}</TableCell>
                  )}

                  {visibleColumnsSet.has("repository") && (
                    <TableCell className="min-w-[100px]">
                      <Link
                        href={project.repository}
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="truncate max-w-xs">View Details</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </Link>
                    </TableCell>
                  )}

                  {visibleColumnsSet.has("team") && (
                    <TableCell className="min-w-[120px] break-words">{project.team}</TableCell>
                  )}
                  {visibleColumnsSet.has("tech") && (
                    <TableCell className="min-w-[100px]">{project.tech}</TableCell>
                  )}
                  {visibleColumnsSet.has("createdAt") && (
                    <TableCell className="min-w-[120px] whitespace-nowrap">{project.createdAt}</TableCell>
                  )}

                  {visibleColumnsSet.has("contributors") && (
                    <TableCell>
                      <div className="flex -space-x-2">
                        {project.contributors.map((contributor, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={contributor.src} alt={contributor.alt} />
                            <AvatarFallback>{contributor.fallback}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumnsSet.has("status") && (
                    <TableCell>
                      <Badge className={cn(badgeVariants({ variant: project.status.variant }))}>
                        {project.status.text}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={project.repository}>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                          View
                        </Button>
                      </Link>
                      {project.invoiceData && (
                        <DownloadPDFButton invoice={project.invoiceData} />
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnsSet.size + 1} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

