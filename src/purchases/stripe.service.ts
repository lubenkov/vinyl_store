import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigServiceImpl } from '../config/config.service';

@Injectable()
export class StripeService {
    private readonly demoMode: boolean;
    private readonly stripe: Stripe | null;

    constructor(configService: ConfigServiceImpl) {
        this.demoMode = configService.stripeDemoMode;
        this.stripe = this.demoMode
            ? null
            : new Stripe(configService.stripeSecretKey);
    }

    async createPaymentIntent(
        amount: number,
        currency: string
    ): Promise<{ status: string }> {
        if (this.demoMode || !this.stripe) {
            // A dummy key keeps the purchase flow demonstrable without Stripe.
            return { status: 'demo' };
        }

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
            });

            return { status: paymentIntent.status };
        } catch {
            throw new InternalServerErrorException(
                'Error creating payment intent'
            );
        }
    }
}
