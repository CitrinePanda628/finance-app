// src/features/api/use-create-account.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from "sonner";
import { z } from 'zod';
import { insertAccountSchema } from '@/src/schema';
import { InferRequestType, InferResponseType } from 'hono';

const formSchema = insertAccountSchema.pick({
  name: true
});


type AccountResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type AccountRequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>[{"json"}]

type CategoryResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type CategoryRequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>[{"json"}]

type TransactionResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type TransactionRequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>[{"json"}]



export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  
return useMutation<AccountResponseType, Error, AccountRequestType>({
    mutationKey: ['accounts'],
    mutationFn: async ( json) => {
      const response = await client.api.accounts[":id"]["$patch"]({ 
        param: { id: id ?? '' },
        json
       });

      
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
        
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to Update account");
      console.error("Error updating account:", error);
    }
  });
};


export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  
return useMutation<CategoryResponseType, Error, CategoryRequestType>({
    mutationKey: ['categories'],
    mutationFn: async ( json) => {
      const response = await client.api.categories[":id"]["$patch"]({ 
        param: { id: id ?? '' },
        json
       });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to Update account");
    }
  });
};



export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  
return useMutation<TransactionResponseType, Error, TransactionRequestType>({
    mutationKey: ['transactions', id],
    mutationFn: async ( json) => {
      console.log(id)
      console.log(json)
      const response = await client.api.transactions[":id"]["$patch"]({ 
        param: { id: id ?? '' },
        json
       });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to Update Transaction");
    }
  });
};