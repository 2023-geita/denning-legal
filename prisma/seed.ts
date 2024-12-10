import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user first (needed for task assignment)
  const user = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword', // In production, this should be properly hashed
      role: 'ATTORNEY',
      active: true
    }
  });

  // Create sample client
  const client = await prisma.client.create({
    data: {
      name: 'John Doe',
      type: 'Individual',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York',
      responsibleAttorney: user.id,
      status: 'Active'
    }
  });

  // Create sample matter
  const matter = await prisma.matter.create({
    data: {
      client: client.name, // Changed from client.id to client.name as per schema
      status: 'Open',
      notes: 'Initial consultation completed',
      originatingAttorney: user.name || 'Jane Smith',
      responsibleAttorney: user.name || 'Jane Smith',
      courtLocation: 'New York Supreme Court',
      practiceArea: 'Corporate Law',
      caseNumber: 'CASE-2023-001',
      deadlines: {
        create: {
          matterOpens: new Date(),
          matterCloses: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          matterDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          statuteOfLimitations: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      },
      documents: {
        create: {
          name: 'Initial Agreement',
          url: '/documents/agreement.pdf',
          type: 'Agreement',
          uploadedAt: new Date()
        }
      },
      subscribedAttorneys: {
        create: {
          attorneyName: user.name || 'Jane Smith'
        }
      }
    }
  });

  // Create sample task
  await prisma.task.create({
    data: {
      name: 'Review Contract', // Changed from title to name as per schema
      description: 'Initial review of client contract',
      matterId: matter.id,
      assignedAttorney: user.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Pending',
      priority: 'High',
      reminder: false
    }
  });

  // Create sample billable session
  await prisma.billableSession.create({
    data: {
      matterId: matter.id,
      matterName: matter.caseNumber,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 120,
      notes: 'Initial client consultation',
      attorney: user.name || 'Jane Smith',
      billingRate: 250.00,
      date: new Date(),
      status: 'Completed',
      billable: true
    }
  });

  // Create sample bill
  await prisma.bill.create({
    data: {
      clientId: client.id,
      clientName: client.name,
      matterId: matter.id,
      matterName: matter.caseNumber,
      totalCost: 500.00,
      retainerFee: 1000.00,
      retainerDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      unpaidBalance: 500.00,
      status: 'Pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });