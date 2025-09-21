"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useNewAccount } from "@/features/hooks/use-new-accounts"
import { AccountForm } from "./account-form"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { insertAccountSchema } from "@/src/schema"
import { useCreateAccount } from "@/features/api/use-create"
import { useOpenAccount } from "@/features/hooks/use-open-account"
import { useGetAccount } from "@/features/api/use-get-single"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditAccount } from "@/features/api/use-edit"
import { useEffect } from "react" 
import { useDeleteAccount } from "@/features/api/use-delete"
import { useConfirm } from "@/features/hooks/use-confirm"
import { Loader2 } from "lucide-react"


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()
    const [ConfirmDialog, confirm] = useConfirm( 
        "Are you Sure?",
        "You are about to delete account."
    )
    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
    const isPending = editMutation.isPending || 
                    deleteMutation.isPending ||
                    accountQuery.isLoading
    const isLoading = accountQuery.isLoading


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    useEffect(() => {
        if (accountQuery.data) {
            form.reset({
                name: accountQuery.data.name
            });
        }
    }, [accountQuery.data, form]);

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm()
        if(ok){
            if (id) {
                deleteMutation.mutate({ id }, {
                    onSuccess: () =>{
                        onClose();
                    }
                })
            }
        }
    }



    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        )
    }

    return (
        <>
        <ConfirmDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
        {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            ) : (
                <SheetContent className="px-4 sm:px-6">
                <SheetHeader className="px-2">
                    <SheetTitle>Edit Account</SheetTitle>
                    <SheetDescription>
                        Edit an existing account
                    </SheetDescription>
                </SheetHeader>

                <FormProvider {...form}>
                    <AccountForm
                        id={id}
                        onSubmit={onSubmit}
                        disabled={isPending}
                        defaultValues={form.getValues()} 
                        onDelete={onDelete}
                        />
                </FormProvider>
            </SheetContent>

            )})
        </Sheet>
        </>
    )
}
