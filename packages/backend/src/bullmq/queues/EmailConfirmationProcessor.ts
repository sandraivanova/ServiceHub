import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { mailTransporter } from '../../config/email';

@Processor('confirmation-queue')
export class EmailProcessor extends WorkerHost {

    async process(job: Job<any, any, string>): Promise<any> {

        console.log(
            `[EmailWorker] Starting job ${job.id}: ${job.name}`,
        );

        if (job.name === 'send-confirmation-email') {

            const {
                to,
                subject,
                template,
                context,
            } = job.data;

            try {
                console.log(
                    `[EmailWorker] Sending confirmation email to ${to}...`,
                );

                await mailTransporter.sendMail({
                    from: `"Metricity" <${process.env.NODEMAILER_AUTH_USER}>`,
                    to,
                    subject,
                    template,
                    context,
                } as any);

                console.log(
                    `[EmailWorker] Confirmation email successfully sent to ${to}`,
                );

            } catch (error) {

                console.error(
                    `[EmailWorker] Failed to send email to ${to}:`,
                    error,
                );

                throw error;
            }
        }

        return {
            status: 'completed',
        };
    }
}