import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';

export function getLogger(name: string): Logger {
  const stream = pretty({
    colorize: true,
  });

  return pino({ name, level: 'info' }, stream);
}
