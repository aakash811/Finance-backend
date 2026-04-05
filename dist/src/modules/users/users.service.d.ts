import { Role, UserStatus } from '../../types';
import { CreateUserDto, UpdateUserDto, ListUsersQuery } from './users.schemas';
interface UserRow {
    id: string;
    email: string;
    name: string;
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const usersService: {
    list(q: ListUsersQuery): Promise<{
        users: UserRow[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<UserRow>;
    create(dto: CreateUserDto): Promise<UserRow>;
    update(id: string, dto: UpdateUserDto): Promise<UserRow>;
    softDelete(id: string, requesterId: string): Promise<void>;
};
export {};
