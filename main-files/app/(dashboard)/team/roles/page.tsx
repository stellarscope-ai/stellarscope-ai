"use client";

import { useState } from "react";

import RolesHeader from "@/components/team/roles/roles-header";
import RolesTable from "@/components/team/roles/roles-table";
import RoleDialog from "@/components/team/roles/role-dialog";
import PermissionsSheet from "@/components/team/roles/permissions-sheet";

export default function RolesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <RolesHeader
        onCreateRole={() => setDialogOpen(true)}
      />

      <RolesTable
        onViewPermissions={() => setSheetOpen(true)}
        onEditRole={() => setDialogOpen(true)}
      />

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <PermissionsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}