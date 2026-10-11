import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { PurchaseService } from '../../src/purchases/purchase.service';
import { Purchase } from '../../src/models/purchase.model';
import { Vinyl } from '../../src/models/vinyl.model';
import { StripeService } from '../../src/purchases/stripe.service';
import { EmailService } from '../../src/purchases/email.service';
import { UsersService } from '../../src/users/user.service';
import { LogService } from '../../src/logs/log.service';

describe('PurchaseService', () => {
    let service: PurchaseService;
    let purchaseModel: any;
    let vinylModel: any;
    let stripeService: any;
    let emailService: any;
    let userService: any;
    let logService: any;

    const userId = 1;
    const vinylId = 1;
    const currency = 'usd';
    const vinylPrice = 100;

    beforeEach(async () => {
        purchaseModel = {
            create: jest.fn(),
        };

        vinylModel = {
            findByPk: jest.fn(),
        };

        stripeService = {
            createPaymentIntent: jest.fn(),
        };

        emailService = {
            sendPaymentConfirmation: jest.fn(),
        };

        userService = {
            getProfile: jest.fn(),
        };

        logService = {
            createLog: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PurchaseService,
                {
                    provide: getModelToken(Purchase),
                    useValue: purchaseModel,
                },
                {
                    provide: getModelToken(Vinyl),
                    useValue: vinylModel,
                },
                {
                    provide: StripeService,
                    useValue: stripeService,
                },
                {
                    provide: EmailService,
                    useValue: emailService,
                },
                {
                    provide: UsersService,
                    useValue: userService,
                },
                {
                    provide: LogService,
                    useValue: logService,
                },
            ],
        }).compile();

        service = module.get<PurchaseService>(PurchaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createPurchase', () => {
        it('should take the price from the database, charge Stripe, send email and log the action', async () => {
            const user = { id: userId, email: 'test@gmail.com' };
            userService.getProfile.mockResolvedValue(user);

            vinylModel.findByPk.mockResolvedValue({
                id: vinylId,
                price: vinylPrice,
            });

            const paymentIntent = { status: 'succeeded' };
            stripeService.createPaymentIntent.mockResolvedValue(paymentIntent);

            const createdPurchase = {
                id: 1,
                userId,
                vinylId,
                amount: vinylPrice,
                status: paymentIntent.status,
                dataValues: {
                    id: 1,
                    userId,
                    vinylId,
                    amount: vinylPrice,
                    status: paymentIntent.status,
                },
            };
            purchaseModel.create.mockResolvedValue(createdPurchase);

            const result = await service.createPurchase(
                userId,
                vinylId,
                currency
            );

            expect(result).toEqual(createdPurchase);
            expect(vinylModel.findByPk).toHaveBeenCalledWith(vinylId);
            expect(userService.getProfile).toHaveBeenCalledWith(
                userId.toString()
            );
            expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
                Math.round(vinylPrice * 100),
                currency
            );
            expect(purchaseModel.create).toHaveBeenCalledWith({
                userId,
                vinylId,
                amount: vinylPrice,
                status: paymentIntent.status,
            });
            expect(emailService.sendPaymentConfirmation).toHaveBeenCalledWith(
                user.email,
                vinylPrice
            );
            expect(logService.createLog).toHaveBeenCalledWith(
                `Create purchase: ${JSON.stringify(createdPurchase.dataValues)}`
            );
        });

        it('should throw NotFoundException if the vinyl does not exist', async () => {
            vinylModel.findByPk.mockResolvedValue(null);

            await expect(
                service.createPurchase(userId, vinylId, currency)
            ).rejects.toThrow(NotFoundException);

            expect(stripeService.createPaymentIntent).not.toHaveBeenCalled();
            expect(purchaseModel.create).not.toHaveBeenCalled();
        });

        it('should still create the purchase if sending the email fails', async () => {
            userService.getProfile.mockResolvedValue({
                id: userId,
                email: 'test@gmail.com',
            });
            vinylModel.findByPk.mockResolvedValue({
                id: vinylId,
                price: vinylPrice,
            });
            stripeService.createPaymentIntent.mockResolvedValue({
                status: 'succeeded',
            });
            emailService.sendPaymentConfirmation.mockRejectedValue(
                new Error('SMTP is down')
            );

            const createdPurchase = {
                id: 1,
                dataValues: { id: 1 },
            };
            purchaseModel.create.mockResolvedValue(createdPurchase);

            const result = await service.createPurchase(
                userId,
                vinylId,
                currency
            );

            expect(result).toEqual(createdPurchase);
            expect(emailService.sendPaymentConfirmation).toHaveBeenCalled();
            expect(logService.createLog).toHaveBeenCalledWith(
                `Create purchase: ${JSON.stringify(createdPurchase.dataValues)}`
            );
        });
    });
});
