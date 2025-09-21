"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useDeleteCategory } from "@/features/api/use-delete"
import { useEditCategory } from "@/features/api/use-edit"
import { useGetCategory } from "@/features/api/use-get-single"
import { useConfirm } from "@/features/hooks/use-confirm"
import { useOpenCategory } from "@/features/hooks/use-open-account"
import { insertCategoriesSchema } from "@/src/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import z from "zod"
import { CategoryForm } from "./category-form"

const formSchema = insertCategoriesSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory()
    const [ConfirmDialog, confirm] = useConfirm( 
        "Are you Sure?",
        "You are about to delete Category."
    )
    const CategoryQuery = useGetCategory(id)
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)
    const isPending = editMutation.isPending || 
                    deleteMutation.isPending ||
                    CategoryQuery.isLoading
    const isLoading = CategoryQuery.isLoading


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (CategoryQuery.data) {
            form.reset({
                name: CategoryQuery.data.name,
            });
        }
    }, [CategoryQuery.data, form]);

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
                    <SheetTitle>Edit Category</SheetTitle>
                    <SheetDescription>
                        Edit an existing Category
                    </SheetDescription>
                </SheetHeader>

                <FormProvider {...form}>
                    <CategoryForm
                        id={id}
                        onSubmit={onSubmit}
                        disabled={isPending}
                        defaultValues={form.getValues()} 
                        onDelete={onDelete}
                        />
                </FormProvider>
            </SheetContent>

            )}
        </Sheet>
        </>
    )
}
