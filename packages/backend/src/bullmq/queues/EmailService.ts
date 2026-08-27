import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
    constructor(
        @InjectQueue('welcome-queue') private readonly welcomeQueue: Queue,
        @InjectQueue('confirmation-queue') private readonly confirmationQueue: Queue,
    ) {}

    async sendWelcomeEmail(email: string, name: string) {
        await this.welcomeQueue.add('send-welcome-email', {
            to: email,
            subject: 'Добредојдовте на нашата платформа!',
            template: 'confirmation',
            context: { name},
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
    }

    async sendConfirmationEmail(email: string, name: string, token: string) {
        const confirmationUrl = `http://localhost:3000/api/auth/confirm?token=${token}`;
        await this.confirmationQueue.add('send-confirmation-email', {
            to: email,
            subject: 'Потврдете ја вашата е-пошта',
            template: 'confirmation',
            context: { name, confirmationUrl },
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
    }

}