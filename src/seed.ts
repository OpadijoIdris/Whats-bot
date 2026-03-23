import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const phoneId = process.env['WHATSAPP_PHONE_NUMBER_ID'] || 'PHONE_ID_HERE';
  
  console.log(`[Seed]: Seeding database for Phone ID: ${phoneId}...`);

  const account = await prisma.account.upsert({
    where: { whatsappPhoneId: phoneId },
    update: {},
    create: {
      name: 'My Main Business',
      whatsappPhoneId: phoneId,
      whatsappToken: process.env['WHATSAPP_ACCESS_TOKEN'] || 'TOKEN_HERE',
      botPersonality: 'You are a helpful and professional WhatsApp AI assistant for our business. Keep responses concise and friendly.',
    },
  });

  console.log(`[Seed]: Success! Account created: ${account.name} (ID: ${account.id})`);
}

main()
  .catch((e) => {
    console.error('[Seed]: Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
