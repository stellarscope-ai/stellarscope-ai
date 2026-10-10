"use client";

import { useState } from "react";

import {
  PermissionsMatrix,
  type PermissionCategory,
  type PermissionsMap,
  type EditableRole,
} from "@/components/team/permissions/permissions-matrix";
import { PermissionsSaveBar } from "@/components/team/permissions/permissions-save-bar";

const categories: PermissionCategory[] = [
  {
    id: "ai",
    label: "AI Tools",
    permissions: [
      { id: "create_chat", label: "Create chats", description: "Start new AI conversations" },
      { id: "create_agent", label: "Create agents", description: "Build and configure AI agents" },
      { id: "create_workflow", label: "Create workflows", description: "Build automation workflows" },
      { id: "manage_knowledge", label: "Manage knowledge bases", description: "Add or remove data sources" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    permissions: [
      { id: "create_project", label: "Create projects", description: "Start new workspace projects" },
      { id: "delete_project", label: "Delete projects", description: "Permanently remove projects" },
    ],
  },
  {
    id: "team",
    label: "Team",
    permissions: [
      { id: "invite_members", label: "Invite members", description: "Send team invitations" },
      { id: "remove_members", label: "Remove members", description: "Remove people from the team" },
      { id: "manage_roles", label: "Manage roles", description: "Change member permission levels" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    permissions: [
      { id: "view_billing", label: "View billing", description: "See invoices and usage" },
      { id: "manage_billing", label: "Manage billing", description: "Update plan and payment methods" },
    ],
  },
];

const defaultPermissions: PermissionsMap = {
  create_chat: { admin: true, member: true, viewer: false },
  create_agent: { admin: true, member: true, viewer: false },
  create_workflow: { admin: true, member: false, viewer: false },
  manage_knowledge: { admin: true, member: false, viewer: false },
  create_project: { admin: true, member: true, viewer: false },
  delete_project: { admin: true, member: false, viewer: false },
  invite_members: { admin: true, member: false, viewer: false },
  remove_members: { admin: true, member: false, viewer: false },
  manage_roles: { admin: false, member: false, viewer: false },
  view_billing: { admin: true, member: false, viewer: false },
  manage_billing: { admin: false, member: false, viewer: false },
};

export default function PermissionsPage() {
  const [savedPermissions, setSavedPermissions] = useState<PermissionsMap>(defaultPermissions);
  const [draftPermissions, setDraftPermissions] = useState<PermissionsMap>(defaultPermissions);

  const hasChanges =
    JSON.stringify(savedPermissions) !== JSON.stringify(draftPermissions);

  const handleToggle = (permissionId: string, role: EditableRole) => {
    setDraftPermissions((prev) => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [role]: !prev[permissionId]?.[role],
      },
    }));
  };

  const handleSave = () => {
    setSavedPermissions(draftPermissions);
    // In real app: persist to backend here
  };

  const handleDiscard = () => {
    setDraftPermissions(savedPermissions);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control what each role can do in your workspace.
        </p>
      </div>

      <PermissionsMatrix
        categories={categories}
        permissions={draftPermissions}
        onToggle={handleToggle}
      />

      <PermissionsSaveBar
        visible={hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}