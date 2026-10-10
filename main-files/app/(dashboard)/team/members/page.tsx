"use client";

import { useState } from "react";

import { MemberRow, type TeamMember } from "@/components/team/members/member-row";
import { InviteMemberDialog } from "@/components/team/members/invite-member-dialog";
import { MembersEmptyState } from "@/components/team/members/members-empty-state";
import { MembersFilterBar } from "@/components/team/members/members-filter-bar";
import type { TeamRole } from "@/components/team/members/role-badge";

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Virendra Kumar",
    email: "virendra@codervent.com",
    role: "owner",
    status: "online",
    joinedAt: "Jan 2025",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@codervent.com",
    role: "admin",
    status: "online",
    joinedAt: "Mar 2025",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@codervent.com",
    role: "member",
    status: "offline",
    joinedAt: "Jun 2025",
  },
  {
    id: "4",
    name: "Priya Patel",
    email: "priya@codervent.com",
    role: "viewer",
    status: "offline",
    joinedAt: "Nov 2025",
  },
];

// Simulates the logged-in user's role — swap for real auth/session data
const currentUserRole: TeamRole = "owner";

export default function MembersPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "member" | "viewer">("all");

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.role === filter;
    return matchesSearch && matchesFilter;
  });

  const handleInvite = (invites: { email: string; role: Exclude<TeamRole, "owner"> }[]) => {
    console.log("sending invites:", invites);
    // In real app: POST to backend, likely lands in the Invitations page as "pending"
  };

  const handleChangeRole = (id: string, role: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage who has access to your workspace.
          </p>
        </div>

        {members.length > 0 && <InviteMemberDialog onInvite={handleInvite} />}
      </div>

      {members.length > 0 && (
        <MembersFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {members.length === 0 ? (
        <MembersEmptyState onInvite={handleInvite} />
      ) : filteredMembers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No members match your search.
        </p>
      ) : (
        <div className="rounded-xl border divide-y">
          {filteredMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              currentUserRole={currentUserRole}
              onChangeRole={handleChangeRole}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}