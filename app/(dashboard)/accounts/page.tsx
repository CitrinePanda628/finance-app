"use client"

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/hooks/use-new-accounts";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { useGetAccounts } from "@/features/api/use-get-multiple";
import { useBulkDeleteAccount } from "@/features/api/use-bulk-delete";





const  AccountPage = () => {
    
    const { onOpen } = useNewAccount();
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data  || []
    const bulkDelete = useBulkDeleteAccount();

    return (
        <div className="px-6 -mt-16">
            <Card className="border-none px-4drop-shadow-sm">
                <CardHeader className="gap-y-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                    AccountPage
                    </CardTitle>
                    <Button onClick={onOpen} size="sm">
                    <Plus className="size-4 mr-2"/>
                    Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    {accountsQuery.isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <DataTable 
                        columns={columns} 
                        data={accounts}
                        filterKey="name"
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

export default AccountPage;