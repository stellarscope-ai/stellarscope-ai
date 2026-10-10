"use client";

import { useState } from "react";

import { InvitationRow, type Invitation } from "@/components/team/invitations/invitation-row";
import { InvitationsEmptyState } from "@/components/team/invitations/invitations-empty-state";
import { InvitationsFilterBar } from "@/components/team/invitations/invitations-filter-bar";
import { InviteMemberDialog } from "@/components/team/members/invite-member-dialog";
import type { TeamRole } from "@/components/team/members/role-badge";

const initialInvitations: Invitation[] = [
  {
    id: "1",
    email: "michael@example.com",
    role: "member",
    status: "pending",
    invitedBy: "Virendra Kumar",
    invitedAt: "2h ago",
  },
  {
    id: "2",
    email: "lisa@example.com",
    role: "admin",
    status: "pending",
    invitedBy: "Sarah Chen",
    invitedAt: "1d ago",
  },
  {
    id: "3",
    email: "old-contact@example.com",
    role: "viewer",
    status: "expired",
    invitedBy: "Virendra Kumar",
    invitedAt: "14d ago",
  },
  {
    id: "4",
    email: "declined-user@example.com",
    role: "member",
    status: "declined",
    invitedBy: "Virendra Kumar",
    invitedAt: "5d ago",
  },
];

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "expired" | "declined">("all");

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch = inv.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleInvite = (invites: { email: string; role: Exclude<TeamRole, "owner"> }[]) => {
    const newInvitations: Invitation[] = invites.map((inv) => ({
      id: crypto.randomUUID(),
      email: inv.email,
      role: inv.role,
      status: "pending",
      invitedBy: "Virendra Kumar", // swap for real current-user session data
      invitedAt: "Just now",
    }));
    setInvitations((prev) => [...newInvitations, ...prev]);
  };

  const handleResend = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "pending", invitedAt: "Just now" } : inv
      )
    );
  };

  const handleCancel = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const pendingCount = invitations.filter((i) => i.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invitations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0
              ? `${pendingCount} invitation${pendingCount !== 1 ? "s" : ""} awaiting response.`
              : "Manage sent invitations."}
          </p>
        </div>

        {invitations.length > 0 && <InviteMemberDialog onInvite={handleInvite} />}
      </div>

      {invitations.length > 0 && (
        <InvitationsFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {invitations.length === 0 ? (
        <InvitationsEmptyState onInvite={handleInvite} />
      ) : filteredInvitations.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No invitations match your search.
        </p>
      ) : (
        <div className="rounded-xl border divide-y">
          {filteredInvitations.map((invitation) => (
            <InvitationRow
              key={invitation.id}
              invitation={invitation}
              onResend={handleResend}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}