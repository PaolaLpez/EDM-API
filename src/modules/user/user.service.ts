import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async getUsers(excludeId?: number): Promise<any[]> {
    const whereClause = excludeId ? { id: { not: excludeId } } : {};
    const users = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        lastName: true,        // Prisma usa lastName
        userName: true,        // Prisma usa userName
        created_at: true,
        role_id: true
      }
    });
    
    // Mapear la respuesta para que coincida con tu DTO 
    return users.map(user => ({
      id: user.id,
      name: user.name,
      lastname: user.lastName,  
      username: user.userName,  
      created_at: user.created_at
    }));
  }

  async getUserById(id: number): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        userName: true,
        created_at: true,
        task: true,
      },
    });
    
    if (!user) return null;
    
    // Mapear la respuesta
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastName,
      username: user.userName,
      created_at: user.created_at,
      tasks: user.task
    };
  }

  async getTasksByUserId(id: number): Promise<any[] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { task: true }
    });
    
    if (!user) return null;
    return user.task;
  }

  async insert(user: CreateUserDto): Promise<any> {
    try {
      // Mapear de DTO (snake_case) a Prisma (camelCase)
      const userData = {
        name: user.name,
        lastName: user.lastname,    
        userName: user.username,    
        password: user.password,
        created_at: new Date(),
      };

      const newUser = await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          name: true,
          lastName: true,
          userName: true,
          created_at: true,
          task: true,
        },
      });
      
      // Mapear la respuesta de vuelta a snake_case
      return {
        id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastName,
        username: newUser.userName,
        created_at: newUser.created_at,
        tasks: newUser.task
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
      throw error;
    }
  }

  async update(id: number, userUpdate: UpdateUserDto): Promise<any> {
    try {
      // Mapear los campos que vienen en el DTO
      const updateData: any = {};
      if (userUpdate.name) updateData.name = userUpdate.name;
      if (userUpdate.lastname) updateData.lastName = userUpdate.lastname;
      if (userUpdate.username) updateData.userName = userUpdate.username;
      if (userUpdate.password) updateData.password = userUpdate.password;

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          lastName: true,
          userName: true,
          created_at: true,
          task: true,
        },
      });
      
      // Mapear la respuesta
      return {
        id: user.id,
        name: user.name,
        lastname: user.lastName,
        username: user.userName,
        created_at: user.created_at,
        tasks: user.task
      };
    } catch (error) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Busca por username (snake_case) e incluye password para validación
  async findByUsername(username: string): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: { userName: username },  // Buscar con userName (camelCase)
      select: {
        id: true,
        name: true,
        lastName: true,
        userName: true,
        password: true,
        created_at: true,
      },
    });
    
    if (!user) return null;
    
    // Mapear la respuesta a snake_case
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastName,
      username: user.userName,
      password: user.password,
      created_at: user.created_at,
    };
  }

  // Guarda el refreshToken en la DB
  async saveRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  // Guarda el hash en la DB
  async saveHash(id: number, hash: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hash },
    });
  }
}