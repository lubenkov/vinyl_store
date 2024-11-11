import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@ApiTags('purchases')
@Controller('purchases')
@UseGuards(AuthGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    async createPurchase(
        @Req() req: any,
        @Body()
        createPurchaseDto: CreatePurchaseDto
    ) {
        const userId = req.user.userId;
        const { vinylId, amount, currency } = createPurchaseDto;
        return await this.purchaseService.createPurchase(
            userId,
            vinylId,
            amount,
            currency
        );
    }
}
