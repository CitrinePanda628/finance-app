"use-cleint"

import { useGetSummary } from "@/features/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import {  useSearchParams } from "next/navigation"
import { FaArrowCircleDown, FaArrowCircleUp, FaPiggyBank } from "react-icons/fa"
import { DataCard, DataCardLoading } from "./data-card";

export const DataGrid = () => {
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined
    const { data, isLoading } = useGetSummary()

    const dateRangeLabel = formatDateRange({to, from})    

    if(isLoading){
        return(
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading/>
                 <DataCardLoading/>
                  <DataCardLoading/>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard 
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variant="default"
                dateRange={dateRangeLabel}
                />
                <DataCard 
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowCircleUp}
                variant="success"
                dateRange={dateRangeLabel}
                />
                <DataCard 
                title="Expenses"
                value={data?.expenseAmount}
                percentageChange={data?.expenseChange}
                icon={FaArrowCircleDown}
                variant="danger"
                dateRange={dateRangeLabel}
                showNegative={true}
                />
        </div>
    )
}