import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from '../../src/purchases/purchase.service';
import { getModelToken } from '@nestjs/sequelize';
import { Purchase } from '../../src/models/purchase.model';
import { StripeService } from '../../src/purchases/stripe.service';
import { EmailService } from '../../src/purchases/email.service';
import { UsersService } from '../../src/users/user.service';
import { LogService } from '../../src/logs/log.service';

describe('PurchaseService', () => {
    let service: PurchaseService;
    let purchaseModel: any;
    let stripeService: any;
    let emailService: any;
    let userService: any;
    let logService: any;

    beforeEach(async () => {
        purchaseModel = {
            create: jest.fn(),
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
        it('should create a purchase, send email and log the action', async () => {
            const userId = 1;
            const vinylId = 1;
            const amount = 100;
            const currency = 'usd';

            const user = { id: userId, email: 'test@gmail.com' };
            userService.getProfile.mockResolvedValue(user);

            const paymentIntent = { status: 'succeeded' };
            stripeService.createPaymentIntent.mockResolvedValue(paymentIntent);

            const createdPurchase = {
                id: 1,
                userId,
                vinylId,
                amount,
                status: paymentIntent.status,
                dataValues: {
                    id: 1,
                    userId,
                    vinylId,
                    amount,
                    status: paymentIntent.status,
                },
            };
            purchaseModel.create.mockResolvedValue(createdPurchase);

            const result = await service.createPurchase(
                userId,
                vinylId,
                amount,
                currency
            );

            expect(result).toEqual(createdPurchase);
            expect(userService.getProfile).toHaveBeenCalledWith(
                userId.toString()
            );
            expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
                amount * 100,
                currency
            );
            expect(purchaseModel.create).toHaveBeenCalledWith({
                userId,
                vinylId,
                amount,
                status: paymentIntent.status,
            });
            expect(emailService.sendPaymentConfirmation).toHaveBeenCalledWith(
                user.email,
                amount
            );
            expect(logService.createLog).toHaveBeenCalledWith(
                `Create purchase: ${JSON.stringify(createdPurchase.dataValues)}`
            );
        });
    });
});
