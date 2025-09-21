"use client"

import { Button } from "@/components/ui/button"
import { useDeleteAccount } from "@/features/api/use-delete"
import { useConfirm } from "@/features/hooks/use-confirm"
import { useOpenAccount } from "@/features/hooks/use-open-account"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

type Props = {
    id: string
}

export const Action = ({id}: Props) => {
    
    const [ConfirmDialog, confirm] = useConfirm( 
        "Are you Sure?",
        "You are about to delete account."
    )
    const { onOpen } = useOpenAccount()
    const deleteMutation = useDeleteAccount(id)

    const handleDelete = async () => {

        const ok = await confirm()
        if(ok){
                deleteMutation.mutate({ id })
        }
    }

    return (
        <>
        <ConfirmDialog/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="size-8 p-0 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
                >
                    <MoreHorizontal className="size-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end"
                className="w-48 bg-background shadow-lg rounded-md border border-border p-1 animate-in fade-in-80 zoom-in-95"
            >
                <DropdownMenuItem
                    disabled={deleteMutation.isPending}
                    onClick={() => onOpen(id)}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent focus:bg-accent rounded-sm focus:outline-none"
                >
                    <Edit className="size-4 mr-2"/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={deleteMutation.isPending}
                    onClick={handleDelete}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent focus:bg-accent rounded-sm focus:outline-none"
                >
                    <Trash className="size-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}