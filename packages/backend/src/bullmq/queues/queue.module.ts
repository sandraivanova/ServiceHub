import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WelcomeEmail } from './welcome.email.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email-queue',
        }),
    ],
    providers: [WelcomeEmail],
    exports: [BullModule],
})
export class QueueModule {}