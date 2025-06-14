erDiagram
    %% Master Data Models
    Company ||--o{ Branch : has
    Company ||--o{ FinancialYear : has
    Company ||--o{ Settings : has
    Company ||--o{ User : has
    Company ||--o{ AuditLog : logs
    Branch ||--o{ Warehouse : has
    Branch ||--o{ User : assigned
    Branch ||--o{ CodeSequence : manages
    Branch ||--o{ VoucherSequence : manages
    Branch ||--o{ Employee : employs
    Branch ||--o{ SalesQuotation : creates
    Branch ||--o{ SalesOrder : creates
    Branch ||--o{ SalesInvoice : creates
    Branch ||--o{ SalesReturn : creates
    Branch ||--o{ PurchaseQuotation : creates
    Branch ||--o{ PurchaseOrder : creates
    Branch ||--o{ PurchaseInvoice : creates
    Branch ||--o{ PurchaseReturn : creates
    Branch ||--o{ PrintTemplate : uses
    FinancialYear ||--o{ VoucherSequence : defines
    FinancialYear ||--o{ SalesQuotation : tracks
    FinancialYear ||--o{ SalesOrder : tracks
    FinancialYear ||--o{ SalesInvoice : tracks
    FinancialYear ||--o{ SalesReturn : tracks
    FinancialYear ||--o{ PurchaseQuotation : tracks
    FinancialYear ||--o{ PurchaseOrder : tracks
    FinancialYear ||--o{ PurchaseInvoice : tracks
    FinancialYear ||--o{ PurchaseReturn : tracks

    %% User Management
    User ||--o{ UserRole : has
    User ||--o{ Employee : linked
    User ||--o{ AuditLog : performs
    User ||--o{ SalesInvoice : created_by
    User ||--o{ SalesInvoice : updated_by
    User ||--o{ SalesQuotation : created_by
    User ||--o{ SalesQuotation : updated_by
    User ||--o{ PurchaseInvoice : created_by
    User ||--o{ PurchaseInvoice : updated_by
    User ||--o{ PurchaseQuotation : created_by
    User ||--o{ PurchaseQuotation : updated_by
    User ||--o{ Part : created_by
    User ||--o{ Part : updated_by
    User ||--o{ Damage : created_by
    User ||--o{ Damage : updated_by
    User ||--o{ SalesOrder : created_by
    User ||--o{ SalesOrder : updated_by
    User ||--o{ SalesReturn : created_by
    User ||--o{ SalesReturn : updated_by
    User ||--o{ PurchaseReturn : created_by
    User ||--o{ PurchaseReturn : updated_by
    User ||--o{ GRN : created_by
    User ||--o{ GRN : updated_by
    User ||--o{ JournalEntry : created_by
    User ||--o{ JournalEntry : updated_by
    User ||--o{ Payment : created_by
    User ||--o{ Payment : updated_by
    User ||--o{ Receipt : created_by
    User ||--o{ Receipt : updated_by
    Role ||--o{ UserRole : assigned
    Role ||--o{ RolePermission : has
    Permission ||--o{ RolePermission : assigned

    %% Inventory Management
    Part ||--o{ PartUnit : has
    Part ||--o{ StockMovement : tracks
    Part ||--o{ OpeningStock : tracks
    Part ||--o{ Damage : tracks
    Part ||--o{ SalesOrderItem : includes
    Part ||--o{ SalesInvoiceItem : includes
    Part ||--o{ SalesReturnItem : includes
    Part ||--o{ SalesQuotationItem : includes
    Part ||--o{ PurchaseOrderItem : includes
    Part ||--o{ PurchaseInvoiceItem : includes
    Part ||--o{ PurchaseReturnItem : includes
    Part ||--o{ PurchaseQuotationItem : includes
    Part ||--o{ GRNItem : includes
    Part ||--o{ DeliveryNoteItem : includes
    Part ||--o{ CurrentStock : tracks
    Part ||--o{ PartVehicleModel : compatible_with
    Warehouse ||--o{ Bin : has
    Warehouse ||--o{ StockMovement : tracks
    Warehouse ||--o{ OpeningStock : tracks
    Warehouse ||--o{ Damage : tracks
    Warehouse ||--o{ CurrentStock : tracks
    Bin ||--o{ StockMovement : tracks
    Bin ||--o{ OpeningStock : tracks
    Bin ||--o{ Damage : tracks
    Bin ||--o{ CurrentStock : tracks
    PartUnit ||--o{ PurchaseOrderItem : uses
    PartUnit ||--o{ PurchaseInvoiceItem : uses
    PartUnit ||--o{ SalesOrderItem : uses
    PartUnit ||--o{ SalesInvoiceItem : uses
    PartUnit ||--o{ SalesReturnItem : uses
    PartUnit ||--o{ PurchaseReturnItem : uses
    PartUnit ||--o{ GRNItem : uses
    PartUnit ||--o{ DeliveryNoteItem : uses
    PartUnit ||--o{ StockMovement : uses
    PartUnit ||--o{ OpeningStock : uses
    PartUnit ||--o{ Damage : uses
    PartUnit ||--o{ CurrentStock : uses

    %% Customer & Supplier Management
    Customer ||--o{ SalesOrder : places
    Customer ||--o{ SalesInvoice : receives
    Customer ||--o{ SalesReturn : initiates
    Customer ||--o{ SalesQuotation : requests
    Customer ||--o{ DeliveryNote : receives
    Customer ||--o{ Receipt : makes
    Customer ||--o{ LedgerEntry : tracks
    Customer ||--o{ CreditNote : receives
    Customer ||--o{ Invoice : linked
    Customer ||--o{ CustomerVehicle : owns
    Supplier ||--o{ PurchaseOrder : supplies
    Supplier ||--o{ PurchaseInvoice : issues
    Supplier ||--o{ PurchaseReturn : receives
    Supplier ||--o{ PurchaseQuotation : provides
    Supplier ||--o{ GRN : supplies
    Supplier ||--o{ Payment : receives
    Supplier ||--o{ LedgerEntry : tracks
    Supplier ||--o{ DebitNote : receives
    Supplier ||--o{ Invoice : linked
    VehicleModel ||--o{ CustomerVehicle : models
    VehicleModel ||--o{ PartVehicleModel : compatible_with

    %% Sales Management
    SalesQuotation ||--o{ SalesQuotationItem : contains
    SalesOrder ||--o{ SalesOrderItem : contains
    SalesOrder ||--o{ SalesInvoice : generates
    SalesOrder ||--o{ DeliveryNote : fulfills
    SalesInvoice ||--o{ SalesInvoiceItem : contains
    SalesInvoice ||--o{ SalesReturn : related_to
    SalesInvoice ||--o{ Receipt : paid_by
    SalesInvoice ||--o{ Invoice : linked
    SalesReturn ||--o{ SalesReturnItem : contains
    SalesReturn ||--o{ CreditNote : generates

    %% Purchase Management
    PurchaseQuotation ||--o{ PurchaseQuotationItem : contains
    PurchaseOrder ||--o{ PurchaseOrderItem : contains
    PurchaseOrder ||--o{ PurchaseInvoice : generates
    PurchaseOrder ||--o{ GRN : receives
    PurchaseInvoice ||--o{ PurchaseInvoiceItem : contains
    PurchaseInvoice ||--o{ PurchaseReturn : related_to
    PurchaseInvoice ||--o{ Payment : paid_by
    PurchaseInvoice ||--o{ Invoice : linked
    PurchaseReturn ||--o{ PurchaseReturnItem : contains
    PurchaseReturn ||--o{ DebitNote : generates

    %% Goods Receipt & Delivery
    GRN ||--o{ GRNItem : contains
    DeliveryNote ||--o{ DeliveryNoteItem : contains

    %% Financial Management
    LedgerGroup ||--o{ LedgerGroup : parent_of
    LedgerGroup ||--o{ Ledger : groups
    Ledger ||--o{ LedgerEntry : tracks
    Ledger ||--o{ Contra : from_ledger
    Ledger ||--o{ Contra : to_ledger
    Ledger ||--o{ JournalLine : includes
    Ledger ||--o{ Payment : uses
    Ledger ||--o{ Receipt : uses
    JournalEntry ||--o{ JournalLine : contains
    JournalEntry ||--o{ LedgerEntry : generates
    Payment ||--o{ PaymentLine : contains
    Receipt ||--o{ ReceiptLine : contains

    %% Document Management
    Invoice ||--o{ SalesInvoice : linked
    Invoice ||--o{ PurchaseInvoice : linked

    %% Entity Attributes
    Company {
        string id
        string name
        string tradeLicenseNo
        string vatRegistrationNo
        string address
        string city
        string state
        string country
        string phone
        string email
        string website
        string logo
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Branch {
        string id
        string companyId
        string name
        string code
        string address
        string city
        string state
        string phone
        string email
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    FinancialYear {
        string id
        string companyId
        string name
        datetime startDate
        datetime endDate
        boolean isActive
        boolean isClosed
        datetime createdAt
        datetime updatedAt
    }
    User {
        string id
        string companyId
        string branchId
        string email
        string password
        string name
        string phone
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Part {
        string id
        string code
        string partNumber
        string name
        string description
        string category
        string brand
        string model
        string year
        string barCode
        string hsnCode
        decimal vatRate
        boolean isVatExempt
        boolean isActive
        decimal reorderLevel
        decimal maxStockLevel
        decimal minStockLevel
        decimal averageCost
        decimal purchaseRate
        decimal marginPercentage
        decimal sellingRate
        decimal minSellingRate
        decimal minSellingRatePercentage
        decimal wholesaleRate
        int warrantyPeriod
        string warrantyPeriodType
        datetime createdAt
        datetime updatedAt
        string createdById
        string updatedById
    }
    Warehouse {
        string id
        string branchId
        string name
        string code
        string address
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Bin {
        string id
        string warehouseId
        string name
        string code
        string location
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Customer {
        string id
        string code
        string name
        string contactPerson
        string phone
        string email
        string address
        string city
        string state
        string country
        string vatNumber
        string tradeLicenseNo
        decimal creditLimit
        int creditDays
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Supplier {
        string id
        string code
        string name
        string contactPerson
        string phone
        string email
        string address
        string city
        string state
        string country
        string vatNumber
        string tradeLicenseNo
        int creditDays
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    SalesInvoice {
        string id
        string number
        string customerId
        string salesOrderId
        string branchId
        string financialYearId
        datetime date
        datetime dueDate
        string status
        decimal subtotal
        decimal discountAmount
        decimal vatAmount
        decimal total
        decimal paidAmount
        decimal balanceAmount
        string remarks
        datetime createdAt
        datetime updatedAt
        string createdById
        string updatedById
    }
    PurchaseInvoice {
        string id
        string number
        string supplierId
        string purchaseOrderId
        string branchId
        string financialYearId
        datetime date
        datetime dueDate
        string status
        decimal subtotal
        decimal discountAmount
        decimal vatAmount
        decimal total
        decimal paidAmount
        decimal balanceAmount
        string remarks
        datetime createdAt
        datetime updatedAt
        string createdById
        string updatedById
    }
