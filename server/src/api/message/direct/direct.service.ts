import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DirectDto } from "./direct.dto";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/api/user/user.entity";
import { Repository } from "typeorm";
import { Direct } from "./direct.entity";

@Injectable({})
export class DirectService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Direct) private directRepository: Repository<Direct>
	) {}

	public async create(body: DirectDto, req: Request): Promise<Direct> {
		const user1: User = <User>req.user;
		
		//vérifier que le userid existe
			//Not found()
		const user2: User = await this.userRepository.findOne({where: {id: body.user2}})
		if (!user2)
		{
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		//vérifier que la relation n'existe pas
			//Conflict
		let direct: Direct = await this.directRepository.findOne({where: [
			{ user1: user1.id, user2: user2.id},
			{ user1: user2.id, user2: user1.id},
		]})
		if (direct)
		{
			throw new HttpException('Conflict', HttpStatus.CONFLICT);
		}

		direct = new Direct();
		direct.user1 = user1.id;
		direct.user2 = user2.id;
		return this.directRepository.save(direct); // retourné le direct créé
		
	}

	public async getAllDirect( user: User): Promise<Direct[]> {

		const listdirect: Direct[] = await this.directRepository.find(
			{
				where:[
					{user1: user.id},
					{user2: user.id}
				]
			}
		)
		return listdirect;
	}
}