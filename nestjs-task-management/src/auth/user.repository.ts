import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    // OLD approaching to check duplicate user
    // const exists = this.findOne({ username });

    // if (exists) {
    //   throw new Error("Duplicate user");
    // }

    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch(error) {
      if (error.code === '23505') {
        throw new ConflictException("Username already exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}