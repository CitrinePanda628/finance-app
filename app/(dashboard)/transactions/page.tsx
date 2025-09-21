"use client"
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { transactions as transactionSchema} from "@/src/schema";
import { Plus, Loader2 } from "lucide-react";
import { useBulkDeleteTransactions } from "@/features/api/use-bulk-delete";
import { useNewTransaction } from "@/features/hooks/use-new-accounts";
import { columns } from "./columns";
import { useGetTransactions } from "@/features/api/use-get-multiple";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { useSelectAccount } from "@/features/hooks/use-selected-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/api/use-bulk-create";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};


const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {}
}



const TransactionPage = () => {

    const [AccountDialog, confirm] = useSelectAccount()
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const { onOpen } = useNewTransaction();
    const transactionQuery = useGetTransactions()
    const transactions = transactionQuery.data || []
    const bulkDelete = useBulkDeleteTransactions();

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results)
        setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariant(VARIANTS.LIST)
    }

    const createTransaction = useBulkCreateTransactions();

     const onSubmitImport = async (
        values: typeof transactionSchema.$inferInsert[],
     ) => {
         const accountId = await confirm()

         if(!accountId){
            return toast.error("Please select an account")
         }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId
        }))

         createTransaction.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            }
         })
     }


    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog/>
                <ImportCard
                data={importResults.data}
                onCancel={onCancelImport}
                onSubmit={onSubmitImport}
                />
            </>
        )
    }


    return (
        <div className="px-6 -mt-16">
            <Card className="border-none px-4drop-shadow-sm">
                <CardHeader className="gap-y-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            onClick={onOpen} 
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2" />
                            Add New
                        </Button>
                        <UploadButton
                            onUpload={onUpload}
                        />
                        </div>
                </CardHeader>
                <CardContent>
                    {transactionQuery.isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={transactions}
                            filterKey="amount"
                            onDelete={(rows) => {
                                const ids = rows.map(row => row.original.id);
                                bulkDelete.mutate({ ids });
                            }}
                            disabled={bulkDelete.isPending}
                        />
                    )}

                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionPage;



