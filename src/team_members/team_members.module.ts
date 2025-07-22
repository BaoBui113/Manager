import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team_member.entity';
import { TeamMembersController } from './team_members.controller';
import { TeamMembersService } from './team_members.service';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
  imports: [TypeOrmModule.forFeature([TeamMember])],
})
export class TeamMembersModule {}
