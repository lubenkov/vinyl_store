import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
    @Get()
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
    @ApiOperation({ summary: 'Check service health' })
    check() {
        return {
            name: process.env.npm_package_name ?? 'vinyl-store',
            version: process.env.npm_package_version ?? '1.0.0',
        };
    }
}
