import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsService } from '../../src/discogs/discogs.service';
import { HttpService } from '@nestjs/axios';
import { VinylService } from '../../src/vinyls/vinyl.service';
import { of } from 'rxjs';
import { ConfigServiceImpl } from '../../src/config/config.service';
import { CreateVinylDto } from '../../src/vinyls/dto/create-vinyl.dto';

describe('DiscogsService', () => {
    let service: DiscogsService;
    let httpService: HttpService;
    let vinylService: VinylService;
    let configService: ConfigServiceImpl;

    beforeEach(async () => {
        const httpServiceMock = {
            get: jest.fn().mockReturnValue(of({ data: 'mockResponse' })),
        };

        const vinylServiceMock = {
            create: jest.fn(),
        };

        const configServiceMock = {
            discogsKey: 'mockKey',
            discogsSecret: 'mockSecret',
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DiscogsService,
                { provide: HttpService, useValue: httpServiceMock },
                { provide: VinylService, useValue: vinylServiceMock },
                { provide: ConfigServiceImpl, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<DiscogsService>(DiscogsService);
        httpService = module.get<HttpService>(HttpService);
        vinylService = module.get<VinylService>(VinylService);
        configService = module.get<ConfigServiceImpl>(ConfigServiceImpl);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getVinylRecords', () => {
        it('should return vinyl records from Discogs', async () => {
            const result = await service.getVinylRecords();

            expect(httpService.get).toHaveBeenCalledWith(
                `https://api.discogs.com/database/search?type=release&key=mockKey&secret=mockSecret`
            );
            expect(result).toEqual('mockResponse');
        });
    });

    describe('fetchAndSaveVinylRecord', () => {
        it('should fetch and save a vinyl record', async () => {
            const fetchedVinyl: CreateVinylDto = {
                name: 'Test Vinyl',
                author: 'Test Artist',
                description: 'Test description',
                price: 20,
                image: 'http://test.image',
            };
            jest.spyOn(service, 'getVinylRecordById').mockResolvedValue(
                fetchedVinyl
            );

            const result = await service.fetchAndSaveVinylRecord(1);

            expect(service.getVinylRecordById).toHaveBeenCalledWith(1);
            expect(vinylService.create).toHaveBeenCalledWith(fetchedVinyl);
        });
    });
});
