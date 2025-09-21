"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {  useNewTransaction } from "@/features/hooks/use-new-accounts"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import {  insertTransactionsSchema } from "@/src/schema"
import { useCreateAccount, useCreateCategory, useCreateTransaction } from "@/features/api/use-create"
import { TransactionForm } from "./transaction-form"
import { useGetAccounts, useGetCategories } from "@/features/api/use-get-multiple"
import { Loader2 } from "lucide-react"
import { convertAmountToMiliUnits } from "@/lib/utils"

const formSchema = insertTransactionsSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction()
    const form = useForm<FormValues>()
    const { mutate } = useCreateTransaction()


    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()

    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({ name  })
    }
    
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }))



    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()

    const onCreateAccount = (name: string) => {
        accountMutation.mutate({ name  })
    }
    
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }))

    
    const isPending = 
        categoryQuery.isPending || 
        accountQuery.isPending || 
        accountMutation.isPending || 
        categoryMutation.isPending




const handleSubmit = (values: FormValues) => {
    const amountInMiliunits = convertAmountToMiliUnits(parseFloat(values.amount));
    mutate({
        ...values,
        amount: amountInMiliunits,
    }, {
        onSuccess: () => {
            form.reset();
            onClose();
        }
    });
}



    return (
        
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="px-4 sm:px-6">
                <SheetHeader className="px-2">
                    <SheetTitle>New Transaction</SheetTitle>
                    <SheetDescription>
                        Create a new transaction to track your finances.
                    </SheetDescription>
                </SheetHeader>
                <FormProvider {...form}>
                    {isPending ? (
                        <div className="absolute inset-0 flex items-center
                        justify-center">
                            <Loader2 className="size-4 text-muted-foreground
                            animate-spin" />
                            </div>
                    )
                    :
                    (
                    <TransactionForm
                        onSubmit={handleSubmit} 
                        disabled={isPending}
                        categoryOptions ={categoryOptions}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                        onCreateAccount={onCreateAccount}
                    />

                    )
                }
                    
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}