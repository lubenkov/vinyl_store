import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'logs', timestamps: false })
export class Log extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    action: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    timestamp: Date;
}
