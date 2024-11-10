import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigServiceImpl } from '../config/config.service';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigServiceImpl) {
        this.transporter = nodemailer.createTransport({
            service: this.configService.emailService,
            auth: {
                user: this.configService.emailUser,
                pass: this.configService.emailPass,
            },
        });
    }

    async sendPaymentConfirmation(
        email: string,
        amount: number
    ): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: this.configService.emailUser,
                to: email,
                subject: 'Payment Confirmation',
                text: `Thank you for your purchase! The amount of $${amount / 100} has been successfully charged.`,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error sending email');
        }
    }
}
