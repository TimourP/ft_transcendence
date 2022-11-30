import { ClassSerializerInterceptor, Controller, Req, UseGuards, UseInterceptors, Get, Put, Delete, Body, Inject, Post } from '@nestjs/common';
import { Friendship } from './friendship.entity';
import { DeleteFriendDto, RequestFriendDto, ResponseFriendDto } from './friendship.dto';
import { JwtAuthGuard } from '..//auth/auth.guard';
import { FriendshipService } from './friendship.service';
import { Request } from 'express';


@Controller('friendship')
export class FriendshipController {
	@Inject(FriendshipService)
	private readonly service: FriendshipService;

	@Post('request')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	private requestFriend(@Body() body: RequestFriendDto, @Req() req: Request): Promise<Friendship | never>{
		return this.service.requestFriend(body, req);
	}

	@Put('response')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	private responseFriend(@Body() body: ResponseFriendDto, @Req() req: Request): Promise<Friendship>{
		return this.service.responseFriend(body, req);
	}

	@Delete('delete')
	@UseGuards(JwtAuthGuard)
	private deleteFriend(@Body() body: DeleteFriendDto, @Req() req: Request): Promise<number>{
		return this.service.deleteFriend(body, req);
	}

}