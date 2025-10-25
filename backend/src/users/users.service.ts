import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';
import { User, CreateUserDto, UpdateUserDto } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(private readonly neo4jService: Neo4jService) { }

    /**
     * Clean up duplicate users (keep the most recent one)
     */
    async cleanupDuplicateUsers(): Promise<void> {
        try {
            const query = `
                MATCH (u:User)
                WITH u.walletAddress as walletAddress, collect(u) as users
                WHERE size(users) > 1
                WITH walletAddress, users, max(users.createdAt) as latestCreatedAt
                UNWIND users as user
                WITH walletAddress, user, latestCreatedAt
                WHERE user.createdAt < latestCreatedAt
                DELETE user
            `;
            await this.neo4jService.runWriteQuery(query, {});
            console.log('Duplicate users cleaned up successfully');
        } catch (error) {
            console.log('Error cleaning up duplicate users:', error);
        }
    }

    /**
     * Clean up users with case-sensitive duplicate wallet addresses
     */
    async cleanupCaseSensitiveDuplicates(): Promise<{ deleted: number; kept: number }> {
        try {
            // Find users with the same wallet address but different cases
            const findDuplicatesQuery = `
                MATCH (u:User)
                WITH toLower(u.walletAddress) as normalizedAddress, collect(u) as users
                WHERE size(users) > 1
                RETURN normalizedAddress, users
            `;

            const duplicates = await this.neo4jService.runQuery(findDuplicatesQuery);
            let deleted = 0;
            let kept = 0;

            for (const duplicate of duplicates) {
                const users = duplicate.users;
                const normalizedAddress = duplicate.normalizedAddress;

                // Sort by creation date, keep the most recent
                const sortedUsers = users.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const userToKeep = sortedUsers[0];
                const usersToDelete = sortedUsers.slice(1);

                // Update the user we're keeping to have the normalized address
                const updateQuery = `
                    MATCH (u:User {id: $userId})
                    SET u.walletAddress = $normalizedAddress
                    RETURN u
                `;

                await this.neo4jService.runWriteQuery(updateQuery, {
                    userId: userToKeep.id,
                    normalizedAddress: normalizedAddress
                });

                // Delete the duplicate users
                for (const userToDelete of usersToDelete) {
                    const deleteQuery = `
                        MATCH (u:User {id: $userId})
                        DETACH DELETE u
                    `;

                    await this.neo4jService.runWriteQuery(deleteQuery, {
                        userId: userToDelete.id
                    });

                    deleted++;
                }

                kept++;
            }

            console.log(`Case-sensitive duplicates cleaned up: ${deleted} deleted, ${kept} kept`);
            return { deleted, kept };
        } catch (error) {
            console.error('Error cleaning up case-sensitive duplicates:', error);
            throw error;
        }
    }

    /**
     * Create a new user
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Normalize wallet address to lowercase
        const normalizedWalletAddress = createUserDto.walletAddress.toLowerCase();

        // Check if user with this wallet address already exists
        const existingUser = await this.findByWalletAddress(normalizedWalletAddress);
        if (existingUser) {
            throw new Error(`User with wallet address ${normalizedWalletAddress} already exists`);
        }

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
            walletAddress: normalizedWalletAddress,
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
        const walletAddress = createUserDto.walletAddress.toLowerCase();

        try {
            // Try to find existing user first
            const existingUser = await this.findByWalletAddress(walletAddress);

            if (existingUser) {
                // Update existing user
                console.log(`Updating existing user with wallet: ${walletAddress}`);
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
                console.log(`Creating new user with wallet: ${walletAddress}`);
                // Create a new DTO with normalized wallet address
                const normalizedDto = { ...createUserDto, walletAddress };
                return this.createUser(normalizedDto);
            }
        } catch (error) {
            // If creation failed due to unique constraint violation, try to find and update the user
            if (error instanceof Error && (
                error.message.includes('already exists') ||
                error.message.includes('unique constraint') ||
                error.message.includes('duplicate key')
            )) {
                console.log(`User already exists (constraint violation), attempting to update: ${walletAddress}`);
                const existingUser = await this.findByWalletAddress(walletAddress);
                if (existingUser) {
                    const updateDto: UpdateUserDto = {
                        firstName: createUserDto.firstName,
                        lastName: createUserDto.lastName,
                        email: createUserDto.email,
                        profileImage: createUserDto.profileImage,
                        lastLoginAt: new Date(),
                    };
                    return this.updateUser(existingUser.id, updateDto);
                }
            }
            console.error(`Error creating/updating user for wallet ${walletAddress}:`, error);
            throw error;
        }
    }

    /**
     * Map Neo4j node to User entity
     */
    /**
     * Convert Neo4j integer to JavaScript number
     */
    private convertNeo4jInteger(value: any): number {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'object' && value.low !== undefined) {
            return value.low;
        }
        return parseInt(value) || 0;
    }

    /**
     * Convert Neo4j datetime to JavaScript Date
     */
    private convertNeo4jDateTime(value: any): Date | undefined {
        if (!value) return undefined;
        if (value instanceof Date) return value;
        if (typeof value === 'string') return new Date(value);
        if (typeof value === 'object' && value.year) {
            // Neo4j datetime object
            const year = this.convertNeo4jInteger(value.year);
            const month = this.convertNeo4jInteger(value.month) - 1; // JavaScript months are 0-based
            const day = this.convertNeo4jInteger(value.day);
            const hour = this.convertNeo4jInteger(value.hour);
            const minute = this.convertNeo4jInteger(value.minute);
            const second = this.convertNeo4jInteger(value.second);
            return new Date(year, month, day, hour, minute, second);
        }
        return new Date(value);
    }

    private mapNeo4jNodeToUser(node: any): User {
        return {
            id: node.properties.id,
            walletAddress: node.properties.walletAddress,
            connectionMethod: node.properties.connectionMethod,
            firstName: node.properties.firstName,
            lastName: node.properties.lastName,
            email: node.properties.email,
            profileImage: node.properties.profileImage,
            createdAt: this.convertNeo4jDateTime(node.properties.createdAt) || new Date(),
            lastLoginAt: this.convertNeo4jDateTime(node.properties.lastLoginAt) || new Date(),
            isActive: node.properties.isActive,
        };
    }
}
