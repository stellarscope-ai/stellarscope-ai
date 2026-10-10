"use client";

import DocumentsHeader from "@/components/ai/documents/documents-header";
import DocumentsStats from "@/components/ai/documents/documents-stats";
import DocumentToolbar from "@/components/ai/documents/document-toolbar";
import DocumentsTable from "@/components/ai/documents/documents-table";
import DocumentPagination from "@/components/ai/documents/document-pagination";
import { documents } from "@/components/ai/documents/mock-data";

import DocumentEmptyState from "@/components/ai/documents/document-empty-state";
import DocumentUploadDialog from "@/components/ai/documents/document-upload-dialog";
import DocumentPreviewSheet from "@/components/ai/documents/document-preview-sheet";
import DocumentDeleteDialog from "@/components/ai/documents/document-delete-dialog";

export default function DocumentsPage() {
  const hasDocuments = documents.length > 0;

  return (
    <>
      <div className="space-y-6">
        <DocumentsHeader />

        <DocumentsStats />

        <DocumentToolbar />

        {hasDocuments ? (
          <>
            <DocumentsTable />

            <DocumentPagination />
          </>
        ) : (
          <DocumentEmptyState />
        )}
      </div>

      {/* Global dialogs */}
      <DocumentUploadDialog />

      <DocumentPreviewSheet
        open={false}
        onOpenChange={() => {}}
      />

      <DocumentDeleteDialog
        open={false}
        onOpenChange={() => {}}
      />
    </>
  );
}