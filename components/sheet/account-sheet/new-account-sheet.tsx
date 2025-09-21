"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useNewAccount } from "@/features/hooks/use-new-accounts"
import { AccountForm } from "./account-form"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { insertAccountSchema } from "@/src/schema"
import { useCreateAccount } from "@/features/api/use-create"

const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount()
    const form = useForm<FormValues>()
    const { mutate, isPending } = useCreateAccount()

  const handleSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        onClose()
      }
    })
  }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="px-4 sm:px-6">
                <SheetHeader className="px-2">
                    <SheetTitle>New Account</SheetTitle>
                    <SheetDescription>
                        Create a new account to track your finances.
                    </SheetDescription>
                </SheetHeader>
                <FormProvider {...form}>
                    <AccountForm 
                        onSubmit={handleSubmit} 
                        disabled={false}
                        defaultValues={{name:" "}}
                    />
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}