export type DocumentType = 'Agreement' | 'Brief' | 'Affidavit' | 'Appeal' | 'Complaint' | 'Deed';
export type DocumentStatus = 'Uploaded' | 'Drafted';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  matterId: string;
  matterName: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  fileUrl: string;
  fileSize: number;
  tags: string[];
}

export interface DocumentStats {
  totalDocuments: number;
  uploadedDocuments: number;
  draftedDocuments: number;
  documentsByType: Record<DocumentType, number>;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string;
  fileSize: number;
  changes: string;
} 