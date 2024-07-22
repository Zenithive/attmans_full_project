import { Body, Controller, Post } from '@nestjs/common';
import { InterestedUserService } from './interestedUser.service';

@Controller('interested-users')
export class InterestedUserController {
    constructor(private readonly interestedUserService: InterestedUserService) {}

    @Post()
    async create(@Body() createInterestedUserDto: any): Promise<any> {
        return this.interestedUserService.create(createInterestedUserDto);
    }
}
