import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Books } from "./books.entity";
import { Vote } from "./vote.entity";
import { User } from "./user.entity";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ default: false })
    isDeleted: boolean;
    
    @ManyToOne(() => Books, books => books.reviews)
    books: Books;

    @ManyToOne(() => User, user => user.reviews)
    users: User;

    @OneToMany(() => Vote, 
    vote => vote.reviews)
    votes: Vote[];
}