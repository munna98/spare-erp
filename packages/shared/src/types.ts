// packages/shared/src/types.ts

// ================================
// CORE TYPES
// ================================

export interface User {
  id: string;
  companyId: string;
  branchId: string | null;
  email: string;
  name: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  company: Company;
  branch: Branch | null;
  roles: UserRole[];
  employee: Employee | null;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  type?: 'ADMIN' | 'MANAGER' | 'SALES' | 'INVENTORY_MANAGER' | 'FINANCE' | 'EMPLOYEE' | 'AUDITOR';
  name?: string;
  description: string | null;
  scope: string | null;
  permissions: RolePermission[];
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'POST' | 'RECONCILE' | 'EXPORT' | 'CONFIGURE';
  module?: 'SALES' | 'PURCHASES' | 'INVENTORY' | 'FINANCIALS' | 'SETTINGS' | 'AUDIT';
}

export interface Company {
  id: string;
  name: string;
  tradeLicenseNo: string | null;
  vatRegistrationNo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialYear {
  id: string;
  companyId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  companyId: string;
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
}

// ================================
// BANKING & FINANCE TYPES
// ================================

export interface BankAccount {
  id: string;
  companyId: string;
  bankName: string;
  accountNumber: string;
  iban: string | null;
  branchName: string | null;
  swiftCode: string | null;
  ledgerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankReconciliation {
  id: string;
  bankAccountId: string;
  statementDate: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
  reconciledBalance: number;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'DISCREPANCY';
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface ReconciliationTransaction {
  id: string;
  bankReconciliationId: string;
  transactionType: string;
  referenceId: string | null;
  transactionDate: string;
  description: string | null;
  amount: number;
  isReconciled: boolean;
  reconciledDate: string | null;
  bankStatementRef: string | null;
  chequeNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cheque {
  id: string;
  bankAccountId: string;
  chequeNumber: string;
  chequeType: 'ISSUED' | 'RECEIVED';
  payee: string | null;
  payer: string | null;
  supplierId: string | null;
  customerId: string | null;
  amount: number;
  issueDate: string;
  chequeDate: string;
  status: 'ISSUED' | 'PRESENTED' | 'CLEARED' | 'BOUNCED' | 'CANCELLED' | 'POST_DATED';
  referenceNo: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface ChequeStatusHistory {
  id: string;
  chequeId: string;
  status: 'ISSUED' | 'PRESENTED' | 'CLEARED' | 'BOUNCED' | 'CANCELLED' | 'POST_DATED';
  changeDate: string;
  remarks: string | null;
  createdById: string | null;
}

// ================================
// INVENTORY TYPES
// ================================

export interface Part {
  id: string;
  code: string;
  partNumber: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  brandId: string | null;
  barCode: string | null;
  hsnCode: string | null;
  vatRate: number;
  isVatExempt: boolean;
  isActive: boolean;
  reorderLevel: number | null;
  maxStockLevel: number | null;
  minStockLevel: number | null;
  averageCost: number | null;
  purchaseRate: number | null;
  marginPercentage: number | null;
  sellingRate: number | null;
  minSellingRate: number | null;
  minMarginPercentage: number | null;
  wholesaleRate: number | null;
  warrantyPeriod: number | null;
  warrantyPeriodType: 'MONTHS' | 'YEARS' | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;

  category: Category | null;
  brand: Brand | null;
  units: PartUnit[];
  vehicleModels: PartVehicleModel[];
}

export interface Brand {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  category: 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH' | 'AREA' | 'OTHER' | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartUnit {
  id: string;
  partId: string;
  unitId: string;
  conversionRate: number;
  isBaseUnit: boolean;
  isActive: boolean;
  purchaseRate: number | null;
  sellingRate: number | null;
  minSellingRate: number | null;
  wholesaleRate: number | null;
  marginPercentage: number | null;
  createdAt: string;
  updatedAt: string;

  part: Part;
  unit: Unit;
}

export interface Warehouse {
  id: string;
  branchId: string;
  name: string;
  code: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockLot {
  id: string;
  lotNumber: string;
  partId: string;
  partUnitId: string;
  warehouseId: string;
  binId: string | null;
  purchaseInvoiceItemId: string | null;
  quantityReceived: number;
  quantityRemaining: number;
  unitCost: number;
  purchaseDate: string;
  referenceType: string | null;
  referenceId: string | null;
  status: 'ACTIVE' | 'SOLD' | 'DAMAGED' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
}

export interface CurrentStock {
  id: string;
  partId: string;
  partUnitId: string;
  warehouseId: string;
  binId: string;
  quantity: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  partId: string;
  partUnitId: string;
  warehouseId: string;
  binId: string;
  stockLotId: string | null;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  referenceType: string | null;
  referenceId: string | null;
  quantity: number;
  unitCost: number | null;
  totalCost: number | null;
  remarks: string | null;
  movementDate: string;
  createdAt: string;
}

export interface OpeningStock {
  id: string;
  partId: string;
  partUnitId: string;
  warehouseId: string;
  binId: string | null;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Damage {
  id: string;
  partId: string;
  partUnitId: string;
  warehouseId: string;
  binId: string | null;
  quantity: number;
  unitCost: number;
  totalCost: number;
  damageType: 'PHYSICAL' | 'EXPIRED' | 'LOST' | 'THEFT' | 'OTHER';
  reason: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

// ================================
// CUSTOMER & SUPPLIER TYPES
// ================================

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  vatNumber: string | null;
  tradeLicenseNo: string | null;
  creditLimit: number | null;
  creditDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerVehicle {
  id: string;
  customerId: string;
  vehicleModelId: string;
  vin: string | null;
  licensePlate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleModel {
  id: string;
  make: string;
  model: string;
  year: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface PartVehicleModel {
  id: string;
  partId: string;
  vehicleModelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  vatNumber: string | null;
  tradeLicenseNo: string | null;
  creditDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  designation: string | null;
  department: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  salary: number | null;
  joinDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  branchId: string | null;
}

// ================================
// SALES TYPES
// ================================

export interface SalesQuotation {
  id: string;
  number: string;
  customerId: string;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  validTill: string | null;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface SalesQuotationItem {
  id: string;
  salesQuotationId: string;
  partId: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface SalesOrder {
  id: string;
  number: string;
  customerId: string;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  deliveryDate: string | null;
  status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'PARTIALLY_DELIVERED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  partId: string;
  partUnitId: string;
  quantity: number;
  deliveredQty: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface SalesInvoice {
  id: string;
  number: string;
  customerId: string;
  salesOrderId: string | null;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  dueDate: string | null;
  status: 'DRAFT' | 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface SalesInvoiceItem {
  id: string;
  salesInvoiceId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface SalesReturn {
  id: string;
  number: string;
  customerId: string;
  salesInvoiceId: string | null;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface SalesReturnItem {
  id: string;
  salesReturnId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

// ================================
// PURCHASE TYPES
// ================================

export interface PurchaseQuotation {
  id: string;
  number: string;
  supplierId: string;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  validTill: string | null;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface PurchaseQuotationItem {
  id: string;
  purchaseQuotationId: string;
  partId: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  deliveryDate: string | null;
  status: 'DRAFT' | 'PENDING' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  partId: string;
  partUnitId: string;
  quantity: number;
  receivedQty: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface PurchaseInvoice {
  id: string;
  number: string;
  supplierId: string;
  purchaseOrderId: string | null;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  dueDate: string | null;
  status: 'DRAFT' | 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface PurchaseInvoiceItem {
  id: string;
  purchaseInvoiceId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface PurchaseReturn {
  id: string;
  number: string;
  supplierId: string;
  purchaseInvoiceId: string | null;
  branchId: string | null;
  financialYearId: string | null;
  date: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface PurchaseReturnItem {
  id: string;
  purchaseReturnId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

// ================================
// GOODS RECEIPT & DELIVERY TYPES
// ================================

export interface GRN {
  id: string;
  number: string;
  supplierId: string;
  purchaseOrderId: string | null;
  date: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface GRNItem {
  id: string;
  grnId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unitPrice: number;
  totalAmount: number;
  remarks: string | null;
}

export interface DeliveryNote {
  id: string;
  number: string;
  customerId: string;
  salesOrderId: string | null;
  date: string;
  status: 'DRAFT' | 'PENDING' | 'DELIVERED' | 'CANCELLED';
  driverName: string | null;
  vehicleNumber: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryNoteItem {
  id: string;
  deliveryNoteId: string;
  partId: string;
  partUnitId: string;
  stockLotId: string | null;
  orderedQty: number;
  deliveredQty: number;
  remarks: string | null;
}

// ================================
// FINANCIAL TYPES
// ================================

export interface LedgerGroup {
  id: string;
  name: string;
  groupType: string;
  parentId: string | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ledger {
  id: string;
  name: string;
  ledgerGroupId: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  ledgerId: string;
  customerId: string | null;
  supplierId: string | null;
  voucherType: 'SALES_INVOICE' | 'SALES_RETURN' | 'PURCHASE_INVOICE' | 'PURCHASE_RETURN' | 'PAYMENT' | 'RECEIPT' | 'JOURNAL' | 'CONTRA' | 'DEBIT_NOTE' | 'CREDIT_NOTE';
  voucherNumber: string;
  voucherDate: string;
  debitAmount: number;
  creditAmount: number;
  description: string | null;
  journalEntryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string | null;
  totalDebit: number;
  totalCredit: number;
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface JournalLine {
  id: string;
  journalEntryId: string;
  ledgerId: string;
  debitAmount: number;
  creditAmount: number;
  description: string | null;
}

export interface Contra {
  id: string;
  number: string;
  date: string;
  fromLedgerId: string;
  toLedgerId: string;
  amount: number;
  description: string | null;
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  number: string;
  supplierId: string | null;
  date: string;
  paymentMode: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'OTHER';
  ledgerId: string;
  bankAccountId: string | null;
  chequeId: string | null;
  amount: number;
  referenceNo: string | null;
  description: string | null;
  isPosted: boolean;
  isReconciled: boolean;
  reconciledDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface PaymentLine {
  id: string;
  paymentId: string;
  purchaseInvoiceId: string;
  amount: number;
  description: string | null;
}

export interface Receipt {
  id: string;
  number: string;
  customerId: string | null;
  date: string;
  paymentMode: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'OTHER';
  ledgerId: string;
  bankAccountId: string | null;
  chequeId: string | null;
  amount: number;
  referenceNo: string | null;
  description: string | null;
  isPosted: boolean;
  isReconciled: boolean;
  reconciledDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface ReceiptLine {
  id: string;
  receiptId: string;
  salesInvoiceId: string;
  amount: number;
  description: string | null;
}

export interface DebitNote {
  id: string;
  number: string;
  supplierId: string;
  purchaseReturnId: string | null;
  date: string;
  amount: number;
  description: string | null;
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreditNote {
  id: string;
  number: string;
  customerId: string;
  salesReturnId: string | null;
  date: string;
  amount: number;
  description: string | null;
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ================================
// DOCUMENT TYPES
// ================================

export interface Invoice {
  id: string;
  documentType: string;
  invoiceNumber: string;
  invoiceDate: string;
  branchId: string;
  customerId: string | null;
  supplierId: string | null;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  pdfPath: string | null;
  qrCodePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrintTemplate {
  id: string;
  name: string;
  description: string | null;
  templateType: string;
  templateEngine: 'EJS' | 'JSX' | 'PDFKIT';
  content: string;
  styles: string | null;
  header: string | null;
  footer: string | null;
  isDefault: boolean;
  isActive: boolean;
  paperSize: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'LETTER' | 'LEGAL' | 'TABLOID';
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  margins: any | null;
  previewImage: string | null;
  printConfig: any;
  createdAt: string;
  updatedAt: string;
  branchId: string | null;
}

// ================================
// AUDIT LOGGING
// ================================

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldData: any | null;
  newData: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

// ================================
// AUTH TYPES
// ================================

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface JwtPayload {
  userId: string;
  companyId: string;
  branchId?: string;
  iat?: number;
  exp?: number;
}

export interface PermissionCheck {
  resource: string;
  action: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export type UserPermissions = Array<{
  resource: string;
  action: string;
}>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  COMPANY_DEACTIVATED = 'COMPANY_DEACTIVATED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
}

export type FlatUserPermissions = Array<{
  id: string;
  name: string;
  resource: string;
  action: string;
}>;

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  getUserPermissions: () => FlatUserPermissions;
}

// ================================
// SEARCH TYPES
// ================================

export interface PartSearchResult {
  id: string;
  code: string;
  partNumber: string;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  sellingRate: number | null;
  units: {
    unitName: string;
    symbol: string | null;
  }[];
}

// ================================
// PAGINATION TYPES
// ================================

export interface BrandsListResponse {
  brands: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CategoriesListResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PartsListResponse {
  parts: Part[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PartUnitsListResponse {
  partUnits: PartUnit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VehicleModelsListResponse {
  vehicleModels: VehicleModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}