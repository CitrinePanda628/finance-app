"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useDeleteTransaction } from "@/features/api/use-delete"
import { useEditTransaction } from "@/features/api/use-edit"
import { useGetTransaction } from "@/features/api/use-get-single"
import { useConfirm } from "@/features/hooks/use-confirm"
import { useOpenTransaction } from "@/features/hooks/use-open-account"
import { insertTransactionsSchema } from "@/src/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import z from "zod"
import { TransactionForm } from "./transaction-form"
import { useCreateCategory, useCreateAccount } from "@/features/api/use-create"
import { useGetCategories, useGetAccounts } from "@/features/api/use-get-multiple"
import { convertAmountFromMiliUnits, convertAmountToMiliUnits, formatCurrency } from "@/lib/utils"

const formSchema = insertTransactionsSchema.omit({
    id: true,
})
type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction()
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you Sure?",
        "You are about to edit Transaction."
    )
    const TransactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)


    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()

    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({ name })
    }

    const categoryOptions = (categoryQuery.data ?? []).map((category: any) => ({
        label: category.name,
        value: category.id,
    }))



    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()

    const onCreateAccount = (name: string) => {
        accountMutation.mutate({ name })
    }

    const accountOptions = (accountQuery.data ?? []).map((account: any) => ({
        label: account.name,
        value: account.id,
    }))



    const isPending = editMutation.isPending ||
        deleteMutation.isPending ||
        TransactionQuery.isLoading ||
        categoryQuery.isPending ||
        accountQuery.isPending


    
    const isLoading = TransactionQuery.isLoading ||
        categoryQuery.isLoading ||
        accountQuery.isLoading


    const defaultValues = TransactionQuery.data ? {
        accountId: TransactionQuery.data.accountId,
        categoryId: TransactionQuery.data.categoryId,
        amount: convertAmountFromMiliUnits(TransactionQuery.data.amount).toString(),
        date: TransactionQuery.data.date ? new Date(TransactionQuery.data.date) : new Date(),
        payee: TransactionQuery.data.payee,
        notes: TransactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "0",
        date: new Date(),
        payee: "",
        notes: "",
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        //defaultValues: defaultValues
    });

    useEffect(() => {
        if (TransactionQuery.data) {
            form.reset({
                amount: TransactionQuery.data.amount,
            });
        }
    }, [TransactionQuery.data, form]);

    const onSubmit = (values: FormValues) => {
        const amountInMiliunits = values.amount * 100;
        editMutation.mutate({
            ...values,
            amount: amountInMiliunits,
        }, {
            onSuccess: () => {
                onClose()
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm()
        if (ok) {
            if (id) {
                deleteMutation.mutate({ id }, {
                    onSuccess: () => {
                        onClose();
                    }
                })
            }
        }
    }
  




    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <SheetContent className="px-4 sm:px-6">
                        <SheetHeader className="px-2">
                            <SheetTitle>Edit Transaction</SheetTitle>
                            <SheetDescription>
                                Edit an existing Transaction
                            </SheetDescription>
                        </SheetHeader>

                        <FormProvider {...form}>
                          {isLoading ? (
                            <div className="absolute inse-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                            ):(
                            <TransactionForm
                                id={id}
                                defaultValues={defaultValues}
                                onSubmit={onSubmit} 
                                onDelete={onDelete}
                                disabled={isPending}
                                categoryOptions ={categoryOptions}
                                onCreateCategory={onCreateCategory}
                                accountOptions={accountOptions}
                                onCreateAccount={onCreateAccount}
                            />
                            )}
                        </FormProvider>
                    </SheetContent> 

                )}
            </Sheet>
        </>
    )
}
