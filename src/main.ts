import qrcode from 'qrcode-terminal';
// import { Message } from 'whatsapp-web.js';
import { Message, Events } from 'whatsapp-web.js';
import client from './configs/whatsapp';
import handleMessage from './handlers/message';
import Logger from './utils/logger.util';

const start = async (): Promise<void> => {
  try {
    // Whatsapp auth
    client.on('qr', (qr: string) => {
      Logger.log('Scan this QR code in whatsapp to log in:');
      qrcode.generate(qr, { small: true });
    });

    // Whatsapp ready
    client.on('ready', () => {
      Logger.log('Client is ready!');
    });

    // // Whatsapp message
    // client.on('message', async (message: Message) => {
    //   console.log(message);
    //   try {
    //     //if (message.from == 'status@broadcast') return;
    //     if (message.fromMe) await handleMessage(message);
    //   } catch (error) {
    //     Logger.error(error);
    //   }
    // });
    // Reply to own message
    client.on(Events.MESSAGE_CREATE, async (message: Message) => {
      // Ignore if message is from status broadcast
      // if (message.from == constants.statusBroadcast) return;

      // Ignore if it's a quoted message, (e.g. Bot reply)
      if (message.hasQuotedMsg) return;

      // Ignore if it's not from me
      if (!message.fromMe) return;

      await handleMessage(message);
    });

    client.initialize();
  } catch (error: unknown) {
    Logger.error(`Failed to initialize the client: ${JSON.stringify(error)}`);
    start();
  }
};

start();
