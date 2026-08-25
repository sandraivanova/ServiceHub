import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Processor('email-queue')
export class WelcomeEmail extends WorkerHost {
    private transporter;

    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE || 'gmail',
            auth: {
                user: process.env.NODEMAILER_AUTH_USER,
                pass: process.env.NODEMAILER_AUTH_PASS,
            },
        });
    }

    async process(job: Job<any, any, string>): Promise<any> {
        console.log(`[Worker] Starting job ID: ${job.id}, Name: ${job.name}`);

        switch (job.name) {
            case 'send-welcome-email':
                await this.sendEmail(job.data);
                break;
            default:
                console.warn(`Unknown job type: ${job.name}`);
        }

        console.log(`[Worker] Finished job ID: ${job.id}`);
        return { status: 'completed' };
    }

    private async sendEmail(data: { email: string; name: string }) {
        try {
            console.log(`[Email Service] Sending email to: ${data.email}...`);

            const info = await this.transporter.sendMail({
                from: `"Metricity" <${process.env.NODEMAILER_AUTH_USER}>`,
                to: data.email,
                subject: 'Welcome to our platform!',
                text: `Hi ${data.name}, welcome! We are glad to have you.`,
                html: `<b>Hi ${data.name}, welcome!</b> <p>We are glad to have you.</p>`,
            });

            console.log(`[Email Service] Email sent successfully: ${info.messageId}`);
        } catch (error) {
            console.error(`[Email Service] Failed to send email:`, error);
            throw error;
        }
    }
}