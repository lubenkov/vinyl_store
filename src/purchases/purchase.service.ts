import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Purchase } from '../models/purchase.model';
import { Vinyl } from '../models/vinyl.model';
import { StripeService } from './stripe.service';
import { EmailService } from './email.service';
import { UsersService } from '../users/user.service';
import { LogService } from '../logs/log.service';
import { logger } from '../common/utils/logger';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel(Purchase)
        private purchaseModel: typeof Purchase,
        @InjectModel(Vinyl)
        private vinylModel: typeof Vinyl,
        private stripeService: StripeService,
        private emailService: EmailService,
        private userService: UsersService,
        private logService: LogService
    ) {}

    async createPurchase(
        userId: number,
        vinylId: number,
        currency: string
    ): Promise<Purchase> {
        const vinyl = await this.vinylModel.findByPk(vinylId);

        if (!vinyl) {
            throw new NotFoundException('Vinyl not found');
        }

        const amount = Number(vinyl.price);

        const user = await this.userService.getProfile(userId.toString());
        const paymentIntent = await this.stripeService.createPaymentIntent(
            Math.round(amount * 100),
            currency
        );

        const purchase = await this.purchaseModel.create({
            userId,
            vinylId,
            amount,
            status: paymentIntent.status,
        });

        try {
            await this.emailService.sendPaymentConfirmation(user.email, amount);
        } catch (error) {
            logger.error(
                `Error sending payment confirmation for purchase ${purchase.id}: ${error}`
            );
        }

        const purchaseData = JSON.stringify(purchase.dataValues);
        await this.logService.createLog(`Create purchase: ${purchaseData}`);

        return purchase;
    }
}
