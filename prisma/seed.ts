import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Default service data
  const services = [
    { id: 1, name: 'Storefront' },
    { id: 2, name: 'Payments' },
    { id: 3, name: 'Export Service' },
    { id: 4, name: 'AI Chatbot' },
    { id: 5, name: 'Mockup Generator' },
    { id: 6, name: 'Notifications' },
    { id: 7, name: 'Analytics' },
  ];

  for (const service of services) {
    try {
      await prisma.service.upsert({
        where: { name: service.name },
        update: {},
        create: service,
      });
      console.log(`Inserted: ${service.name}`);
    } catch (e) {
      console.error(`Failed to insert ${service.name}:`, e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
