/*
  Warnings:

  - You are about to drop the column `qr_code` on the `HallTicket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qr_token]` on the table `HallTicket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seat_number,hall_name,exam_id]` on the table `HallTicket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qr_token` to the `HallTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HallTicket" DROP COLUMN "qr_code",
ADD COLUMN     "block" TEXT,
ADD COLUMN     "bulk_upload_job_id" TEXT,
ADD COLUMN     "examDate" TIMESTAMP(3),
ADD COLUMN     "exam_session" TEXT,
ADD COLUMN     "exam_time" TEXT,
ADD COLUMN     "gate" TEXT,
ADD COLUMN     "hall_name" TEXT,
ADD COLUMN     "hall_ticket_number" TEXT,
ADD COLUMN     "invigilator_name" TEXT,
ADD COLUMN     "is_locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locked_at" TIMESTAMP(3),
ADD COLUMN     "pdf_path" TEXT,
ADD COLUMN     "qr_image_path" TEXT,
ADD COLUMN     "qr_token" TEXT NOT NULL,
ADD COLUMN     "seat_number" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "SosAlert" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "location" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'HIGH',
    "resolvedAt" TIMESTAMP(3),
    "resolved_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SosAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrScan" (
    "id" TEXT NOT NULL,
    "hall_ticket_id" TEXT NOT NULL,
    "hall_ticket_qr_id" TEXT,
    "scanned_by" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "device_info" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "validation_error" TEXT,

    CONSTRAINT "QrScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudAttempt" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "FraudAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "targetRoles" TEXT[],
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiDecision" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT,
    "context_id" TEXT,
    "isOverridden" BOOLEAN NOT NULL DEFAULT false,
    "overridden_by" TEXT,
    "overriddenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "marked_by" TEXT,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "club_id" TEXT,
    "event_id" TEXT,
    "category" TEXT NOT NULL,
    "allocated" DECIMAL(10,2) NOT NULL,
    "spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "remaining" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fiscal_year" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetExpense" (
    "id" TEXT NOT NULL,
    "budget_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" TEXT NOT NULL,
    "approved_by" TEXT,
    "approvedAt" TIMESTAMP(3),
    "receipt_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updated_by" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkUploadJob" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "processed_rows" INTEGER NOT NULL DEFAULT 0,
    "success_rows" INTEGER NOT NULL DEFAULT 0,
    "failed_rows" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "exam_session" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error_summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulkUploadJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkUploadLog" (
    "id" TEXT NOT NULL,
    "bulk_upload_job_id" TEXT NOT NULL,
    "row_number" INTEGER NOT NULL,
    "student_id" TEXT,
    "exam_id" TEXT,
    "status" TEXT NOT NULL,
    "error_message" TEXT,
    "processing_data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulkUploadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HallTicketQr" (
    "id" TEXT NOT NULL,
    "hall_ticket_id" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "qr_data" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),
    "scan_count" INTEGER NOT NULL DEFAULT 0,
    "last_scanned_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HallTicketQr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSeating" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "hall_name" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "student_id" TEXT,
    "is_reserved" BOOLEAN NOT NULL DEFAULT false,
    "gate" TEXT,
    "block" TEXT,
    "row_number" INTEGER,
    "col_number" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSeating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "certificate_type" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'ACADEMIC',
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_hash" TEXT NOT NULL,
    "is_important" BOOLEAN NOT NULL DEFAULT false,
    "is_resume_visible" BOOLEAN NOT NULL DEFAULT false,
    "is_portfolio_visible" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),
    "share_token" TEXT,
    "folder_id" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateFolder" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3B82F6',
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateTag" (
    "id" TEXT NOT NULL,
    "certificate_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "tag_type" TEXT NOT NULL DEFAULT 'SKILL',

    CONSTRAINT "CertificateTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateAttachment" (
    "id" TEXT NOT NULL,
    "certificate_id" TEXT NOT NULL,
    "attachment_type" TEXT NOT NULL,
    "attachment_id" TEXT NOT NULL,
    "attached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_student_id_course_id_date_key" ON "Attendance"("student_id", "course_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HallTicketQr_qr_token_key" ON "HallTicketQr"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSeating_exam_id_hall_name_seat_number_key" ON "ExamSeating"("exam_id", "hall_name", "seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_share_token_key" ON "Certificate"("share_token");

-- CreateIndex
CREATE INDEX "Certificate_student_id_idx" ON "Certificate"("student_id");

-- CreateIndex
CREATE INDEX "Certificate_file_hash_idx" ON "Certificate"("file_hash");

-- CreateIndex
CREATE INDEX "Certificate_certificate_type_idx" ON "Certificate"("certificate_type");

-- CreateIndex
CREATE INDEX "Certificate_category_idx" ON "Certificate"("category");

-- CreateIndex
CREATE INDEX "CertificateFolder_student_id_idx" ON "CertificateFolder"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateFolder_student_id_name_key" ON "CertificateFolder"("student_id", "name");

-- CreateIndex
CREATE INDEX "CertificateTag_tag_idx" ON "CertificateTag"("tag");

-- CreateIndex
CREATE INDEX "CertificateTag_tag_type_idx" ON "CertificateTag"("tag_type");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateTag_certificate_id_tag_key" ON "CertificateTag"("certificate_id", "tag");

-- CreateIndex
CREATE INDEX "CertificateAttachment_attachment_type_attachment_id_idx" ON "CertificateAttachment"("attachment_type", "attachment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateAttachment_certificate_id_attachment_type_attach_key" ON "CertificateAttachment"("certificate_id", "attachment_type", "attachment_id");

-- CreateIndex
CREATE UNIQUE INDEX "HallTicket_qr_token_key" ON "HallTicket"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "HallTicket_seat_number_hall_name_exam_id_key" ON "HallTicket"("seat_number", "hall_name", "exam_id");

-- AddForeignKey
ALTER TABLE "HallTicket" ADD CONSTRAINT "HallTicket_bulk_upload_job_id_fkey" FOREIGN KEY ("bulk_upload_job_id") REFERENCES "BulkUploadJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SosAlert" ADD CONSTRAINT "SosAlert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SosAlert" ADD CONSTRAINT "SosAlert_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScan" ADD CONSTRAINT "QrScan_hall_ticket_id_fkey" FOREIGN KEY ("hall_ticket_id") REFERENCES "HallTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScan" ADD CONSTRAINT "QrScan_hall_ticket_qr_id_fkey" FOREIGN KEY ("hall_ticket_qr_id") REFERENCES "HallTicketQr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScan" ADD CONSTRAINT "QrScan_scanned_by_fkey" FOREIGN KEY ("scanned_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAttempt" ADD CONSTRAINT "FraudAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemAlert" ADD CONSTRAINT "SystemAlert_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiDecision" ADD CONSTRAINT "AiDecision_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiDecision" ADD CONSTRAINT "AiDecision_overridden_by_fkey" FOREIGN KEY ("overridden_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetExpense" ADD CONSTRAINT "BudgetExpense_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetExpense" ADD CONSTRAINT "BudgetExpense_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfig" ADD CONSTRAINT "SystemConfig_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkUploadJob" ADD CONSTRAINT "BulkUploadJob_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkUploadLog" ADD CONSTRAINT "BulkUploadLog_bulk_upload_job_id_fkey" FOREIGN KEY ("bulk_upload_job_id") REFERENCES "BulkUploadJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallTicketQr" ADD CONSTRAINT "HallTicketQr_hall_ticket_id_fkey" FOREIGN KEY ("hall_ticket_id") REFERENCES "HallTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSeating" ADD CONSTRAINT "ExamSeating_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSeating" ADD CONSTRAINT "ExamSeating_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "CertificateFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateFolder" ADD CONSTRAINT "CertificateFolder_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateTag" ADD CONSTRAINT "CertificateTag_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateAttachment" ADD CONSTRAINT "CertificateAttachment_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
