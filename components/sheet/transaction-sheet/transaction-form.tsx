"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { insertTransactionsSchema } from "@/src/schema"
import { Trash } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Select } from "@/components/select"
import { DatePicker } from "@/components/date-picker"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AmountInput } from "@/components/amount-input"
import { convertAmountToMiliUnits } from "@/lib/utils"

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
})

const apiSchema = insertTransactionsSchema.omit({
    id: true,
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string }[]
    categoryOptions: { label: string; value: string }[]
    onCreateAccount: (name: string) => void
    onCreateCategory: (name: string) => void

}

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...defaultValues,
            payee: defaultValues?.payee ?? "",
            date: defaultValues?.date ?? new Date()
        }
    })




    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount)
        const amountInMiliunits = convertAmountToMiliUnits(amount)
        onSubmit({
            ...values,
            amount: amountInMiliunits,
        })
    }

    const handleDelete = () => {
        onDelete?.()
    }




    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4 px -2">

                <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={field.value }
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />


                <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder="Select Account"
                                    options={accountOptions}
                                    onCreate={onCreateAccount}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />


                <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder="Select Category"
                                    options={categoryOptions}
                                    onCreate={onCreateCategory}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />


                <FormField
                    name="payee"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input
                                disabled={disabled}
                                placeholder="Add Payee"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />


                    <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput 
                                {...field}
                                disabled={disabled}
                                placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                {...field}
                                disabled={disabled}
                                placeholder="Optional Notes"
                                value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />




                <Button type="submit" disabled={disabled} className="w-full">
                    {id ? "Save Changes" : "Create Transaction"}
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
                        Delete Transaction
                    </Button>
                )}
            </form>
        </Form>
    )
}