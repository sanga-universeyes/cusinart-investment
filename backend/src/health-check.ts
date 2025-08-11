import { prisma } from './index';

async function healthCheck() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test Redis connection (if configured)
    // const redis = new Redis(process.env.REDIS_URL);
    // await redis.ping();
    // redis.disconnect();
    
    console.log('Health check passed');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();