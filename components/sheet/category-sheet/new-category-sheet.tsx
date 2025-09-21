"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {  useNewCategory } from "@/features/hooks/use-new-accounts"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import {  insertCategoriesSchema } from "@/src/schema"
import { useCreateCategory } from "@/features/api/use-create"
import { CategoryForm } from "./category-form"

const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory()
    const form = useForm<FormValues>()
    const { mutate, isPending } = useCreateCategory()

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
                    <SheetTitle>New Category</SheetTitle>
                    <SheetDescription>
                        Create a new category to track your finances.
                    </SheetDescription>
                </SheetHeader>
                <FormProvider {...form}>
                    <CategoryForm 
                        onSubmit={handleSubmit} 
                        disabled={isPending}
                        defaultValues={{name:" "}}
                    />
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}