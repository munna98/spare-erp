/*
  Warnings:

  - A unique constraint covering the columns `[chequeId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockLotId]` on the table `purchase_invoice_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chequeId]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StockLotStatus" AS ENUM ('ACTIVE', 'SOLD', 'DAMAGED', 'RETURNED');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'DISCREPANCY');

-- CreateEnum
CREATE TYPE "ChequeType" AS ENUM ('OUTWARD', 'INWARD');

-- CreateEnum
CREATE TYPE "ChequeStatus" AS ENUM ('ISSUED', 'PRESENTED', 'CLEARED', 'BOUNCED', 'CANCELLED', 'POST_DATED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TemplateType" ADD VALUE 'BANK_RECONCILIATION';
ALTER TYPE "TemplateType" ADD VALUE 'CHEQUE_PAYMENT';

-- AlterTable
ALTER TABLE "delivery_note_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "grn_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "bankAccountId" TEXT,
ADD COLUMN     "chequeId" TEXT,
ADD COLUMN     "isReconciled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reconciledDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "purchase_invoice_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "purchase_return_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "bankAccountId" TEXT,
ADD COLUMN     "chequeId" TEXT,
ADD COLUMN     "isReconciled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reconciledDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sales_invoice_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "sales_return_items" ADD COLUMN     "stockLotId" TEXT;

-- AlterTable
ALTER TABLE "stock_movements" ADD COLUMN     "stockLotId" TEXT;

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT,
    "branchName" TEXT,
    "swiftCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_reconciliations" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "openingBalance" DECIMAL(15,4) NOT NULL,
    "closingBalance" DECIMAL(15,4) NOT NULL,
    "reconciledBalance" DECIMAL(15,4) NOT NULL DEFAULT 0,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'DRAFT',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "bank_reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_transactions" (
    "id" TEXT NOT NULL,
    "bankReconciliationId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "referenceId" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,4) NOT NULL,
    "isReconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciledDate" TIMESTAMP(3),
    "bankStatementRef" TEXT,
    "chequeNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheques" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "chequeNumber" TEXT NOT NULL,
    "chequeType" "ChequeType" NOT NULL,
    "payee" TEXT,
    "payer" TEXT,
    "supplierId" TEXT,
    "customerId" TEXT,
    "amount" DECIMAL(15,4) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "chequeDate" TIMESTAMP(3) NOT NULL,
    "status" "ChequeStatus" NOT NULL DEFAULT 'ISSUED',
    "referenceNo" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "paymentId" TEXT,
    "receiptId" TEXT,

    CONSTRAINT "cheques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheque_status_history" (
    "id" TEXT NOT NULL,
    "chequeId" TEXT NOT NULL,
    "status" "ChequeStatus" NOT NULL,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "createdById" TEXT,

    CONSTRAINT "cheque_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_lots" (
    "id" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "partUnitId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "binId" TEXT,
    "purchaseInvoiceItemId" TEXT,
    "quantityReceived" DECIMAL(15,4) NOT NULL,
    "quantityRemaining" DECIMAL(15,4) NOT NULL,
    "unitCost" DECIMAL(15,4) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "status" "StockLotStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_lots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_accountNumber_key" ON "bank_accounts"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_iban_key" ON "bank_accounts"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "cheques_paymentId_key" ON "cheques"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "cheques_receiptId_key" ON "cheques"("receiptId");

-- CreateIndex
CREATE UNIQUE INDEX "cheques_bankAccountId_chequeNumber_key" ON "cheques"("bankAccountId", "chequeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stock_lots_lotNumber_key" ON "stock_lots"("lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stock_lots_purchaseInvoiceItemId_key" ON "stock_lots"("purchaseInvoiceItemId");

-- CreateIndex
CREATE INDEX "stock_lots_partId_status_purchaseDate_idx" ON "stock_lots"("partId", "status", "purchaseDate");

-- CreateIndex
CREATE INDEX "stock_lots_lotNumber_idx" ON "stock_lots"("lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stock_lots_partId_partUnitId_warehouseId_binId_lotNumber_key" ON "stock_lots"("partId", "partUnitId", "warehouseId", "binId", "lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_chequeId_key" ON "payments"("chequeId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_invoice_items_stockLotId_key" ON "purchase_invoice_items"("stockLotId");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_chequeId_key" ON "receipts"("chequeId");

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_transactions" ADD CONSTRAINT "reconciliation_transactions_bankReconciliationId_fkey" FOREIGN KEY ("bankReconciliationId") REFERENCES "bank_reconciliations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheque_status_history" ADD CONSTRAINT "cheque_status_history_chequeId_fkey" FOREIGN KEY ("chequeId") REFERENCES "cheques"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheque_status_history" ADD CONSTRAINT "cheque_status_history_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_partUnitId_fkey" FOREIGN KEY ("partUnitId") REFERENCES "part_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_binId_fkey" FOREIGN KEY ("binId") REFERENCES "bins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_purchaseInvoiceItemId_fkey" FOREIGN KEY ("purchaseInvoiceItemId") REFERENCES "purchase_invoice_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_return_items" ADD CONSTRAINT "sales_return_items_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_note_items" ADD CONSTRAINT "delivery_note_items_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_chequeId_fkey" FOREIGN KEY ("chequeId") REFERENCES "cheques"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_chequeId_fkey" FOREIGN KEY ("chequeId") REFERENCES "cheques"("id") ON DELETE SET NULL ON UPDATE CASCADE;
