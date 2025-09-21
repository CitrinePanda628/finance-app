"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { insertAccountSchema } from "@/src/schema"
import { Trash } from "lucide-react"
import { FormField, Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {name: ""}
    })

    const handleSubmit = form.handleSubmit((values) => {
        onSubmit(values)
    })

    const handleDelete = () => {
        onDelete?.()
    }




    return (
        <Form {...form} >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 px -2">
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                disabled={disabled}
                                placeholder="e.g. Cash, Bank, Credit Card"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={disabled} className="w-full">
                {id ? "Save Changes" : "Create Account"}
            </Button>
            {!!id && (
                <Button
                    type="button"
                    disabled={disabled}
                    onClick={handleDelete}
                    className="w-full mt-4"
                    variant="outline"
                >
                    <Trash className="size-4 mr-2" />
                    Delete Account
                </Button>
            )}
        </form>
        </Form>
    )
}