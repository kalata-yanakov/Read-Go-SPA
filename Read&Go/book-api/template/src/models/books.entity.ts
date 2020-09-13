import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import { Reviews } from './review.entity';
import { User } from './user.entity';
import { Rate } from './rate.entity';
@Entity()
export class Books{
@PrimaryGeneratedColumn()
id: number;

@Column()
title: string;

@Column()
content: string;

@Column({ default: false })
isBorrowed: boolean;

// @Column({ default: false })
// isUnlisted: boolean;
@Column({ default: false})
isDeleted: boolean;
@Column({ default: true })
isFree: boolean;

@OneToMany(
    () => Reviews,
    review => review.books
)
reviews: Reviews[];

@OneToMany(
    () => Rate,
    rating => rating.books
)
rating: Rate[];

@ManyToOne(() => User, user => user.books)
users: User;

}