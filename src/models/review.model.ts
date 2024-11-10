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
export class Review extends Model {
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
    content: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    score: number;

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
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    createdAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Vinyl)
    vinyl: Vinyl;
}
