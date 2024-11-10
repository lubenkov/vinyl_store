import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigServiceImpl } from '../config/config.service';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigServiceImpl) {
        this.stripe = new Stripe(this.configService.stripeSecretKey, {
            apiVersion: '2024-10-28.acacia',
        });
    }

    async createPaymentIntent(
        amount: number,
        currency: string
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
            });

            return paymentIntent;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error creating payment intent'
            );
        }
    }
}
