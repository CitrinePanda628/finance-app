"use client"

import { EditAccountSheet } from "@/components/sheet/account-sheet/edit-account-sheet"
import { NewAccountSheet } from "@/components/sheet/account-sheet/new-account-sheet"
import { EditCategorySheet } from "@/components/sheet/category-sheet/edit-category-sheet"
import { NewCategorySheet } from "@/components/sheet/category-sheet/new-category-sheet"
import { EditTransactionSheet } from "@/components/sheet/transaction-sheet/edit-transaction-sheet"
import { NewTransactionSheet } from "@/components/sheet/transaction-sheet/new-transaction-sheet"



export function SheetAccountProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet/>
      <NewCategorySheet/>
      <EditCategorySheet/>
      <NewTransactionSheet/>
      <EditTransactionSheet/>
      {children}
    </>
  )
}