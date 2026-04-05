import { Role } from '../../types';
export declare const dashboardService: {
    getSummary(userId: string, role: Role): Promise<{
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        recordCount: number;
        incomeCount: number;
        expenseCount: number;
    }>;
    getCategoryTotals(userId: string, role: Role): Promise<{
        category: string;
        type: string;
        total: number;
        count: number;
    }[]>;
    getMonthlyTrends(userId: string, role: Role, months?: number): Promise<{
        month: string;
        income: number;
        expense: number;
        net: number;
    }[]>;
    getWeeklyTrends(userId: string, role: Role, weeks?: number): Promise<{
        week: string;
        income: number;
        expense: number;
        net: number;
    }[]>;
    getRecentActivity(userId: string, role: Role, limit?: number): Promise<{
        amount: number;
        id: string;
        type: string;
        category: string;
        date: Date;
        notes: string | null;
        user_name: string;
    }[]>;
    getTopCategories(userId: string, role: Role, limit?: number): Promise<{
        category: string;
        total: number;
        percentage: number;
    }[]>;
};
