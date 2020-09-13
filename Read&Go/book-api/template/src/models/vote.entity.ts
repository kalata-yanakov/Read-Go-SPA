import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Reviews } from "./review.entity";
import { User } from "./user.entity";
import { Reaction } from "src/users/enums/reaction.enum";

@Entity('votes')
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Reviews,
        review => review.votes
    )
    reviews: Reviews;

    @ManyToOne(() => User,
    user => user.votes)
    voter: User;
    
    @Column({type: 'enum', enum: Reaction})
    reaction: Reaction;
}