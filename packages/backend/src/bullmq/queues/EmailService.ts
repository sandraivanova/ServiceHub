import {Injectable} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bullmq';
import {Queue} from 'bullmq';

@Injectable()
export class EmailService {
    constructor(
        @InjectQueue('welcome-queue') private readonly welcomeQueue: Queue,
        @InjectQueue('confirmation-queue') private readonly confirmationQueue: Queue,
        @InjectQueue('password-reset-queue') private readonly passwordResetQueue: Queue,
    ) {
    }

    async sendWelcomeEmail(email: string, name: string) {
        await this.welcomeQueue.add(
            'send-welcome-email',
            {
                to: email,
                subject: 'Добредојдовте на нашата платформа!',
                template: 'welcome',
                context: {name},
            },
            {
                attempts: 3,
                backoff: {type: 'exponential', delay: 2000},
                removeOnComplete: true,
            }
        );
    }

    async sendConfirmationEmail(email: string, name: string, token: string) {
        const confirmationUrl = `http://localhost:3000/api/auth/confirm?token=${token}`;
        await this.confirmationQueue.add(
            'send-confirmation-email',
            {
                to: email,
                subject: 'Потврдете ја вашата е-пошта',
                template: 'confirmation',
                context: {name, confirmationUrl},
            },
            {
                attempts: 3,
                backoff: {type: 'exponential', delay: 2000},
                removeOnComplete: true,
            }
        );
    }

    async sendPasswordResetEmail(email: string, name: string, token: string) {
        const resetUrl = `http://localhost:4200/reset-password?token=${token}`;
        await this.passwordResetQueue.add(
            'send-password-reset-email',
            {
                to: email,
                subject: 'Ресетирање на лозинка',
                template: 'password-reset',
                context: {name, resetUrl}
            },
            {
                attempts: 3,
                backoff: {type: 'exponential', delay: 2000},
                removeOnComplete: true
            }
        );
    }

}