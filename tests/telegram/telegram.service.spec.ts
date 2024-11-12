import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { TelegramService } from '../../src/telegram/telegram.service';
import { ConfigServiceImpl } from '../../src/config/config.service';

describe('TelegramService', () => {
    let service: TelegramService;
    let httpService: HttpService;
    let configService: ConfigServiceImpl;

    beforeEach(async () => {
        const httpServiceMock = {
            post: jest.fn().mockReturnValue(of({ data: 'mockResponse' })),
        };

        const configServiceMock = {
            telegramBotToken: 'mockBotToken',
            telegramChatId: 'mockChatId',
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TelegramService,
                { provide: HttpService, useValue: httpServiceMock },
                { provide: ConfigServiceImpl, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<TelegramService>(TelegramService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigServiceImpl>(ConfigServiceImpl);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendVinylRecord', () => {
        it('should send a vinyl record message to Telegram', async () => {
            const record = {
                name: 'Test Vinyl',
                link: 'http://example.com',
                price: 100,
            };
            const result = await service.sendVinylRecord(record);

            expect(httpService.post).toHaveBeenCalledWith(
                `https://api.telegram.org/bot${configService.telegramBotToken}/sendMessage`,
                {
                    chat_id: configService.telegramChatId,
                    text: `Название: Test Vinyl\nСсылка: http://example.com\nЦена: 100`,
                }
            );
            expect(result).toEqual('mockResponse');
        });
    });
});
