// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';
import { getLogger } from './logging';

class CustomPrismaClient extends PrismaClient<PrismaClientOptions, 'query'> {}

const logger = getLogger('PrismaClient');
let prisma: CustomPrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  prisma = global.prisma;

  prisma.$on('query', (e) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Params: ' + e.params);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

export default prisma;
