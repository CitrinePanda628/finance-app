"use client"

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';
import { useSearchParams } from 'next/navigation';
import { tr } from 'date-fns/locale';
import { convertAmountFromMiliUnits } from '@/lib/utils';

type AccountResponseType = InferResponseType<typeof client.api.accounts.$get>;
type CategorieResponseType = InferResponseType<typeof client.api.categories.$get>;
type TransactionResponseType = InferResponseType<typeof client.api.transactions.$get>;



export const useGetAccounts = () => {
    const query = useQuery<AccountResponseType>({
        queryKey: ['accounts'],
        queryFn: async () => {
            const response = await client.api.accounts.$get()

            if(!response.ok) {
                throw new Error('Failed to fetch accounts');
            }

            const result: AccountResponseType = await response.json();
            return result.data;
        }
    })
 
    return query
}




export const useGetCategories = () => {
    const query = useQuery<CategorieResponseType>({
        queryKey: ['categories'],
        queryFn: async() => {
            const response = await client.api.categories.$get()

            if(!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            
            const result: CategorieResponseType = await response.json();
            return result.data;

        }
    })
    return query
}



export const useGetTransactions = () => {

    const params = useSearchParams()
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";
    

    const query = useQuery<TransactionResponseType>({
        
        queryKey: ['transactions', { from, to, accountId }],
        queryFn: async() => {
            const response = await client.api.transactions.$get({
                query: { from, to, accountId }
            })

            if(!response.ok) {
                throw new Error('Failed to fetch transaction');
            }
            
            const result: TransactionResponseType = await response.json();
            return result.data.map((transaction: { amount: number; }) => ({
                ...transaction,
                amount: transaction.amount / 100
            }))
            
        }
    })
    return query
}


