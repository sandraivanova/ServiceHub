import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailConfirmationService {
    constructor(@InjectQueue('confirmation-queue') private readonly queue: Queue) {}

    async sendConfirmationEmail(email: string, name: string, token: string) {
        const confirmationUrl = `http://localhost:3000/api/auth/confirm?token=${token}`;

        await this.queue.add(
            'send-confirmation-email',
            {
                to: email,
                subject: 'Confirm your email address',
                template: 'confirmation',
                context: {
                    name,
                    confirmationUrl,
                },
            },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: false,
                removeOnFail: false,
            }
        );
    }
}