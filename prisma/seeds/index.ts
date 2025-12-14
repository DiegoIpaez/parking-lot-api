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

async function seedVehicleBrands() {
  const brands = [
    'Volkswagen',
    'Renault',
    'Ford',
    'Chevrolet',
    'Fiat',
    'Peugeot',
    'Toyota',
    'Citroën',
    'Mercedes-Benz',
    'Honda',
    'Nissan',
    'Kia',
    'Hyundai',
    'Jeep',
  ];
  await prisma.vehicleBrand.createMany({
    data: brands.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

async function seedVehicleModels() {
  const modelsByBrand: Record<string, { name: string; type: string }[]> = {
    Volkswagen: [
      { name: 'Gol', type: 'Auto' },
      { name: 'Voyage', type: 'Auto' },
      { name: 'Amarok', type: 'Camioneta' },
      { name: 'T-Cross', type: 'Auto' },
    ],
    Renault: [
      { name: 'Kangoo', type: 'Camioneta' },
      { name: 'Sandero', type: 'Auto' },
      { name: 'Duster', type: 'Camioneta' },
    ],
    Ford: [
      { name: 'Fiesta', type: 'Auto' },
      { name: 'Focus', type: 'Auto' },
      { name: 'Ranger', type: 'Camioneta' },
      { name: 'EcoSport', type: 'Camioneta' },
    ],
    Chevrolet: [
      { name: 'Onix', type: 'Auto' },
      { name: 'Prisma', type: 'Auto' },
      { name: 'S10', type: 'Camioneta' },
      { name: 'Tracker', type: 'Camioneta' },
    ],
    Fiat: [
      { name: 'Cronos', type: 'Auto' },
      { name: 'Toro', type: 'Camioneta' },
      { name: 'Strada', type: 'Camioneta' },
      { name: 'Argo', type: 'Auto' },
    ],
    Peugeot: [
      { name: '208', type: 'Auto' },
      { name: '2008', type: 'Auto' },
      { name: 'Partner', type: 'Camioneta' },
    ],
    Toyota: [
      { name: 'Corolla', type: 'Auto' },
      { name: 'Hilux', type: 'Camioneta' },
      { name: 'Etios', type: 'Auto' },
      { name: 'Yaris', type: 'Auto' },
    ],
    Citroën: [
      { name: 'C3', type: 'Auto' },
      { name: 'Berlingo', type: 'Camioneta' },
      { name: 'C4 Cactus', type: 'Auto' },
    ],
    'Mercedes-Benz': [
      { name: 'Sprinter', type: 'Camioneta' },
      { name: 'Vito', type: 'Camioneta' },
    ],
    Honda: [
      { name: 'Civic', type: 'Auto' },
      { name: 'Fit', type: 'Auto' },
      { name: 'HR-V', type: 'Camioneta' },
    ],
    Nissan: [
      { name: 'Versa', type: 'Auto' },
      { name: 'Kicks', type: 'Camioneta' },
      { name: 'Frontier', type: 'Camioneta' },
    ],
    Kia: [
      { name: 'Rio', type: 'Auto' },
      { name: 'Seltos', type: 'Camioneta' },
      { name: 'Sportage', type: 'Camioneta' },
    ],
    Hyundai: [
      { name: 'HB20', type: 'Auto' },
      { name: 'Creta', type: 'Camioneta' },
      { name: 'Tucson', type: 'Camioneta' },
    ],
    Jeep: [
      { name: 'Renegade', type: 'Camioneta' },
      { name: 'Compass', type: 'Camioneta' },
    ],
  };

  const vehicleTypes = await prisma.vehicleType.findMany();
  const typeMap = Object.fromEntries(vehicleTypes.map((t) => [t.name, t.id]));

  const brands = await prisma.vehicleBrand.findMany();
  const modelsData = brands.flatMap((brand) => {
    const models = modelsByBrand[brand.name] || [];
    return models.map((model) => ({
      name: model.name,
      vehicleBrandId: brand.id,
      vehicleTypeId: typeMap[model.type] || typeMap['Auto'],
    }));
  });
  if (modelsData.length) {
    await prisma.vehicleModel.createMany({
      data: modelsData,
      skipDuplicates: true,
    });
  }
}

const SEED_LIST_COMMAND = 'list';
const SEED_COMMANDS: Record<string, () => Promise<void>> = {
  users: seedUsers,
  sectors: seedSectors,
  vehicleTypes: seedVehicleTypes,
  vehicleBrands: seedVehicleBrands,
  vehicleModels: seedVehicleModels,
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

void main();
