import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Vinyl } from './vinyl.model';

@Table({ timestamps: false })
export class Purchase extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    userId: number;

    @ForeignKey(() => Vinyl)
    @Column({
        type: DataType.INTEGER,
    })
    vinylId: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    amount: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    createdAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Vinyl)
    vinyl: Vinyl;
}
