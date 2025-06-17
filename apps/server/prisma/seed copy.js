const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

// Configuration constants
const SEED_CONFIG = {
  COMPANY: {
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
    website: 'www.autoparts.ae'
  },
  BRANCH: {
    code: 'BR001',
    name: 'Main Branch',
    address: '123 Industrial Area',
    city: 'Dubai',
    state: 'Dubai',
    phone: '+97112345678',
    email: 'main@autoparts.ae'
  },
  FINANCIAL_YEAR: {
    name: 'FY 2025-26',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2026-03-31')
  },
  ADMIN_USER: {
    email: process.env.ADMIN_EMAIL || 'admin@autoparts.ae',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    name: 'System Administrator',
    phone: '+97112345678'
  },
  WAREHOUSE: {
    code: 'WH001',
    name: 'Main Warehouse',
    address: '123 Industrial Area'
  },
  BIN: {
    code: 'A1',
    name: 'Bin A1',
    location: 'Aisle 1'
  }
};

// Utility functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function logProgress(step, totalSteps, message) {
  console.log(`[${step}/${totalSteps}] ${message}`);
}

async function cleanupDatabase() {
  if (process.env.CLEAN_BEFORE_SEED === 'true') {
    console.log('🧹 Cleaning up existing data...');
    const deleteOrder = [
      'rolePermission',
      'userRole',
      'permission',
      'role',
      'employee',
      'user',
      'currentStock',
      'stockMovement',
      'stockLot',
      'partUnit',
      'part',
      'bin',
      'warehouse',
      'codeSequence',
      'voucherSequence',
      'financialYear',
      'branch',
      'company'
    ];

    for (const model of deleteOrder) {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM "${model}"`);
        console.log(`  - Cleared ${model}`);
      } catch (error) {
        console.error(`  - Failed to clear ${model}: ${error.message}`);
      }
    }
    console.log('✅ Database cleaned');
  }
}

async function createDefaultCompany() {
  return prisma.company.upsert({
    where: { id: SEED_CONFIG.COMPANY.id },
    update: {},
    create: SEED_CONFIG.COMPANY
  });
}

async function createDefaultBranch(companyId) {
  return prisma.branch.upsert({
    where: { code: SEED_CONFIG.BRANCH.code },
    update: {},
    create: {
      ...SEED_CONFIG.BRANCH,
      companyId
    }
  });
}

async function createFinancialYear(companyId) {
  return prisma.financialYear.upsert({
    where: { 
      companyId_startDate: { 
        companyId, 
        startDate: SEED_CONFIG.FINANCIAL_YEAR.startDate 
      } 
    },
    update: {},
    create: {
      ...SEED_CONFIG.FINANCIAL_YEAR,
      companyId,
      isActive: true
    }
  });
}

async function createCodeSequences(branchId) {
  const sequences = [
    { entityType: 'Part', branchId, prefix: 'PART', lastNumber: 0 },
    { entityType: 'Customer', branchId, prefix: 'CUST', lastNumber: 0 },
    { entityType: 'Supplier', branchId, prefix: 'SUPP', lastNumber: 0 }
  ];

  for (const seq of sequences) {
    await prisma.codeSequence.upsert({
      where: { entityType_branchId: { entityType: seq.entityType, branchId } },
      update: {},
      create: seq
    });
  }
}

async function createVoucherSequence(branchId, financialYearId) {
  return prisma.voucherSequence.upsert({
    where: {
      voucherType_branchId_financialYearId: {
        voucherType: 'SalesInvoice',
        branchId,
        financialYearId
      }
    },
    update: {},
    create: {
      voucherType: 'SalesInvoice',
      branchId,
      financialYearId,
      prefix: 'INV',
      lastNumber: 0
    }
  });
}

async function createPermissions() {
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
    { name: 'manage_all', resource: 'all', action: 'manage' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
  }
}

async function createRoles() {
  const roles = [
    { name: 'Admin', description: 'Full system access' },
    { name: 'Manager', description: 'Management level access' },
    { name: 'Sales Executive', description: 'Sales operations access' },
    { name: 'Purchase Executive', description: 'Purchase operations access' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }
}

async function assignPermissionsToRoles() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  // Assign all permissions to Admin
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.find(r => r.name === 'Admin').id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: roles.find(r => r.name === 'Admin').id,
        permissionId: permission.id
      }
    });
  }

  // Assign limited permissions to other roles
  const managerPermissions = ['reports', 'settings', 'sales', 'purchases']
    .map(resource => permissions.filter(p => p.resource === resource))
    .flat();

  const salesPermissions = ['sales', 'reports.view']
    .map(name => permissions.find(p => p.name === name || p.resource === name.split('.')[0]))
    .filter(Boolean);

  const purchasePermissions = ['purchases', 'reports.view']
    .map(name => permissions.find(p => p.name === name || p.resource === name.split('.')[0]))
    .filter(Boolean);

  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.find(r => r.name === 'Manager').id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: roles.find(r => r.name === 'Manager').id,
        permissionId: permission.id
      }
    });
  }

  for (const permission of salesPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.find(r => r.name === 'Sales Executive').id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: roles.find(r => r.name === 'Sales Executive').id,
        permissionId: permission.id
      }
    });
  }

  for (const permission of purchasePermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.find(r => r.name === 'Purchase Executive').id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: roles.find(r => r.name === 'Purchase Executive').id,
        permissionId: permission.id
      }
    });
  }
}

async function createAdminUser(companyId, branchId) {
  if (!isValidEmail(SEED_CONFIG.ADMIN_USER.email)) {
    throw new Error('Invalid admin email format');
  }

  const hashedPassword = await bcrypt.hash(SEED_CONFIG.ADMIN_USER.password, 12);
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });

  const user = await prisma.user.upsert({
    where: { email: SEED_CONFIG.ADMIN_USER.email },
    update: {},
    create: {
      email: SEED_CONFIG.ADMIN_USER.email,
      password: hashedPassword,
      name: SEED_CONFIG.ADMIN_USER.name,
      phone: SEED_CONFIG.ADMIN_USER.phone,
      companyId,
      branchId,
      roles: {
        create: [{ roleId: adminRole.id }]
      }
    }
  });

  // Create employee record
  await prisma.employee.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      code: 'EMP001',
      name: SEED_CONFIG.ADMIN_USER.name,
      designation: 'System Administrator',
      department: 'IT',
      phone: SEED_CONFIG.ADMIN_USER.phone,
      email: SEED_CONFIG.ADMIN_USER.email,
      salary: 10000.00,
      joinDate: new Date(),
      userId: user.id,
      branchId
    }
  });

  return user;
}

async function createWarehouse(branchId) {
  return prisma.warehouse.upsert({
    where: { code: SEED_CONFIG.WAREHOUSE.code },
    update: {},
    create: {
      ...SEED_CONFIG.WAREHOUSE,
      branchId
    }
  });
}

async function createBin(warehouseId) {
  return prisma.bin.upsert({
    where: { warehouseId_code: { warehouseId, code: SEED_CONFIG.BIN.code } },
    update: {},
    create: {
      ...SEED_CONFIG.BIN,
      warehouseId
    }
  });
}

async function createSampleData(adminUserId, branchId) {
  // Create vehicle model
  const vehicleModel = await prisma.vehicleModel.upsert({
    where: { make_model_year: { make: 'Toyota', model: 'Camry', year: 2020 } },
    update: {},
    create: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020
    }
  });

  // Create part
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
      createdById: adminUserId,
      updatedById: adminUserId,
      units: {
        create: [
          {
            unitName: 'Piece',
            symbol: 'PC',
            conversionRate: 1.0,
            isBaseUnit: true
          }
        ]
      },
      vehicleModels: {
        create: [{ vehicleModelId: vehicleModel.id }]
      }
    }
  });

  // Create customer
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
            notes: 'Customer\'s primary vehicle'
          }
        ]
      }
    }
  });

  // Create supplier
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
      country: 'UAE'
    }
  });

  // Create ledger group and ledger
  const ledgerGroup = await prisma.ledgerGroup.upsert({
    where: { name: 'Assets' },
    update: {},
    create: {
      name: 'Assets',
      groupType: 'ASSETS',
      level: 1
    }
  });

  await prisma.ledger.upsert({
    where: { name: 'Cash' },
    update: {},
    create: {
      name: 'Cash',
      ledgerGroupId: ledgerGroup.id,
      openingBalance: 10000.0,
      currentBalance: 10000.0
    }
  });

  return { part, customer, supplier };
}

async function verifySeed() {
  const checks = [
    { model: 'user', minCount: 1 },
    { model: 'part', minCount: 1 },
    { model: 'customer', minCount: 1 },
    { model: 'supplier', minCount: 1 }
  ];

  for (const check of checks) {
    const count = await prisma[check.model].count();
    if (count < check.minCount) {
      throw new Error(`Seed verification failed - ${check.model} count ${count} < ${check.minCount}`);
    }
  }
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    const totalSteps = 12;
    let currentStep = 0;

    // Step 1: Cleanup if needed
    await cleanupDatabase();
    currentStep++;

    // Step 2: Create company
    await logProgress(currentStep++, totalSteps, 'Creating company...');
    const company = await createDefaultCompany();

    // Step 3: Create branch
    await logProgress(currentStep++, totalSteps, 'Creating branch...');
    const branch = await createDefaultBranch(company.id);

    // Step 4: Create financial year
    await logProgress(currentStep++, totalSteps, 'Creating financial year...');
    const financialYear = await createFinancialYear(company.id);

    // Step 5: Create code sequences
    await logProgress(currentStep++, totalSteps, 'Creating code sequences...');
    await createCodeSequences(branch.id);

    // Step 6: Create voucher sequence
    await logProgress(currentStep++, totalSteps, 'Creating voucher sequence...');
    await createVoucherSequence(branch.id, financialYear.id);

    // Step 7: Create permissions
    await logProgress(currentStep++, totalSteps, 'Creating permissions...');
    await createPermissions();

    // Step 8: Create roles
    await logProgress(currentStep++, totalSteps, 'Creating roles...');
    await createRoles();

    // Step 9: Assign permissions to roles
    await logProgress(currentStep++, totalSteps, 'Assigning permissions...');
    await assignPermissionsToRoles();

    // Step 10: Create admin user
    await logProgress(currentStep++, totalSteps, 'Creating admin user...');
    const adminUser = await createAdminUser(company.id, branch.id);
    console.log(`   Admin credentials: ${adminUser.email} / ${SEED_CONFIG.ADMIN_USER.password}`);

    // Step 11: Create warehouse and bin
    await logProgress(currentStep++, totalSteps, 'Creating warehouse...');
    const warehouse = await createWarehouse(branch.id);
    await logProgress(currentStep++, totalSteps, 'Creating bin...');
    await createBin(warehouse.id);

    // Step 12: Create sample data
    await logProgress(currentStep++, totalSteps, 'Creating sample data...');
    await createSampleData(adminUser.id, branch.id);

    // Verification
    await verifySeed();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();