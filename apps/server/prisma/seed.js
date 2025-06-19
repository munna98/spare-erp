const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (be careful with this in production)
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.chequeStatusHistory.deleteMany(),
    prisma.cheque.deleteMany(),
    prisma.reconciliationTransaction.deleteMany(),
    prisma.bankReconciliation.deleteMany(),
    prisma.receiptLine.deleteMany(),
    prisma.receipt.deleteMany(),
    prisma.paymentLine.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.creditNote.deleteMany(),
    prisma.debitNote.deleteMany(),
    prisma.contra.deleteMany(),
    prisma.journalLine.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.ledgerEntry.deleteMany(),
    prisma.ledger.deleteMany(),
    prisma.ledgerGroup.deleteMany(),
    prisma.deliveryNoteItem.deleteMany(),
    prisma.deliveryNote.deleteMany(),
    prisma.gRNItem.deleteMany(),
    prisma.gRN.deleteMany(),
    prisma.purchaseReturnItem.deleteMany(),
    prisma.purchaseReturn.deleteMany(),
    prisma.purchaseInvoiceItem.deleteMany(),
    prisma.purchaseInvoice.deleteMany(),
    prisma.purchaseOrderItem.deleteMany(),
    prisma.purchaseOrder.deleteMany(),
    prisma.purchaseQuotationItem.deleteMany(),
    prisma.purchaseQuotation.deleteMany(),
    prisma.salesReturnItem.deleteMany(),
    prisma.salesReturn.deleteMany(),
    prisma.salesInvoiceItem.deleteMany(),
    prisma.salesInvoice.deleteMany(),
    prisma.salesOrderItem.deleteMany(),
    prisma.salesOrder.deleteMany(),
    prisma.salesQuotationItem.deleteMany(),
    prisma.salesQuotation.deleteMany(),
    prisma.currentStock.deleteMany(),
    prisma.damage.deleteMany(),
    prisma.openingStock.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.stockLot.deleteMany(),
    prisma.bin.deleteMany(),
    prisma.warehouse.deleteMany(),
    prisma.customerVehicle.deleteMany(),
    prisma.partVehicleModel.deleteMany(),
    prisma.vehicleModel.deleteMany(),
    prisma.partUnit.deleteMany(),
    prisma.part.deleteMany(),
    prisma.category.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
    prisma.printTemplate.deleteMany(),
    prisma.voucherSequence.deleteMany(),
    prisma.codeSequence.deleteMany(),
    prisma.settings.deleteMany(),
    prisma.financialYear.deleteMany(),
    prisma.branch.deleteMany(),
    prisma.bankAccount.deleteMany(),
    prisma.company.deleteMany(),
  ]);

  // Create a company
  const company = await prisma.company.create({
    data: {
      name: "AutoParts UAE",
      tradeLicenseNo: "TRD12345678",
      vatRegistrationNo: "VAT123456789",
      address: "Industrial Area 12, Dubai",
      city: "Dubai",
      country: "UAE",
      phone: "+97142233445",
      email: "info@autoparts.ae",
      website: "www.autoparts.ae",
    },
  });

  // Create branches
  const dubaiBranch = await prisma.branch.create({
    data: {
      companyId: company.id,
      name: "Dubai Main Branch",
      code: "DXB",
      address: "Industrial Area 12, Dubai",
      city: "Dubai",
      phone: "+97142233445",
      email: "dubai@autoparts.ae",
      isActive: true,
    },
  });

  const abuDhabiBranch = await prisma.branch.create({
    data: {
      companyId: company.id,
      name: "Abu Dhabi Branch",
      code: "AUH",
      address: "Mussafah Industrial Area, Abu Dhabi",
      city: "Abu Dhabi",
      phone: "+97124455667",
      email: "abudhabi@autoparts.ae",
      isActive: true,
    },
  });

  // Create financial years
  const currentYear = new Date().getFullYear();
  const financialYear = await prisma.financialYear.create({
    data: {
      companyId: company.id,
      name: `${currentYear}-${currentYear + 1}`,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      isActive: true,
    },
  });

  // Create warehouses
  const dubaiMainWarehouse = await prisma.warehouse.create({
    data: {
      branchId: dubaiBranch.id,
      name: "Dubai Main Warehouse",
      code: "DXB-WH1",
      isActive: true,
    },
  });

  const abuDhabiWarehouse = await prisma.warehouse.create({
    data: {
      branchId: abuDhabiBranch.id,
      name: "Abu Dhabi Warehouse",
      code: "AUH-WH1",
      isActive: true,
    },
  });

  // Create bins for warehouses
  const dubaiBins = await Promise.all(
    ["A1", "A2", "B1", "B2", "C1"].map((code) =>
      prisma.bin.create({
        data: {
          warehouseId: dubaiMainWarehouse.id,
          name: `Bin ${code}`,
          code: code,
          isActive: true,
        },
      })
    )
  );

  const abuDhabiBins = await Promise.all(
    ["X1", "X2", "Y1", "Y2"].map((code) =>
      prisma.bin.create({
        data: {
          warehouseId: abuDhabiWarehouse.id,
          name: `Bin ${code}`,
          code: code,
          isActive: true,
        },
      })
    )
  );

  // Create units
  const units = await Promise.all([
    prisma.unit.create({
      data: {
        name: "Piece",
        symbol: "PC",
        category: "COUNT",
        isActive: true,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Box",
        symbol: "BOX",
        category: "COUNT",
        isActive: true,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Kilogram",
        symbol: "KG",
        category: "WEIGHT",
        isActive: true,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Liter",
        symbol: "L",
        category: "VOLUME",
        isActive: true,
      },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Bosch",
        isActive: true,
      },
    }),
    prisma.brand.create({
      data: {
        name: "NGK",
        isActive: true,
      },
    }),
    prisma.brand.create({
      data: {
        name: "Mobil",
        isActive: true,
      },
    }),
    prisma.brand.create({
      data: {
        name: "Castrol",
        isActive: true,
      },
    }),
  ]);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Engine Parts",
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Filters",
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Lubricants",
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "Electrical",
        isActive: true,
      },
    }),
  ]);

  // Create parts
  const parts = await Promise.all([
    prisma.part.create({
      data: {
        code: "SPK-001",
        partNumber: "BOSCH-SPK-001",
        name: "Bosch Spark Plug",
        description: "Premium spark plug for most vehicles",
        categoryId: categories[0].id,
        brandId: brands[0].id,
        barCode: "123456789012",
        hsnCode: "8511.10.00",
        vatRate: 5.0,
        isActive: true,
        reorderLevel: 50,
        maxStockLevel: 200,
        minStockLevel: 20,
        warrantyPeriod: 12,
        warrantyPeriodType: "MONTHS",
        defaultPurchaseUnitId: units[0].id, // Piece
        defaultSalesUnitId: units[0].id, // Piece
        purchaseRate: 25.0,
        marginPercentage: 40.0,
        sellingRate: 35.0,
        minSellingRate: 30.0,
        minMarginPercentage: 20.0,
        wholesaleRate: 32.0,
      },
    }),
    prisma.part.create({
      data: {
        code: "OIL-001",
        partNumber: "MOBIL-5W30",
        name: "Mobil 5W30 Engine Oil",
        description: "Fully synthetic engine oil 1L",
        categoryId: categories[2].id,
        brandId: brands[2].id,
        barCode: "234567890123",
        hsnCode: "2710.19.90",
        vatRate: 5.0,
        isActive: true,
        reorderLevel: 100,
        maxStockLevel: 500,
        minStockLevel: 50,
        warrantyPeriod: 24,
        warrantyPeriodType: "MONTHS",
        defaultPurchaseUnitId: units[3].id, // Liter
        defaultSalesUnitId: units[3].id, // Liter
        purchaseRate: 30.0,
        marginPercentage: 33.33,
        sellingRate: 40.0,
        minSellingRate: 35.0,
        minMarginPercentage: 16.67,
        wholesaleRate: 38.0,
      },
    }),
    prisma.part.create({
      data: {
        code: "FIL-001",
        partNumber: "NGK-OF-001",
        name: "NGK Oil Filter",
        description: "Standard oil filter for most vehicles",
        categoryId: categories[1].id,
        brandId: brands[1].id,
        barCode: "345678901234",
        hsnCode: "8421.23.00",
        vatRate: 5.0,
        isActive: true,
        reorderLevel: 30,
        maxStockLevel: 150,
        minStockLevel: 15,
        warrantyPeriod: 6,
        warrantyPeriodType: "MONTHS",
        defaultPurchaseUnitId: units[0].id, // Piece
        defaultSalesUnitId: units[0].id, // Piece
        purchaseRate: 15.0,
        marginPercentage: 50.0,
        sellingRate: 22.5,
        minSellingRate: 18.0,
        minMarginPercentage: 20.0,
        wholesaleRate: 20.0,
      },
    }),
  ]);

  // Create part units
  const partUnits = await Promise.all([
    // For spark plug
    prisma.partUnit.create({
      data: {
        partId: parts[0].id,
        unitId: units[0].id, // Piece
        conversionRate: 1,
        isBaseUnit: true,
        purchaseRate: 25.0,
        sellingRate: 35.0,
        minSellingRate: 30.0,
        wholesaleRate: 32.0,
        marginPercentage: 40.0,
      },
    }),
    prisma.partUnit.create({
      data: {
        partId: parts[0].id,
        unitId: units[1].id, // Box
        conversionRate: 10, // 1 box = 10 pieces
        purchaseRate: 220.0, // 10 * 22 (discounted)
        sellingRate: 320.0, // 10 * 32 (discounted)
        minSellingRate: 280.0,
        wholesaleRate: 300.0,
        marginPercentage: 45.45,
      },
    }),
    // For engine oil
    prisma.partUnit.create({
      data: {
        partId: parts[1].id,
        unitId: units[3].id, // Liter
        conversionRate: 1,
        isBaseUnit: true,
        purchaseRate: 30.0,
        sellingRate: 40.0,
        minSellingRate: 35.0,
        wholesaleRate: 38.0,
        marginPercentage: 33.33,
      },
    }),
    // For oil filter
    prisma.partUnit.create({
      data: {
        partId: parts[2].id,
        unitId: units[0].id, // Piece
        conversionRate: 1,
        isBaseUnit: true,
        purchaseRate: 15.0,
        sellingRate: 22.5,
        minSellingRate: 18.0,
        wholesaleRate: 20.0,
        marginPercentage: 50.0,
      },
    }),
  ]);

  // Update parts with baseUnitId
  await Promise.all([
    prisma.part.update({
      where: { id: parts[0].id },
      data: { baseUnitId: partUnits[0].id },
    }),
    prisma.part.update({
      where: { id: parts[1].id },
      data: { baseUnitId: partUnits[2].id },
    }),
    prisma.part.update({
      where: { id: parts[2].id },
      data: { baseUnitId: partUnits[3].id },
    }),
  ]);

  // Create vehicle models
  const vehicleModels = await Promise.all([
    prisma.vehicleModel.create({
      data: {
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        isActive: true,
      },
    }),
    prisma.vehicleModel.create({
      data: {
        make: "Nissan",
        model: "Patrol",
        year: 2019,
        isActive: true,
      },
    }),
    prisma.vehicleModel.create({
      data: {
        make: "Mitsubishi",
        model: "Pajero",
        year: 2018,
        isActive: true,
      },
    }),
  ]);

  // Link parts to vehicle models
  await Promise.all([
    prisma.partVehicleModel.create({
      data: {
        partId: parts[0].id, // Spark plug
        vehicleModelId: vehicleModels[0].id, // Toyota Corolla
      },
    }),
    prisma.partVehicleModel.create({
      data: {
        partId: parts[0].id, // Spark plug
        vehicleModelId: vehicleModels[1].id, // Nissan Patrol
      },
    }),
    prisma.partVehicleModel.create({
      data: {
        partId: parts[1].id, // Engine oil
        vehicleModelId: vehicleModels[0].id, // Toyota Corolla
      },
    }),
    prisma.partVehicleModel.create({
      data: {
        partId: parts[1].id, // Engine oil
        vehicleModelId: vehicleModels[2].id, // Mitsubishi Pajero
      },
    }),
    prisma.partVehicleModel.create({
      data: {
        partId: parts[2].id, // Oil filter
        vehicleModelId: vehicleModels[1].id, // Nissan Patrol
      },
    }),
  ]);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        code: "CUST001",
        name: "Al Habtoor Motors",
        contactPerson: "Ahmed Khan",
        phone: "+971501234567",
        email: "ahmed@habtoor.ae",
        address: "Sheikh Zayed Road, Dubai",
        city: "Dubai",
        country: "UAE",
        vatNumber: "VAT123456789",
        tradeLicenseNo: "TRD987654321",
        creditLimit: 100000,
        creditDays: 30,
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        code: "CUST002",
        name: "Emirates Transport",
        contactPerson: "Fatima Al Maktoum",
        phone: "+971502345678",
        email: "fatima@et.ae",
        address: "Al Qusais, Dubai",
        city: "Dubai",
        country: "UAE",
        vatNumber: "VAT234567890",
        tradeLicenseNo: "TRD876543210",
        creditLimit: 50000,
        creditDays: 15,
        isActive: true,
      },
    }),
  ]);

  // Create customer vehicles
  await Promise.all([
    prisma.customerVehicle.create({
      data: {
        customerId: customers[0].id,
        vehicleModelId: vehicleModels[0].id, // Toyota Corolla
        vin: "JT2BF22K3W0123456",
        licensePlate: "DXB-12345",
      },
    }),
    prisma.customerVehicle.create({
      data: {
        customerId: customers[1].id,
        vehicleModelId: vehicleModels[1].id, // Nissan Patrol
        vin: "JN8AR05Y4WW012345",
        licensePlate: "AUH-54321",
      },
    }),
  ]);

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        code: "SUPP001",
        name: "Bosch Middle East",
        contactPerson: "John Smith",
        phone: "+971504567890",
        email: "john@bosch.ae",
        address: "Jebel Ali Free Zone, Dubai",
        city: "Dubai",
        country: "UAE",
        vatNumber: "VAT345678901",
        tradeLicenseNo: "TRD765432109",
        creditDays: 30,
        isActive: true,
      },
    }),
    prisma.supplier.create({
      data: {
        code: "SUPP002",
        name: "ExxonMobil UAE",
        contactPerson: "Sarah Johnson",
        phone: "+971505678901",
        email: "sarah@exxonmobil.ae",
        address: "Abu Dhabi Industrial City",
        city: "Abu Dhabi",
        country: "UAE",
        vatNumber: "VAT456789012",
        tradeLicenseNo: "TRD654321098",
        creditDays: 45,
        isActive: true,
      },
    }),
  ]);

  // Create bank accounts
  const bankAccounts = await Promise.all([
    prisma.bankAccount.create({
      data: {
        companyId: company.id,
        bankName: "Emirates NBD",
        accountNumber: "123456789012",
        iban: "AE070331234567890123456",
        branchName: "Dubai Main Branch",
        swiftCode: "EBILAEAD",
        isActive: true,
      },
    }),
    prisma.bankAccount.create({
      data: {
        companyId: company.id,
        bankName: "First Abu Dhabi Bank",
        accountNumber: "987654321098",
        iban: "AE060211987654321098765",
        branchName: "Abu Dhabi Main Branch",
        swiftCode: "NBADAEAA",
        isActive: true,
      },
    }),
  ]);

  // Create ledger groups
  const assetGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Assets",
      groupType: "ASSETS",
      isActive: true,
    },
  });

  const liabilityGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Liabilities",
      groupType: "LIABILITIES",
      isActive: true,
    },
  });

  const incomeGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Income",
      groupType: "INCOME",
      isActive: true,
    },
  });

  const expenseGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Expenses",
      groupType: "EXPENSES",
      isActive: true,
    },
  });

  // Create sub-groups
  const currentAssetsGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Current Assets",
      groupType: "ASSETS",
      parentId: assetGroup.id,
      level: 2,
      isActive: true,
    },
  });

  const bankAccountsGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Bank Accounts",
      groupType: "ASSETS",
      parentId: currentAssetsGroup.id,
      level: 3,
      isActive: true,
    },
  });

  const salesGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Sales",
      groupType: "INCOME",
      parentId: incomeGroup.id,
      level: 2,
      isActive: true,
    },
  });

  const purchaseGroup = await prisma.ledgerGroup.create({
    data: {
      name: "Purchases",
      groupType: "EXPENSES",
      parentId: expenseGroup.id,
      level: 2,
      isActive: true,
    },
  });

  // Create ledgers
  const ledgers = await Promise.all([
    // Bank accounts
    prisma.ledger.create({
      data: {
        name: "Emirates NBD Account",
        ledgerGroupId: bankAccountsGroup.id,
        isActive: true,
      },
    }),
    prisma.ledger.create({
      data: {
        name: "FAB Account",
        ledgerGroupId: bankAccountsGroup.id,
        isActive: true,
      },
    }),
    // Sales
    prisma.ledger.create({
      data: {
        name: "Auto Parts Sales",
        ledgerGroupId: salesGroup.id,
        isActive: true,
      },
    }),
    // Purchases
    prisma.ledger.create({
      data: {
        name: "Auto Parts Purchases",
        ledgerGroupId: purchaseGroup.id,
        isActive: true,
      },
    }),
    // VAT
    prisma.ledger.create({
      data: {
        name: "VAT Payable",
        ledgerGroupId: liabilityGroup.id,
        isActive: true,
      },
    }),
    // Receivables
    prisma.ledger.create({
      data: {
        name: "Accounts Receivable",
        ledgerGroupId: currentAssetsGroup.id,
        isActive: true,
      },
    }),
    // Payables
    prisma.ledger.create({
      data: {
        name: "Accounts Payable",
        ledgerGroupId: liabilityGroup.id,
        isActive: true,
      },
    }),
  ]);

  // Link bank accounts to ledgers
  await Promise.all([
    prisma.bankAccount.update({
      where: { id: bankAccounts[0].id },
      data: { ledgerId: ledgers[0].id },
    }),
    prisma.bankAccount.update({
      where: { id: bankAccounts[1].id },
      data: { ledgerId: ledgers[1].id },
    }),
  ]);

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      type: "ADMIN",
      description: "System administrator with full access",
      scope: "Global",
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      type: "MANAGER",
      description: "Branch manager with most permissions",
      scope: "Branch",
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      type: "SALES",
      description: "Sales staff with order and invoice permissions",
      scope: "Branch",
    },
  });

  const inventoryRole = await prisma.role.create({
    data: {
      type: "INVENTORY_MANAGER",
      description: "Inventory staff with stock management permissions",
      scope: "Branch",
    },
  });

  const financeRole = await prisma.role.create({
    data: {
      type: "FINANCE",
      description: "Finance staff with payment and accounting permissions",
      scope: "Branch",
    },
  });

  // Create permissions
  const permissionData = [
    // Sales permissions
    {
      name: "sales_order_create",
      resource: "SalesOrder",
      action: "CREATE",
      module: "SALES",
    },
    {
      name: "sales_order_read",
      resource: "SalesOrder",
      action: "READ",
      module: "SALES",
    },
    {
      name: "sales_order_update",
      resource: "SalesOrder",
      action: "UPDATE",
      module: "SALES",
    },
    {
      name: "sales_order_delete",
      resource: "SalesOrder",
      action: "DELETE",
      module: "SALES",
    },
    {
      name: "sales_invoice_create",
      resource: "SalesInvoice",
      action: "CREATE",
      module: "SALES",
    },
    {
      name: "sales_invoice_read",
      resource: "SalesInvoice",
      action: "READ",
      module: "SALES",
    },
    {
      name: "sales_invoice_update",
      resource: "SalesInvoice",
      action: "UPDATE",
      module: "SALES",
    },
    {
      name: "sales_invoice_delete",
      resource: "SalesInvoice",
      action: "DELETE",
      module: "SALES",
    },

    // Purchase permissions
    {
      name: "purchase_order_create",
      resource: "PurchaseOrder",
      action: "CREATE",
      module: "PURCHASES",
    },
    {
      name: "purchase_order_read",
      resource: "PurchaseOrder",
      action: "READ",
      module: "PURCHASES",
    },
    {
      name: "purchase_order_update",
      resource: "PurchaseOrder",
      action: "UPDATE",
      module: "PURCHASES",
    },
    {
      name: "purchase_order_delete",
      resource: "PurchaseOrder",
      action: "DELETE",
      module: "PURCHASES",
    },
    {
      name: "purchase_invoice_create",
      resource: "PurchaseInvoice",
      action: "CREATE",
      module: "PURCHASES",
    },
    {
      name: "purchase_invoice_read",
      resource: "PurchaseInvoice",
      action: "READ",
      module: "PURCHASES",
    },
    {
      name: "purchase_invoice_update",
      resource: "PurchaseInvoice",
      action: "UPDATE",
      module: "PURCHASES",
    },
    {
      name: "purchase_invoice_delete",
      resource: "PurchaseInvoice",
      action: "DELETE",
      module: "PURCHASES",
    },

    // Inventory permissions
    {
      name: "part_create",
      resource: "Part",
      action: "CREATE",
      module: "INVENTORY",
    },
    {
      name: "part_read",
      resource: "Part",
      action: "READ",
      module: "INVENTORY",
    },
    {
      name: "part_update",
      resource: "Part",
      action: "UPDATE",
      module: "INVENTORY",
    },
    {
      name: "part_delete",
      resource: "Part",
      action: "DELETE",
      module: "INVENTORY",
    },
    {
      name: "stock_adjustment_create",
      resource: "StockMovement",
      action: "CREATE",
      module: "INVENTORY",
    },
    {
      name: "stock_transfer_create",
      resource: "StockMovement",
      action: "CREATE",
      module: "INVENTORY",
    },

    // Financial permissions
    {
      name: "payment_create",
      resource: "Payment",
      action: "CREATE",
      module: "FINANCIALS",
    },
    {
      name: "receipt_create",
      resource: "Receipt",
      action: "CREATE",
      module: "FINANCIALS",
    },
    {
      name: "journal_entry_create",
      resource: "JournalEntry",
      action: "CREATE",
      module: "FINANCIALS",
    },
    {
      name: "bank_reconciliation_create",
      resource: "BankReconciliation",
      action: "CREATE",
      module: "FINANCIALS",
    },

    // Settings permissions
    {
      name: "company_settings_update",
      resource: "Company",
      action: "UPDATE",
      module: "SETTINGS",
    },
    {
      name: "user_management",
      resource: "User",
      action: "CREATE",
      module: "SETTINGS",
    },
  ];

  const permissions = await Promise.all(
    permissionData.map((data) => prisma.permission.create({ data }))
  );

  // Assign permissions to roles
  const adminPermissions = permissions.map((p) => ({
    roleId: adminRole.id,
    permissionId: p.id,
  }));

  const managerPermissions = permissions
    .filter((p) => !p.name.includes("delete") && !p.name.includes("settings"))
    .map((p) => ({
      roleId: managerRole.id,
      permissionId: p.id,
    }));

  const salesPermissions = permissions
    .filter((p) => p.module === "SALES" || p.name === "part_read")
    .map((p) => ({
      roleId: salesRole.id,
      permissionId: p.id,
    }));

  const inventoryPermissions = permissions
    .filter((p) => p.module === "INVENTORY" || p.name === "part_create")
    .map((p) => ({
      roleId: inventoryRole.id,
      permissionId: p.id,
    }));

  const financePermissions = permissions
    .filter((p) => p.module === "FINANCIALS")
    .map((p) => ({
      roleId: financeRole.id,
      permissionId: p.id,
    }));

  await prisma.rolePermission.createMany({
    data: [
      ...adminPermissions,
      ...managerPermissions,
      ...salesPermissions,
      ...inventoryPermissions,
      ...financePermissions,
    ],
  });

  // Create users
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const users = await Promise.all([
    // Admin user (no branch)
    prisma.user.create({
      data: {
        companyId: company.id,
        email: "admin@autoparts.ae",
        password: hashedPassword,
        name: "System Admin",
        phone: "+971501111111",
        isActive: true,
      },
    }),
    // Dubai branch manager
    prisma.user.create({
      data: {
        companyId: company.id,
        branchId: dubaiBranch.id,
        email: "dubai.manager@autoparts.ae",
        password: hashedPassword,
        name: "Dubai Manager",
        phone: "+971502222222",
        isActive: true,
      },
    }),
    // Abu Dhabi branch manager
    prisma.user.create({
      data: {
        companyId: company.id,
        branchId: abuDhabiBranch.id,
        email: "abudhabi.manager@autoparts.ae",
        password: hashedPassword,
        name: "Abu Dhabi Manager",
        phone: "+971503333333",
        isActive: true,
      },
    }),
    // Dubai sales staff
    prisma.user.create({
      data: {
        companyId: company.id,
        branchId: dubaiBranch.id,
        email: "dubai.sales@autoparts.ae",
        password: hashedPassword,
        name: "Dubai Sales",
        phone: "+971504444444",
        isActive: true,
      },
    }),
    // Abu Dhabi inventory staff
    prisma.user.create({
      data: {
        companyId: company.id,
        branchId: abuDhabiBranch.id,
        email: "abudhabi.inventory@autoparts.ae",
        password: hashedPassword,
        name: "Abu Dhabi Inventory",
        phone: "+971505555555",
        isActive: true,
      },
    }),
  ]);

  // Assign roles to users
  await prisma.userRole.createMany({
    data: [
      { userId: users[0].id, roleId: adminRole.id }, // Admin
      { userId: users[1].id, roleId: managerRole.id }, // Dubai manager
      { userId: users[2].id, roleId: managerRole.id }, // Abu Dhabi manager
      { userId: users[3].id, roleId: salesRole.id }, // Dubai sales
      { userId: users[4].id, roleId: inventoryRole.id }, // Abu Dhabi inventory
    ],
  });

  // Create employees for users
  await Promise.all([
    prisma.employee.create({
      data: {
        code: "EMP001",
        name: "System Admin",
        designation: "System Administrator",
        department: "IT",
        phone: "+971501111111",
        email: "admin@autoparts.ae",
        userId: users[0].id,
      },
    }),
    prisma.employee.create({
      data: {
        code: "EMP002",
        name: "Dubai Manager",
        designation: "Branch Manager",
        department: "Management",
        phone: "+971502222222",
        email: "dubai.manager@autoparts.ae",
        branchId: dubaiBranch.id,
        userId: users[1].id,
      },
    }),
    prisma.employee.create({
      data: {
        code: "EMP003",
        name: "Abu Dhabi Manager",
        designation: "Branch Manager",
        department: "Management",
        phone: "+971503333333",
        email: "abudhabi.manager@autoparts.ae",
        branchId: abuDhabiBranch.id,
        userId: users[2].id,
      },
    }),
  ]);

  // Create code sequences
  await Promise.all([
    prisma.codeSequence.create({
      data: {
        entityType: "Part",
        prefix: "PART",
        lastNumber: 100,
      },
    }),
    prisma.codeSequence.create({
      data: {
        entityType: "Customer",
        prefix: "CUST",
        lastNumber: 100,
      },
    }),
    prisma.codeSequence.create({
      data: {
        entityType: "Supplier",
        prefix: "SUPP",
        lastNumber: 100,
      },
    }),
    prisma.codeSequence.create({
      data: {
        entityType: "Employee",
        prefix: "EMP",
        lastNumber: 100,
      },
    }),
  ]);

  // Create voucher sequences
  await Promise.all([
    prisma.voucherSequence.create({
      data: {
        voucherType: "SALES_INVOICE",
        branchId: dubaiBranch.id,
        financialYearId: financialYear.id,
        prefix: "SI",
        lastNumber: 0,
      },
    }),
    prisma.voucherSequence.create({
      data: {
        voucherType: "PURCHASE_INVOICE",
        branchId: dubaiBranch.id,
        financialYearId: financialYear.id,
        prefix: "PI",
        lastNumber: 0,
      },
    }),
    prisma.voucherSequence.create({
      data: {
        voucherType: "PAYMENT",
        branchId: dubaiBranch.id,
        financialYearId: financialYear.id,
        prefix: "PAY",
        lastNumber: 0,
      },
    }),
    prisma.voucherSequence.create({
      data: {
        voucherType: "RECEIPT",
        branchId: dubaiBranch.id,
        financialYearId: financialYear.id,
        prefix: "REC",
        lastNumber: 0,
      },
    }),
  ]);

  // Create print templates
  await Promise.all([
    prisma.printTemplate.create({
      data: {
        name: "Standard Sales Invoice",
        description: "Default sales invoice template",
        templateType: "SALES_INVOICE",
        content: `<div class="invoice">
          <h1>Sales Invoice</h1>
          <p>Invoice #: <%= number %></p>
          <p>Date: <%= date %></p>
          <!-- More template content -->
        </div>`,
        isDefault: true,
        paperSize: "A4",
        orientation: "PORTRAIT",
      },
    }),
    prisma.printTemplate.create({
      data: {
        name: "Standard Purchase Invoice",
        description: "Default purchase invoice template",
        templateType: "PURCHASE_INVOICE",
        content: `<div class="invoice">
          <h1>Purchase Invoice</h1>
          <p>Invoice #: <%= number %></p>
          <p>Date: <%= date %></p>
          <!-- More template content -->
        </div>`,
        isDefault: true,
        paperSize: "A4",
        orientation: "PORTRAIT",
      },
    }),
  ]);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
