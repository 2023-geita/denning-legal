import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample client
  const client = await prisma.client.create({
    data: {
      name: 'John Doe',
      type: 'Individual',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York',
      responsibleAttorney: 'Jane Smith',
      status: 'Active'
    }
  });

  // Create sample matter
  const matter = await prisma.matter.create({
    data: {
      client: client.id,
      status: 'Open',
      notes: 'Initial consultation completed',
      originatingAttorney: 'Jane Smith',
      responsibleAttorney: 'Jane Smith',
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
          attorneyName: 'Jane Smith'
        }
      }
    }
  });

  // Create sample task
  await prisma.task.create({
    data: {
      title: 'Review Contract',
      description: 'Initial review of client contract',
      status: 'Pending',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: 'Jane Smith',
      matterId: matter.id
    }
  });

  // Create sample session
  await prisma.session.create({
    data: {
      matterId: matter.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 120,
      notes: 'Initial client consultation'
    }
  });

  // Create sample billing
  await prisma.billing.create({
    data: {
      clientId: client.id,
      matterId: matter.id,
      amount: 500.00,
      status: 'Unpaid',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'Initial consultation and document review'
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