import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {mailTransporter} from '../../config/email';

@Processor('password-reset-queue')
export class PasswordResetEmail extends WorkerHost {

    private transporter = mailTransporter;

    async process(job: Job<any, any, string>): Promise<any> {
        console.log(
            `[Worker] Starting job ID: ${job.id}, Name: ${job.name}`,
        );

        if (job.name === 'send-password-reset-email') {
            await this.sendEmail(job.data);
        } else {
            console.warn(
                `[Worker] Unknown job type: ${job.name}`,
            );
        }

        console.log(
            `[Worker] Finished job ID: ${job.id}`,
        );

        return {
            status: 'completed',
        };
    }

    private async sendEmail(data: {
        to: string;
        subject: string;
        template: string;
        context: {
            name: string;
            resetUrl: string;
        };
    }) {
        try {
            console.log(
                `[Email Service] Sending password reset email to: ${data.to}...`,
            );

            const info = await this.transporter.sendMail({
                from: `"Dnevnica MK" <${process.env.NODEMAILER_AUTH_USER}>`,
                to: data.to,
                subject: data.subject,
                template: data.template,
                context: data.context,
            } as any);

            console.log(
                `[Email Service] Password reset email sent successfully: ${info.messageId}`,
            );
        } catch (error) {
            console.error(
                `[Email Service] Failed to send password reset email:`,
                error,
            );

            throw error;
        }
    }
}