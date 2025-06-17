const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default company
  const company = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company',
      name: 'Auto Parts LLC',
      tradeLicenseNo: 'TR123456',
      vatRegistrationNo: 'VAT789012',
      address: '123 Industrial Area',
      city: 'Dubai',
      state: 'Dubai',
      country: 'UAE',
      phone: '+97112345678',
      email: 'info@autoparts.ae',
      website: 'www.autoparts.ae',
    },
  });
  console.log('✅ Company created:', company.name);

  // Create default branch
  const branch = await prisma.branch.upsert({
    where: { code: 'BR001' },
    update: {},
    create: {
      companyId: company.id,
      name: 'Main Branch',
      code: 'BR001',
      address: '123 Industrial Area',
      city: 'Dubai',
      state: 'Dubai',
      phone: '+97112345678',
      email: 'main@autoparts.ae',
    },
  });
  console.log('✅ Branch created:', branch.name);

  // Create Financial Year
  const financialYear = await prisma.financialYear.upsert({
    where: { companyId_startDate: { companyId: company.id, startDate: new Date('2025-04-01') } },
    update: {},
    create: {
      companyId: company.id,
      name: 'FY 2025-26',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-03-31'),
      isActive: true,
    },
  });
  console.log('✅ Financial Year created:', financialYear.name);

  // Create Code Sequences
  const codeSequences = [
    { entityType: 'Part', branchId: branch.id, prefix: 'PART', lastNumber: 0 },
    { entityType: 'Customer', branchId: branch.id, prefix: 'CUST', lastNumber: 0 },
    { entityType: 'Supplier', branchId: branch.id, prefix: 'SUPP', lastNumber: 0 },
  ];
  console.log('🔢 Creating code sequences...');
  for (const seq of codeSequences) {
    await prisma.codeSequence.upsert({
      where: { entityType_branchId: { entityType: seq.entityType, branchId: seq.branchId } },
      update: {},
      create: seq,
    });
  }
  console.log('✅ Code sequences created');

  // Create Voucher Sequence
  await prisma.voucherSequence.upsert({
    where: {
      voucherType_branchId_financialYearId: {
        voucherType: 'SalesInvoice',
        branchId: branch.id,
        financialYearId: financialYear.id,
      },
    },
    update: {},
    create: {
      voucherType: 'SalesInvoice',
      branchId: branch.id,
      financialYearId: financialYear.id,
      prefix: 'INV',
      lastNumber: 0,
    },
  });
  console.log('✅ Voucher sequence created for SalesInvoice');

  // Create permissions
  const permissions = [
    // User Management
    { name: 'users.view', resource: 'users', action: 'view' },
    { name: 'users.create', resource: 'users', action: 'create' },
    { name: 'users.update', resource: 'users', action: 'update' },
    { name: 'users.delete', resource: 'users', action: 'delete' },
    // Parts Management
    { name: 'parts.view', resource: 'parts', action: 'view' },
    { name: 'parts.create', resource: 'parts', action: 'create' },
    { name: 'parts.update', resource: 'parts', action: 'update' },
    { name: 'parts.delete', resource: 'parts', action: 'delete' },
    // Sales Management
    { name: 'sales.view', resource: 'sales', action: 'view' },
    { name: 'sales.create', resource: 'sales', action: 'create' },
    { name: 'sales.update', resource: 'sales', action: 'update' },
    { name: 'sales.delete', resource: 'sales', action: 'delete' },
    // Purchase Management
    { name: 'purchases.view', resource: 'purchases', action: 'view' },
    { name: 'purchases.create', resource: 'purchases', action: 'create' },
    { name: 'purchases.update', resource: 'purchases', action: 'update' },
    { name: 'purchases.delete', resource: 'purchases', action: 'delete' },
    // Reports
    { name: 'reports.view', resource: 'reports', action: 'view' },
    { name: 'reports.export', resource: 'reports', action: 'export' },
    // Settings
    { name: 'settings.view', resource: 'settings', action: 'view' },
    { name: 'settings.update', resource: 'settings', action: 'update' },
    // Additional permission for full access
    { name: 'manage_all', resource: 'all', action: 'manage' },
  ];
  console.log('🔐 Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }
  console.log('✅ Permissions created');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Management level access',
    },
  });

  const salesRole = await prisma.role.upsert({
    where: { name: 'Sales Executive' },
    update: {},
    create: {
      name: 'Sales Executive',
      description: 'Sales operations access',
    },
  });

  const purchaseRole = await prisma.role.upsert({
    where: { name: 'Purchase Executive' },
    update: {},
    create: {
      name: 'Purchase Executive',
      description: 'Purchase operations access',
    },
  });
  console.log('✅ Roles created');

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign limited permissions to Manager role
  const managerPermissions = permissions.filter(p =>
    p.resource === 'reports' || p.resource === 'settings' || p.resource === 'sales' || p.resource === 'purchases'
  );
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
      },
    });
  }

  // Assign sales permissions to Sales Executive role
  const salesPermissions = permissions.filter(p => p.resource === 'sales' || p.name === 'reports.view');
  for (const permission of salesPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: salesRole.id,
          permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
        },
      },
      update: {},
      create: {
        roleId: salesRole.id,
        permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
      },
    });
  }

  // Assign purchase permissions to Purchase Executive role
  const purchasePermissions = permissions.filter(p => p.resource === 'purchases' || p.name === 'reports.view');
  for (const permission of purchasePermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: purchaseRole.id,
          permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
        },
      },
      update: {},
      create: {
        roleId: purchaseRole.id,
        permissionId: (await prisma.permission.findUnique({ where: { name: permission.name } })).id,
      },
    });
  }
  console.log('✅ Permissions assigned to roles');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@autoparts.ae' },
    update: {},
    create: {
      email: 'admin@autoparts.ae',
      password: hashedPassword,
      name: 'System Administrator',
      phone: '+97112345678',
      companyId: company.id,
      branchId: branch.id,
      roles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });
  console.log('✅ Admin user created');
  console.log('📧 Email: admin@autoparts.ae');
  console.log('🔑 Password: admin123');

  // Create a sample employee record for admin
  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      code: 'EMP001',
      name: adminUser.name,
      designation: 'System Administrator',
      department: 'IT',
      phone: adminUser.phone,
      email: adminUser.email,
      salary: 10000.00,
      joinDate: new Date(),
      userId: adminUser.id,
      branchId: branch.id,
    },
  });
  console.log('✅ Employee record created for admin');

  // Create Warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH001' },
    update: {},
    create: {
      branchId: branch.id,
      name: 'Main Warehouse',
      code: 'WH001',
      address: '123 Industrial Area',
    },
  });
  console.log('✅ Warehouse created:', warehouse.name);

  // Create Bin
  const bin = await prisma.bin.upsert({
    where: { warehouseId_code: { warehouseId: warehouse.id, code: 'A1' } },
    update: {},
    create: {
      warehouseId: warehouse.id,
      name: 'Bin A1',
      code: 'A1',
      location: 'Aisle 1',
    },
  });
  console.log('✅ Bin created:', bin.name);

  // Create Vehicle Model
  const vehicleModel = await prisma.vehicleModel.upsert({
    where: { make_model_year: { make: 'Toyota', model: 'Camry', year: 2020 } },
    update: {},
    create: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    },
  });
  console.log('✅ Vehicle model created:', vehicleModel.make, vehicleModel.model);

  // Create Part
  const part = await prisma.part.upsert({
    where: { partNumber: 'PN12345' },
    update: {},
    create: {
      code: 'PART0001',
      partNumber: 'PN12345',
      name: 'Oil Filter',
      description: 'High-quality oil filter for Toyota Camry',
      category: 'Engine',
      brand: 'Toyota',
      barCode: '1234567890123',
      hsnCode: '8708',
      vatRate: 5.0,
      reorderLevel: 10.0,
      maxStockLevel: 100.0,
      minStockLevel: 5.0,
      purchaseRate: 50.0,
      sellingRate: 75.0,
      warrantyPeriod: 6,
      warrantyPeriodType: 'MONTHS',
      createdById: adminUser.id,
      updatedById: adminUser.id,
      units: {
        create: [
          {
            unitName: 'Piece',
            symbol: 'PC',
            conversionRate: 1.0,
            isBaseUnit: true,
          },
        ],
      },
      vehicleModels: {
        create: [{ vehicleModelId: vehicleModel.id }],
      },
    },
  });
  console.log('✅ Part created:', part.name);

  // Create Customer
  const customer = await prisma.customer.upsert({
    where: { code: 'CUST0001' },
    update: {},
    create: {
      code: 'CUST0001',
      name: 'John Doe',
      contactPerson: 'John Doe',
      phone: '+97198765432',
      email: 'john.doe@gmail.com',
      address: '456 Residential Area',
      city: 'Dubai',
      country: 'UAE',
      vehicles: {
        create: [
          {
            vehicleModelId: vehicleModel.id,
            vin: '1HGCM82633A123456',
            licensePlate: 'DXB1234',
            notes: 'Customer’s primary vehicle',
          },
        ],
      },
    },
  });
  console.log('✅ Customer created:', customer.name);

  // Create Supplier
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUPP0001' },
    update: {},
    create: {
      code: 'SUPP0001',
      name: 'Auto Parts Supplier Ltd',
      contactPerson: 'Jane Smith',
      phone: '+97155555555',
      email: 'supplier@autoparts.com',
      address: '789 Supplier Park',
      city: 'Sharjah',
      country: 'UAE',
    },
  });
  console.log('✅ Supplier created:', supplier.name);

  // Create Ledger Group
  const ledgerGroup = await prisma.ledgerGroup.upsert({
    where: { name: 'Assets' },
    update: {},
    create: {
      name: 'Assets',
      groupType: 'ASSETS',
      level: 1,
    },
  });
  console.log('✅ Ledger group created:', ledgerGroup.name);

  // Create Ledger
  const ledger = await prisma.ledger.upsert({
    where: { name: 'Cash' },
    update: {},
    create: {
      name: 'Cash',
      ledgerGroupId: ledgerGroup.id,
      openingBalance: 10000.0,
      currentBalance: 10000.0,
    },
  });
  console.log('✅ Ledger created:', ledger.name);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });