import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';
import { User, CreateUserDto, UpdateUserDto } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(private readonly neo4jService: Neo4jService) { }

    /**
     * Create a new user
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const userId = uuidv4();
        const now = new Date();

        const query = `
      CREATE (u:User {
        id: $id,
        walletAddress: $walletAddress,
        connectionMethod: $connectionMethod,
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        profileImage: $profileImage,
        createdAt: datetime($createdAt),
        lastLoginAt: datetime($lastLoginAt),
        isActive: true
      })
      RETURN u
    `;

        const parameters = {
            id: userId,
            walletAddress: createUserDto.walletAddress.toLowerCase(),
            connectionMethod: createUserDto.connectionMethod,
            firstName: createUserDto.firstName || null,
            lastName: createUserDto.lastName || null,
            email: createUserDto.email || null,
            profileImage: createUserDto.profileImage || null,
            createdAt: now.toISOString(),
            lastLoginAt: now.toISOString(),
        };

        const result = await this.neo4jService.runWriteQuery(query, parameters);

        if (result.length === 0) {
            throw new Error('Failed to create user');
        }

        return this.mapNeo4jNodeToUser(result[0].u);
    }

    /**
     * Find user by wallet address
     */
    async findByWalletAddress(walletAddress: string): Promise<User | null> {
        const query = `
      MATCH (u:User {walletAddress: $walletAddress})
      RETURN u
    `;

        const result = await this.neo4jService.runQuery(query, {
            walletAddress: walletAddress.toLowerCase(),
        });

        if (result.length === 0) {
            return null;
        }

        return this.mapNeo4jNodeToUser(result[0].u);
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        const query = `
      MATCH (u:User {id: $id})
      RETURN u
    `;

        const result = await this.neo4jService.runQuery(query, { id });

        if (result.length === 0) {
            return null;
        }

        return this.mapNeo4jNodeToUser(result[0].u);
    }

    /**
     * Update user information
     */
    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const setClauses: string[] = [];
        const parameters: any = { id };

        if (updateUserDto.firstName !== undefined) {
            setClauses.push('u.firstName = $firstName');
            parameters.firstName = updateUserDto.firstName;
        }
        if (updateUserDto.lastName !== undefined) {
            setClauses.push('u.lastName = $lastName');
            parameters.lastName = updateUserDto.lastName;
        }
        if (updateUserDto.email !== undefined) {
            setClauses.push('u.email = $email');
            parameters.email = updateUserDto.email;
        }
        if (updateUserDto.profileImage !== undefined) {
            setClauses.push('u.profileImage = $profileImage');
            parameters.profileImage = updateUserDto.profileImage;
        }
        if (updateUserDto.lastLoginAt !== undefined) {
            setClauses.push('u.lastLoginAt = datetime($lastLoginAt)');
            parameters.lastLoginAt = updateUserDto.lastLoginAt.toISOString();
        }

        if (setClauses.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
      MATCH (u:User {id: $id})
      SET ${setClauses.join(', ')}
      RETURN u
    `;

        const result = await this.neo4jService.runWriteQuery(query, parameters);

        if (result.length === 0) {
            throw new Error('User not found');
        }

        return this.mapNeo4jNodeToUser(result[0].u);
    }

    /**
     * Update last login time
     */
    async updateLastLogin(walletAddress: string): Promise<User> {
        const query = `
      MATCH (u:User {walletAddress: $walletAddress})
      SET u.lastLoginAt = datetime($lastLoginAt)
      RETURN u
    `;

        const result = await this.neo4jService.runWriteQuery(query, {
            walletAddress: walletAddress.toLowerCase(),
            lastLoginAt: new Date().toISOString(),
        });

        if (result.length === 0) {
            throw new Error('User not found');
        }

        return this.mapNeo4jNodeToUser(result[0].u);
    }

    /**
     * Create or update user (upsert)
     */
    async createOrUpdateUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findByWalletAddress(createUserDto.walletAddress);

        if (existingUser) {
            // Update existing user
            const updateDto: UpdateUserDto = {
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                email: createUserDto.email,
                profileImage: createUserDto.profileImage,
                lastLoginAt: new Date(),
            };

            return this.updateUser(existingUser.id, updateDto);
        } else {
            // Create new user
            return this.createUser(createUserDto);
        }
    }

    /**
     * Map Neo4j node to User entity
     */
    private mapNeo4jNodeToUser(node: any): User {
        return {
            id: node.properties.id,
            walletAddress: node.properties.walletAddress,
            connectionMethod: node.properties.connectionMethod,
            firstName: node.properties.firstName,
            lastName: node.properties.lastName,
            email: node.properties.email,
            profileImage: node.properties.profileImage,
            createdAt: new Date(node.properties.createdAt),
            lastLoginAt: new Date(node.properties.lastLoginAt),
            isActive: node.properties.isActive,
        };
    }
}
