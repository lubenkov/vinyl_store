import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { VinylService } from '../vinyls/vinyl.service';
import { CreateVinylDto } from '../vinyls/dto/create-vinyl.dto';
import { Vinyl } from '../models/vinyl.model';
import { ConfigServiceImpl } from '../config/config.service';

@Injectable()
export class DiscogsService {
    private readonly BASE_URL = 'https://api.discogs.com';
    private readonly KEY = this.configService.discogsKey;
    private readonly SECRET = this.configService.discogsSecret;

    constructor(
        private httpService: HttpService,
        private vinylService: VinylService,
        private configService: ConfigServiceImpl
    ) {}

    async getVinylRecords(): Promise<any> {
        const url = `${this.BASE_URL}/database/search?type=release&key=${this.KEY}&secret=${this.SECRET}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getVinylRecordById(id: number): Promise<CreateVinylDto> {
        const url = `${this.BASE_URL}/releases/${id}?key=${this.KEY}&secret=${this.SECRET}`;
        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const data = response.data;
            const vinylRecord = {
                name: data.title,
                author: data.artists
                    .map((artist: any) => artist.name)
                    .join(', '),
                description: data.notes || 'No description available',
                price: data.lowest_price || 0,
                image:
                    data.images && data.images.length > 0
                        ? data.images[0].uri
                        : 'No image available',
            };

            return vinylRecord;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                throw new NotFoundException(`Vinyl with ID ${id} not found`);
            } else {
                throw new Error(
                    `Error fetching data for Vinyl ${id}: ${error.message}`
                );
            }
        }
    }

    async getVinylRecordByIdWithScores(id: number): Promise<CreateVinylDto> {
        const url = `${this.BASE_URL}/releases/${id}?key=${this.KEY}&secret=${this.SECRET}`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const data = response.data;
            const vinylRecord = {
                name: data.title,
                author: data.artists
                    .map((artist: any) => artist.name)
                    .join(', '),
                description: data.notes || 'No description available',
                price: data.lowest_price || 0,
                image:
                    data.images && data.images.length > 0
                        ? data.images[0].uri
                        : 'No image available',
                score:
                    data.community && data.community.rating
                        ? data.community.rating.average
                        : 'No rating available',
            };

            return vinylRecord;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                throw new NotFoundException(`Vinyl with ID ${id} not found`);
            } else {
                throw new Error(
                    `Error fetching data for Vinyl ${id}: ${error.message}`
                );
            }
        }
    }

    async fetchAndSaveVinylRecord(id: number): Promise<Vinyl> {
        const fetchedVinyl = await this.getVinylRecordById(id);
        const vinyl = this.vinylService.create(fetchedVinyl);
        return vinyl;
    }
}
