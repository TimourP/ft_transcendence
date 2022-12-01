import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { BlockedModule } from './user/blocked/blocked.module'

@Module({
  imports: [UserModule, GameModule, BlockedModule]
})
export class ApiModule {}
