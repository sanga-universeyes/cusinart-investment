import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@cuiz.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@cuiz.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      permissions: ['*']
    }
  });

  // Create investment plans
  const plans = await Promise.all([
    prisma.investmentPlan.upsert({
      where: { name: 'CUIZ 1' },
      update: {},
      create: {
        name: 'CUIZ 1',
        description: 'Plan d\'investissement de base avec rendement quotidien garanti',
        minAmount: 10000,
        maxAmount: 50000,
        dailyReturn: 0.5,
        duration: 30,
        totalReturn: 15,
        features: ['Rendement quotidien garanti', 'Support 24/7', 'Retrait flexible'],
        isPopular: true,
        status: 'ACTIVE'
      }
    }),
    prisma.investmentPlan.upsert({
      where: { name: 'CUIZ 2' },
      update: {},
      create: {
        name: 'CUIZ 2',
        description: 'Plan d\'investissement intermédiaire avec rendement élevé',
        minAmount: 50000,
        maxAmount: 200000,
        dailyReturn: 0.8,
        duration: 60,
        totalReturn: 48,
        features: ['Rendement élevé', 'Support prioritaire', 'Bonus de parrainage'],
        isRecommended: true,
        status: 'ACTIVE'
      }
    }),
    prisma.investmentPlan.upsert({
      where: { name: 'CUIZ 3' },
      update: {},
      create: {
        name: 'CUIZ 3',
        description: 'Plan d\'investissement premium avec rendement maximum',
        minAmount: 200000,
        maxAmount: 1000000,
        dailyReturn: 1.2,
        duration: 90,
        totalReturn: 108,
        features: ['Rendement maximum', 'Support VIP', 'Bonus exclusifs'],
        status: 'ACTIVE'
      }
    }),
    prisma.investmentPlan.upsert({
      where: { name: 'CUIZ 4' },
      update: {},
      create: {
        name: 'CUIZ 4',
        description: 'Plan d\'investissement VIP avec rendement exceptionnel',
        minAmount: 1000000,
        maxAmount: 10000000,
        dailyReturn: 2.0,
        duration: 120,
        totalReturn: 240,
        features: ['Rendement exceptionnel', 'Support VIP 24/7', 'Bonus exclusifs'],
        status: 'ACTIVE'
      }
    })
  ]);

  // Create system settings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      currenciesAr: true,
      currenciesUsdt: true,
      arToUsdtRate: 0.0002,
      usdtToArRate: 5000,
      pointsToArInvestor: 100,
      pointsToArNonInvestor: 10,
      minDepositAr: 1000,
      minDepositUsdt: 1,
      minWithdrawalAr: 5000,
      minWithdrawalUsdt: 1,
      withdrawalFee: 0.1,
      depositsValidation: 'MANUAL',
      withdrawalsValidation: 'MANUAL',
      pointsExchangeValidation: 'MANUAL',
      tasksValidation: 'MANUAL',
      emailNotifications: true,
      whatsappNotifications: true,
      inAppNotifications: true
    }
  });

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { title: 'Like notre page Facebook' },
      update: {},
      create: {
        creatorId: admin.id,
        title: 'Like notre page Facebook',
        description: 'Aimez et partagez notre page Facebook pour gagner des points',
        type: 'SOCIAL_MEDIA',
        points: 50,
        requirements: ['Aimer la page Facebook', 'Partager un post'],
        status: 'ACTIVE',
        maxExecutions: 1000
      }
    }),
    prisma.task.upsert({
      where: { title: 'Sondage satisfaction' },
      update: {},
      create: {
        creatorId: admin.id,
        title: 'Sondage satisfaction',
        description: 'Répondez à notre sondage de satisfaction client',
        type: 'SURVEY',
        points: 100,
        requirements: ['Compléter le sondage', 'Fournir un feedback constructif'],
        status: 'ACTIVE',
        maxExecutions: 500
      }
    }),
    prisma.task.upsert({
      where: { title: 'Parrainer un ami' },
      update: {},
      create: {
        creatorId: admin.id,
        title: 'Parrainer un ami',
        description: 'Parrainez un ami et gagnez des points bonus',
        type: 'REFERRAL',
        points: 200,
        requirements: ['Parrainer un nouvel utilisateur', 'L\'utilisateur doit s\'inscrire'],
        status: 'ACTIVE',
        maxExecutions: 100
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin created: ${admin.username}`);
  console.log(`📊 Investment plans created: ${plans.length}`);
  console.log(`⚙️ System settings created`);
  console.log(`📝 Sample tasks created: ${tasks.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });