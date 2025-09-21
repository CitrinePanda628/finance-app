"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferResponseType, InferRequestType } from "hono";


type AccountResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>
type AccountRequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>[{"json"}]

type CategoryResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>
type CategoryRequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>[{"json"}]

type TransactionResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>
type TransactionRequestType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>[{"json"}]



export const useBulkDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<
 AccountResponseType, Error,AccountRequestType  >({
        mutationKey: ['accounts'],
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({json})

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Bulk Account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to bulk delete account");
        }
    });
};



export const useBulkDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<
 CategoryResponseType, Error, CategoryRequestType  >({
        mutationKey: ['categories'],
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({json})

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Bulk Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to bulk delete Category");
        }
    });
};




export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    return useMutation<
 TransactionResponseType, Error, TransactionRequestType  >({
        mutationKey: ['transactions'],
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({json})

            if (!response.ok) {
                throw new Error("Failed to delete Transaction");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Bulk Transaction deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to bulk delete Transaction");
        }
    });
};