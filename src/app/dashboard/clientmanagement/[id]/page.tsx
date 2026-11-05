"use client";

import { use, useState } from "react";
import { useClientById } from "@/hooks/useClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Phone, 
  MapPin, 
  Users, 
  Calendar, 
  ArrowLeft, 
  Plus, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";
import Link from "next/link";
import AddPayment from "./components/AddPayment";
import ClientPaymentSection from "./components/ClientPaymentSection"; 
import ClientOneTimePayment from "./components/ClientOneTimePayment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleClientPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const { data: client, isLoading, isError, refetch } = useClientById(clientId);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-40 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-16 bg-card border border-border rounded-xl text-center space-y-4 max-w-lg mx-auto my-12 sm:my-20 mx-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">Client not found</h3>
          <p className="text-sm text-muted-foreground">
            Could not retrieve client details. The client may have been deleted or the ID is invalid.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
          <Button asChild variant="outline" className="border-border text-foreground hover:bg-secondary w-full sm:w-auto">
            <Link href="/dashboard/clients">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
            </Link>
          </Button>
          <Button onClick={() => refetch()} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const isRetainerClient = client.type === "retainer";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground p-0 hover:bg-transparent justify-start">
          <Link href="/dashboard/clientmanagement" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 shrink-0" /> 
            <span className="truncate">Back to Client Management</span>
          </Link>
        </Button>

        <Button
          onClick={() => setIsPaymentModalOpen(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company Account
                </span>
                <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-0.5 break-words">
                  {client.companyName}
                </h1>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize shrink-0 ${
                  isRetainerClient
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                }`}
              >
                {client.type?.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                <Users className="w-4 h-4 text-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground uppercase font-medium">Owner / Rep</p>
                  <p className="font-semibold text-foreground truncate">{client.ownerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                <Building2 className="w-4 h-4 text-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground uppercase font-medium">Category</p>
                  <p className="font-semibold text-foreground truncate">{client.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                <Phone className="w-4 h-4 text-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground uppercase font-medium">Contact</p>
                  <p className="font-semibold text-foreground truncate">{client.contact}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                <MapPin className="w-4 h-4 text-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground uppercase font-medium">Address</p>
                  <p className="font-semibold text-foreground truncate">{client.address}</p>
                </div>
              </div>
            </div>
          </div>

          {isRetainerClient ? (
            <ClientPaymentSection clientId={clientId} clientType={client.type} />
          ) : (
            <ClientOneTimePayment clientId={clientId} clientType={client.type} />
          )}

        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-foreground tracking-tight">Contract Overview</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2.5 border-b border-border gap-2">
                <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                  <Calendar className="w-4 h-4" /> Added Date
                </span>
                <span className="font-semibold text-foreground text-right truncate">
                  {new Date(client.date || client.createdAt).toLocaleDateString()}
                </span>
              </div>

              {isRetainerClient && (
                <div className="flex justify-between items-center py-2.5 border-b border-border gap-2">
                  <span className="text-muted-foreground shrink-0">Monthly Retainer</span>
                  <span className="font-bold text-accent text-right truncate">
                    PKR {client.monthlyContractAmount?.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2.5 gap-2">
                <span className="text-muted-foreground shrink-0">Services</span>
                <span className="font-semibold text-foreground capitalize text-right truncate">
                  {Array.isArray(client.services) ? client.services.join(", ") : "Media / Marketing"}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary cursor-pointer gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> Record New Payment
            </Button>
          </div>
        </div>

      </div>

      <AddPayment clientId={clientId} open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen} />
    </div>
  );
}