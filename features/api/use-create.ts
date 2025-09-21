// src/features/api/use-create-account.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from "sonner";
import { z } from 'zod';
import { insertAccountSchema, insertCategoriesSchema, insertTransactionsSchema } from '@/src/schema';
import { InferResponseType } from 'hono';

const AccountFormSchema = insertAccountSchema.pick({
  name: true
});

const CategoryFormSchema = insertCategoriesSchema.pick({
  name: true
})

const TransactionFormSchema = insertTransactionsSchema

type AccountFormValues = z.input<typeof AccountFormSchema>;
type CategoryFormValues = z.input<typeof CategoryFormSchema>;
type TransactionFromValues = z.input<typeof TransactionFormSchema>

type AccountResponseType = InferResponseType<typeof client.api.accounts.$post>;
type CategoryResponseType = InferResponseType<typeof client.api.categories.$post>;
type TransactionResponseType = InferResponseType<typeof client.api.transactions.$post>;


export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  
return useMutation<AccountResponseType, Error, AccountFormValues>({
    mutationKey: ['accounts'],
    mutationFn: async (values: AccountFormValues) => {
      const response = await client.api.accounts.$post({ json: values });
      
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
      console.error("Error creating account:", error);
    }
  });
};




export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  
return useMutation<CategoryResponseType, Error, CategoryFormValues>({
    mutationKey: ['categories'],
    mutationFn: async (values: CategoryFormValues) => {
      const response = await client.api.categories.$post({ json: values });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create Category");
      console.error("Error creating Category:", error);
    }
  });
};




export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  
return useMutation({
    mutationKey: ['transactions'],
    mutationFn: async (values) => {
      const response = await client.api.transactions.$post({ json: values });
       
      if (!response.ok) {
        throw new Error('Failed to create Transaction');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create Transaction");
      console.error("Error creating Transaction:", error);
    }
  });
};