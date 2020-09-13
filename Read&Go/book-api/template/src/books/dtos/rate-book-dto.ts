import { IsNumber, Min, Max} from 'class-validator'

export class RateBookDTO{

@IsNumber()
@Min(0.5)
@Max(5)
rating: number
}