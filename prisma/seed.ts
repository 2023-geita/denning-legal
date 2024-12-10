import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    console.log('Cleaning up existing data...');
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.payment.deleteMany(),
      prisma.bill.deleteMany(),
      prisma.documentVersion.deleteMany(),
      prisma.document.deleteMany(),
      prisma.client.deleteMany(),
      prisma.task.deleteMany(),
      prisma.session.deleteMany(),
      prisma.matterDocument.deleteMany(),
      prisma.subscribedAttorney.deleteMany(),
      prisma.matterDeadline.deleteMany(),
      prisma.matter.deleteMany(),
    ]);

    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@denning.com',
        name: 'Demo User',
        password: hashedPassword,
        role: UserRole.ATTORNEY,
        active: true,
      }
    });

    console.log('Creating sample data...');

    // Create a sample client
    const client = await prisma.client.create({
      data: {
        name: 'John Doe',
        type: 'Individual',
        email: 'john@example.com',
        phone: '+254700000000',
        location: 'Nairobi',
        responsibleAttorney: demoUser.id,
        status: 'Active'
      }
    });

    // Create a sample matter
    const matter = await prisma.matter.create({
      data: {
        name: 'Civil Case 001',
        client: client.name,
        status: 'Open',
        notes: 'Sample matter notes',
        originatingAttorney: demoUser.id,
        responsibleAttorney: demoUser.id,
        courtLocation: 'Nairobi Law Courts',
        practiceArea: 'Civil Litigation',
        caseNumber: 'CIVIL-2024-001',
        deadlines: {
          create: {
            matterOpens: new Date(),
            matterCloses: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            matterDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            statuteOfLimitations: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        },
        subscribedAttorneys: {
          create: {
            attorneyName: demoUser.name || 'Demo User'
          }
        },
        assignedUsers: {
          connect: {
            id: demoUser.id
          }
        }
      }
    });

    // Create a sample document
    const document = await prisma.document.create({
      data: {
        name: 'Sample Agreement',
        type: 'Agreement',
        status: 'Uploaded',
        matterId: matter.id,
        matterName: matter.name,
        uploadedBy: demoUser.id,
        fileUrl: 'https://example.com/sample.pdf',
        fileSize: 1024,
        tags: ['agreement', 'civil']
      }
    });

    // Create a sample bill
    const bill = await prisma.bill.create({
      data: {
        clientId: client.id,
        clientName: client.name,
        matterId: matter.id,
        matterName: matter.name,
        totalCost: 50000,
        retainerFee: 10000,
        retainerDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        unpaidBalance: 50000,
        status: 'Pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    console.log('Sample data created successfully!');
    console.log('Demo account credentials:');
    console.log('Email: demo@denning.com');
    console.log('Password: demo123');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 