"use client"
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { columns } from "../categories/columns";
import { Plus, Loader2 } from "lucide-react";
import { useGetCategories } from "@/features/api/use-get-multiple";
import { useBulkDeleteCategory } from "@/features/api/use-bulk-delete";
import { useNewCategory } from "@/features/hooks/use-new-accounts";


const  CategoriesPage = () => {

    const { onOpen } = useNewCategory();
    const categoriesQuery = useGetCategories()
    const categories = categoriesQuery.data  || []
    const bulkDelete = useBulkDeleteCategory();

        return (
            <div className="px-6 -mt-16">
                <Card className="border-none px-4drop-shadow-sm">
                    <CardHeader className="gap-y-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl line-clamp-1">
                        Categories
                    </CardTitle>
                    <Button onClick={onOpen} size="sm">
                    <Plus className="size-4 mr-2"/>
                        Add New
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {categoriesQuery.isLoading ? (
                            <div className="flex items-center justify-center h-[300px]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <DataTable 
                            columns={columns} 
                            data={categories}
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

export default CategoriesPage;

