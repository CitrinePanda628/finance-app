import { useOpenAccount, useOpenCategory, useOpenTransaction } from "@/features/hooks/use-open-account";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type AccountProps = {
    account: string | null;
    accountId: string | null
}

type CategoryProps = {
    id: string
    category: string | null;
    categoryId: string | null
}

export const AccountColumn = ({

    account,
    accountId
} : AccountProps) => {
    const {onOpen: onOpenAccount} = useOpenAccount()
        
    const onClick = () => {
        if (accountId) {
            onOpenAccount(accountId)
        }
    }

    return(
        <div 
        onClick={onClick}
        className="flex items-center cursor-pointer hover:underline">
            {account}
        </div>
    )
}


export const CategoryColumn = ({
    id,
    category,
    categoryId
} : CategoryProps) => {
    const {onOpen: onOpenCategory} = useOpenCategory()
    const {onOpen: onOpenTransaction} = useOpenTransaction()  

    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId)
        }else{
            onOpenTransaction(id)
        }
    }

    return(
        <div 
        onClick={onClick}
        className={cn("flex items-center cursor-pointer hover:underline",
            !category && "text-rose-500", 
        )}>
           {!category && <TriangleAlert className="mr-2 sixe-4 shrinnk-0"/>}
            {category || "No Category"}
        </div>
    )
}