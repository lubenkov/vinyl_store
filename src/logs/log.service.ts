import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from '../models/log.model';

@Injectable()
export class LogService {
    constructor(
        @InjectModel(Log)
        private logModel: typeof Log
    ) {}

    async createLog(action: string): Promise<Log> {
        return await this.logModel.create({ action });
    }

    async getLogs(): Promise<Log[]> {
        return await this.logModel.findAll();
    }
}
