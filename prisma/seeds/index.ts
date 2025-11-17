import bcrypt from 'bcrypt';
import { ParkingSpaceStatus, PrismaClient, UserRole } from '@prisma/client';

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
  const password = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pl.com',
      password,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  await prisma.user.create({
    data: {
      firstName: 'Operator',
      lastName: 'User',
      email: 'operator@pl.com',
      password,
      role: UserRole.OPERATOR,
      isActive: true,
    },
  });
}

async function seedVehicleTypes() {
  await prisma.vehicleType.createMany({
    data: [
      { name: 'Auto', ratePerMinute: 1.5, description: 'Vehículo tipo auto' },
      {
        name: 'Camioneta',
        ratePerMinute: 2.0,
        description: 'Vehículo tipo camioneta',
      },
      { name: 'Moto', ratePerMinute: 1.0, description: 'Vehículo tipo moto' },
    ],
    skipDuplicates: true,
  });
}

export async function seedSectors() {
  const sectors = Array.from({ length: 3 }, (_, i) => ({
    name: `Sector ${i + 1}`,
    description: `Sector número ${i + 1}`,
  }));

  const createdSectors = await Promise.all(
    sectors.map((sector) => prisma.sector.create({ data: sector }))
  );

  const parkingSpaces = createdSectors.flatMap((sector) =>
    Array.from({ length: 6 }, (_, j) => ({
      number: j + 1,
      sectorId: sector.id,
      status: ParkingSpaceStatus.AVAILABLE,
    }))
  );

  await prisma.parkingSpace.createMany({
    data: parkingSpaces,
  });
}

const SEED_LIST_COMMAND = 'list';
const SEED_COMMANDS: Record<string, () => Promise<void>> = {
  users: seedUsers,
  sectors: seedSectors,
  vehicleTypes: seedVehicleTypes,
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
