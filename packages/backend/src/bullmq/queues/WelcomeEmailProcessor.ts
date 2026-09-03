import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {mailTransporter} from '../../config/email';

@Processor('welcome-queue')
export class WelcomeEmail extends WorkerHost {

    private transporter = mailTransporter;

    async process(job: Job<any, any, string>): Promise<any> {
        console.log(
            `[Worker] Starting job ID: ${job.id}, Name: ${job.name}`,
        );

        if (job.name === 'send-welcome-email') {
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
        };
    }) {
        try {
            console.log(
                `[Email Service] Sending email to: ${data.to}...`,
            );

            const info = await this.transporter.sendMail({
                from: `"Dnevnica MK" <${process.env.NODEMAILER_AUTH_USER}>`,
                to: data.to,
                subject: data.subject,
                template: data.template,
                context: data.context,
            } as any);

            console.log(
                `[Email Service] Email sent successfully: ${info.messageId}`,
            );
        } catch (error) {
            console.error(
                `[Email Service] Failed to send email:`,
                error,
            );

            throw error;
        }
    }
}