import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './enum/profile.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, name: string, profile: Profile, dateNaissance: string) {
    const user = this.repo.create({ email: email, password: password, name: name, profile: profile, dateNaissance: dateNaissance });
    return this.repo.save(user);
  }

  async findById(id: number) {
    if (!id) {
      return null;
    }
    return await this.repo.findOne({ where: { id: id } });
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email: email } });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);
    if (user === null) {
      throw new Error('user not found');
    }
    
    if (attrs.email !== undefined) user.email = attrs.email;
    if (attrs.password !== undefined) user.password = attrs.password;
    if (attrs.name !== undefined) user.name = attrs.name;
    if (attrs.profile !== undefined) user.profile = attrs.profile;
    if (attrs.dateNaissance !== undefined) user.dateNaissance = attrs.dateNaissance;

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (user === null) {
      throw new Error('user not found');
    }
    return this.repo.remove(user);
  }
}