import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Review } from './review.model';
import { Purchase } from './purchase.model';

@Table({ timestamps: false })
export class User extends Model {
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
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'user',
    })
    role: string;

    @Column({
        type: DataType.DATE,
    })
    birthdate: Date;

    @Column({
        type: DataType.STRING,
    })
    avatar: string;

    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => Purchase)
    purchases: Purchase[];
}
