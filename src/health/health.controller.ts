import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import fs from 'fs';

@ApiTags('health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Check service health' })
    check(@Res() res: Response) {
        let packageName = 'unknown';
        let packageVersion = 'unknown';
        try {
            const packageJson = fs.readFileSync('./package.json', 'utf8');
            const packageData = JSON.parse(packageJson);
            packageName = packageData.name || packageName;
            packageVersion = packageData.version || packageVersion;
        } catch (error) {
            console.error('Error reading or parsing package.json:', error);
        }
        const response = {
            name: packageName,
            version: packageVersion,
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Powered-By', 'Node.js');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Date', new Date().toUTCString());
        res.end(JSON.stringify(response, null, 2) + '\n');
    }
}
