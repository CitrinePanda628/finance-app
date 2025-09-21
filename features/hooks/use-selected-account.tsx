"use client"

import { useState, useCallback, JSX, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useCreateAccount } from "../api/use-create";
import { Select } from "@/components/select";
import { useGetAccounts } from "../api/use-get-multiple";

export const useSelectAccount = (): [() => JSX.Element, () => 
  Promise< string| undefined>] => {

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name
  })
  

  const accountOptions = Array.isArray(accountQuery.data) 
  ? accountQuery.data.map((account) => ({
      label: account.name,
      value: account.id
    }))
  : [];

  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: string | undefined) => void>(() => {});

  const selectValue = useRef<string>("")

  const confirm = useCallback(() => {
    setIsOpen(true);
    return new Promise<string | undefined>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    resolvePromise(selectValue.current);
    setIsOpen(false);
    return true
  };

  const handleCancel = () => {
    resolvePromise(undefined);
    setIsOpen(false);
    return false
  };
  
    const handleSelectChange = (value: string) => {
    selectValue.current = value;
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select Account</AlertDialogTitle>
          <AlertDialogDescription>Please Select an Account</AlertDialogDescription>
        </AlertDialogHeader>
        <Select
        placeholder="Select an Account"
        options={accountOptions}
        onCreate={onCreateAccount}
        onChange={handleSelectChange}
        disabled={accountQuery.isLoading || accountMutation.isPending}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [ConfirmationDialog, confirm];
};