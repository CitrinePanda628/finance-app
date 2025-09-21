"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";


type AccountResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>
type AccountRequestType = InferRequestType<typeof client.api.accounts[":id"]["$delete"]>["param"]

type CategoryResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>
type CategoryRequestType = InferRequestType<typeof client.api.categories[":id"]["$delete"]>["param"]

type TransactionResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;
type TransactionRequestType = InferRequestType<typeof client.api.transactions[":id"]["$delete"]>["param"];





export const useDeleteAccount = (id? : string) => {
    const queryClient = useQueryClient();

    return useMutation<
 AccountResponseType, Error,AccountRequestType  >({
        mutationKey: ['accounts'],
        mutationFn: async (params) => {
            const { id } = params;
            const response = await client.api.accounts[":id"]["$delete"]({ 
                param: { id }
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete account");
        }
    });
};



export const useDeleteCategory = (id? : string) => {
    const queryClient = useQueryClient();

    return useMutation<
 CategoryResponseType, Error,CategoryRequestType  >({
        mutationKey: ['categories'],
        mutationFn: async (params) => {
            const { id } = params;
            const response = await client.api.categories[":id"]["$delete"]({ 
                param: { id }
            });

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories", { id }] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete category");
        }
    });
};



export const useDeleteTransaction = (id? : string) => {
    const queryClient = useQueryClient();

    return useMutation<
 TransactionResponseType, Error,TransactionRequestType  >({
        mutationKey: ['transactions'],
        mutationFn: async (params) => {
            const { id } = params;
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id }
            });

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete Transaction");
        }
    });
};