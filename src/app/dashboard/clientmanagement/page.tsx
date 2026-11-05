"use client";

import { useState } from "react";
import { useClients } from "@/hooks/useClient";
import AddClient from "./components/AddClient";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus, Users, Phone, MapPin, Building2, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useClients(page);


  const clients = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Client Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your active client accounts, retainers, and contracts for ApexLedger.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>

      <AddClient open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="space-y-2 pt-2 border-t border-border">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center space-y-4 my-12">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">Failed to load clients</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Could not retrieve client data from the server. Please check your connection and try again.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again / Refetch
          </Button>
        </div>
      )}

      {!isLoading && !isError && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 bg-card border border-border rounded-xl text-center space-y-4 my-12">
          <div className="w-16 h-16 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-lg text-foreground">No clients found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't added any clients yet. Get started by creating your first client record.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Client
          </Button>
        </div>
      )}

      {!isLoading && !isError && clients.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client: any) => (
              <Link
                key={client._id}
                href={`/dashboard/clientmanagement/${client._id}`}
                className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-accent/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
                      {client.companyName}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize shrink-0 ${
                        client.type === "retainer"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}
                    >
                      {client.type?.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-4">
                    <Building2 className="w-3.5 h-3.5" />
                    {client.category}
                  </p>

                  <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span className="text-foreground font-medium">Owner:</span> {client.ownerName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span className="text-foreground font-medium">Contact:</span> {client.contact}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span className="text-foreground font-medium truncate">Address:</span>{" "}
                      <span className="truncate">{client.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(client.date || client.createdAt).toLocaleDateString()}</span>
                  </div>

                  {client.type === "retainer" && client.monthlyContractAmount && (
                    <div className="font-semibold text-accent">
                      PKR {client.monthlyContractAmount.toLocaleString()} / mo
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}