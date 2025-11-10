import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const log = {
  success: (value: string) => console.log(`\n\x1b[32m${value}\x1b[0m`),
  error: (value: string | Error) => console.error(`\n\x1b[31m${value}\x1b[0m`),
  info: (value: string) => console.log(`\n\x1b[34m${value}\x1b[0m`),
};

async function seedData(seedName: string, seedFn: () => Promise<void>) {
  try {
    await seedFn();
    log.success('- Seeded ' + seedName);
  } catch (error) {
    log.error('- Error seeding ' + seedName);
    throw error;
  }
}

async function seedUsers() {
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordOperator = await bcrypt.hash('operator123', 10);

  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: passwordAdmin,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  await prisma.user.create({
    data: {
      firstName: 'Operator',
      lastName: 'User',
      email: 'operator@example.com',
      password: passwordOperator,
      role: UserRole.OPERATOR,
      isActive: true,
    },
  });
}

const SEED_LIST_COMMAND = 'list';
const SEED_COMMANDS: Record<string, () => Promise<void>> = {
  users: seedUsers,
};

async function executeSeedCommand(command: string) {
  if (command === SEED_LIST_COMMAND) {
    log.info('- Available seed commands:\n');
    Object.keys(SEED_COMMANDS).forEach((command) => {
      log.info(`* ${command}`);
    });
    return;
  }

  const isValidSeed = Object.keys(SEED_COMMANDS).includes(command);
  if (!isValidSeed) throw new Error(`Seed '${command}' does not exist`);

  log.success('Seeding started...');
  await seedData(command, SEED_COMMANDS[command]);
  log.success('Seeding completed successfully!');
}

async function main(): Promise<void> {
  try {
    const seedCommand = process.argv[2];
    if (seedCommand) return await executeSeedCommand(seedCommand);

    log.success('Seeding started...');
    for (const [name, fn] of Object.entries(SEED_COMMANDS)) {
      await seedData(name, fn);
    }
    log.success('Seeding completed successfully!');
  } catch (error) {
    log.error(error as Error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
