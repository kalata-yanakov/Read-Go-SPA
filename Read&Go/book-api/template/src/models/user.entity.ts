import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Books } from "./books.entity";
import { Vote } from "./vote.entity";
import { Reviews } from "./review.entity";
import { UserRole } from "src/users/enums/user-role.enum";
import { Rate } from "./rate.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 30,unique: true,  })
    username: string;

    @Column()
    password: string;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Books, books => books.users)
    books: Books[];

    @OneToMany(() => Vote, votes => votes.voter)
    votes: Vote[];


     @OneToMany(() => Rate, rating => rating.rater)
     rating: Rate;
    
    @OneToMany(()=> Reviews, reviews => reviews.users)
    reviews: Reviews[];


    @Column({ nullable: true, })
    banEndDate: Date;

    @Column({type: 'enum', enum: UserRole, default: UserRole.Basic, })
    role: UserRole;

}