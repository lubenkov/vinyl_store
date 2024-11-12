import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscogsService } from '../discogs/discogs.service';
import { DiscogsController } from '../discogs/discogs.controller';
import { VinylModule } from '../vinyls/vinyl.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vinyl } from '../models/vinyl.model';
import { ConfigServiceImpl } from '../config/config.service';
import { JwtAuthModule } from '../jwt.module';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [
        HttpModule,
        VinylModule,
        SequelizeModule.forFeature([Vinyl]),
        JwtAuthModule,
        UsersModule,
    ],
    providers: [DiscogsService, ConfigServiceImpl],
    controllers: [DiscogsController],
})
export class DiscogsModule {}
