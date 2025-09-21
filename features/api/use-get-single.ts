import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';

type AccountResponseType = InferResponseType<typeof client.api.accounts[":id"]["$get"]>;
type CategoryResponseType = InferResponseType<typeof client.api.categories[":id"]["$get"]>;
type TransactionResponseType = InferResponseType<typeof client.api.transactions[":id"]["$get"]>;


export const useGetAccount = (id?: string) => {
    const query = useQuery<AccountResponseType>({
        enabled: !!id,
        queryKey: ['account', { id }],
        queryFn: async () => {
            const response = await client.api.accounts[":id"].$get({
                param: { id: id ?? '' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch account');
            }

            const data: AccountResponseType = await response.json();
           
            return data;
        }
    });

    return query;
};



export const useGetCategory = (id?: string) => {
    const query = useQuery<CategoryResponseType>({
        enabled: !!id,
        queryKey: ['categories', { id }],
        queryFn: async () => {
            const response = await client.api.categories[":id"].$get({
                param: { id: id ?? '' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch category');
            }

            const data: CategoryResponseType = await response.json();
            
            return data;
        }
    });

    return query;
};


export const useGetTransaction = (id?: string) => {
    const query = useQuery<TransactionResponseType>({
        enabled: !!id,
        queryKey: ['transactions', { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param: { id: id ?? '' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transaction');
            }

            const result : TransactionResponseType = await response.json();
            const data = {
                ...result,
                amount: result.amount / 100
            }

            return data;
        }
    });

    return query;
};