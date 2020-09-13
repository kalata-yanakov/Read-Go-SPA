import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Books } from "./books.entity";
import { User } from "./user.entity";

@Entity()
export class Rate{
    @PrimaryGeneratedColumn()
    id: number;

  
    @ManyToOne(
        () => Books,
        books => books.rating
    )
    books: Books;

    @ManyToOne(() => User,
    user => user.rating)
    rater: User;

    @Column()
    rating: number
}