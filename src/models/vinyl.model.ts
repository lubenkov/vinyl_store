import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Review } from './review.model';
import { Purchase } from './purchase.model';

@Table({ timestamps: false })
export class Vinyl extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    author: string;

    @Column({
        type: DataType.TEXT,
    })
    description: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.STRING,
    })
    image: string;

    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => Purchase, { onDelete: 'CASCADE' })
    purchases: Purchase[];
}
