import { Role } from '../../types';
import { CreateRecordDto, UpdateRecordDto, ListRecordsQuery } from './records.schemas';
interface RecordRow {
    id: string;
    amount: string;
    type: string;
    category: string;
    date: Date;
    notes: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user_name?: string;
    user_email?: string;
}
export declare const recordsService: {
    list(q: ListRecordsQuery, requesterId: string, requesterRole: Role): Promise<{
        records: RecordRow[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string, requesterId: string, requesterRole: Role): Promise<RecordRow>;
    create(dto: CreateRecordDto, requesterId: string): Promise<RecordRow>;
    update(id: string, dto: UpdateRecordDto, requesterId: string, requesterRole: Role): Promise<RecordRow>;
    softDelete(id: string, requesterId: string, requesterRole: Role): Promise<void>;
};
export {};
