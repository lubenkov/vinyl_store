import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('purchases')
@Controller('purchases')
@UseGuards(AuthGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    async createPurchase(
        @Req() req: any,
        @Body()
        createPurchaseDto: { vinylId: number; amount: number; currency: string }
    ) {
        const userId = req.user.userId;
        const { vinylId, amount, currency } = createPurchaseDto;
        return this.purchaseService.createPurchase(
            userId,
            vinylId,
            amount,
            currency
        );
    }
}
