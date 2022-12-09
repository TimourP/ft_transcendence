import { Injectable, HttpException, HttpStatus, Catch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, QueryResult, QueryBuilder, InsertResult, Brackets } from 'typeorm';
import { Friendship, FriendshipStatus } from './friendship.entity';
import { User } from '../user.entity';
import { RequestFriendDto, ResponseFriendDto, DeleteFriendDto } from './friendship.dto';
import { Request } from 'express';

@Injectable()
export class FriendshipService {
	@InjectRepository(User)
	private readonly userRepository: Repository<User>;

	@InjectRepository(Friendship)
	private readonly friendshipRepository: Repository<Friendship>

	public async requestFriend(body: RequestFriendDto, req: Request): Promise<Friendship | never> {
		const user: User = <User>req.user;
		const { id }: RequestFriendDto = body;

		//if really want to get friend and friendship, maybe use a join to get both in only one query
		let friend: User = await this.userRepository.createQueryBuilder()
			.select()
			.where("id = :friendId", {friendId: id})
			.getOne();
		//if friendship already exists just return an empty JSON using an orIgnore() method, no need for query
		let friendship: Friendship = await this.friendshipRepository.createQueryBuilder()
			.select()
			.where("applicant_id = :userId", {userId: user.id})
			.andWhere("solicited_id = :friendId", {friendId: id})
			.getOne();
		if (!friend) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND)
		}
		else if (user.id == id || friendship) {
			throw new HttpException("Conflict", HttpStatus.CONFLICT);
		
		}
		return (await this.friendshipRepository.createQueryBuilder()
			.insert()
			.values({applicant: user, solicited: friend})
			//add the orIgnore here
			.execute()).generatedMaps[0] as Friendship;
		
	}

	public async responseFriend(body: ResponseFriendDto, req: Request): Promise<Friendship> {
		const { didAccept, applicant }: ResponseFriendDto = body;
		const user: User = <User>req.user;

		let friendship: Friendship = await this.friendshipRepository.createQueryBuilder()
			.select()
			.where("applicant_id = :friendId", {friendId: applicant})
			.andWhere("solicited_id = :userId", {userId: user.id})
			.getOne();
		if (!friendship) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND)
		}
		else if (friendship.status != FriendshipStatus.pending) {
			throw new HttpException('Conflict', HttpStatus.CONFLICT)
		}
		//probably can be done without the select at first, will return empty JSON if nothing is updated
		return (await this.friendshipRepository.createQueryBuilder()
			.update()
			.set( { status: didAccept ? FriendshipStatus.accepted : FriendshipStatus.rejected } )
			.where( "solicited_id = :userId", {userId: user.id} )
			.andWhere( "applicant_id = :friendId", {friendId: applicant})
			.execute()).generatedMaps[0] as Friendship;
	}

	// SELECT * FROM User WHERE Id IN CONCAT( ( SELECT applicant FROM Friendship WHERE solicited = user.id), ( SELECT solicited FROM Friendship WHERE applicant = user.id) )
	public async friends(user: User): Promise< User[] | never > {
		//must be done using querybuilder and probably inner joins
		return (await this.userRepository.find ({
			where: {
				id: In(
					(await this.friendshipRepository.find({
						select: ["applicant"],
						where: {
							"solicited_id": user.id,
							"status": FriendshipStatus.accepted,
						}
					})).map(Friendship => Friendship.applicant)
					
					.concat(
					(await this.friendshipRepository.find({
						select: ["solicited"],
						where: {
							"applicant_id": user.id,
							"status": FriendshipStatus.accepted,
						}
					})).map(Friendship => Friendship.solicited))
				),
			}
		}));
	}

	public async deleteFriend(body: DeleteFriendDto, req: Request): Promise<number> {
		const { friend } : DeleteFriendDto = body;
		const user: User = <User>req.user;

		return (await this.friendshipRepository.createQueryBuilder()
			.delete()
			.where( new Brackets (query => { query
				.where("applicant_id = :applicantFriendId", {applicantFriendId: friend})
				.andWhere("solicited_id = :solicitedUserId", {solicitedUserId: user.id})
			}))
			.orWhere( new Brackets (query => { query
				.where("solicited_id = :solicitedFriendId", {solicitedFriendId: friend})
				.andWhere("applicant_id = :applicantUserId", {applicantUserId: user.id})
			}))
			.execute()).affected;
	}
}