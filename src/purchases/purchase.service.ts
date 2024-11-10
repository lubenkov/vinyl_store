import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Purchase } from '../models/purchase.model';
import { StripeService } from './stripe.service';
import { EmailService } from './email.service';
import { UsersService } from '../users/user.service';
import { LogService } from '../logs/log.service';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel(Purchase)
        private purchaseModel: typeof Purchase,
        private stripeService: StripeService,
        private emailService: EmailService,
        private userService: UsersService,
        private logService: LogService
    ) {}

    async createPurchase(
        userId: number,
        vinylId: number,
        amount: number,
        currency: string
    ): Promise<Purchase> {
        const user = await this.userService.getProfile(userId.toString());
        const paymentIntent = await this.stripeService.createPaymentIntent(
            amount,
            currency
        );

        const purchase = await this.purchaseModel.create({
            userId,
            vinylId,
            amount,
            status: paymentIntent.status,
        });

        await this.emailService.sendPaymentConfirmation(user.email, amount);

        const purchaseData = JSON.stringify(purchase.dataValues);
        await this.logService.createLog(`Update vinyl: ${purchaseData}`);

        return purchase;
    }
}
