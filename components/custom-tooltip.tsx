import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const date = payload[0].payload.date;
    const income = payload[0].value / 100;
    const expenses = payload[1].value / 100;
    const net = income - expenses;

    return (
        <div className="rounded-lg bg-white shadow-xl border border-gray-300 overflow-hidden min-w-[220px]">
            
            <div className="text-sm p-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold border-b">
                {format(new Date(date), "EEE, MMM dd, yyyy")}
            </div>
            
            
            <div className="p-4 space-y-4"> 
                

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                        <div className="size-3.5 bg-blue-500 rounded-full ring-2 ring-blue-100"></div>
                        <span className="text-sm font-medium text-gray-600">Income</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                        {formatCurrency(income)}
                    </span>
                </div>


                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                        <div className="size-3.5 bg-rose-500 rounded-full ring-2 ring-rose-100"></div>
                        <span className="text-sm font-medium text-gray-600">Expenses</span>
                    </div>
                    <span className="text-sm font-bold text-rose-600">
                        {formatCurrency(expenses)}
                    </span>
                </div>


                <div className="border-t border-gray-200 my-2"></div>


                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Net</span>
                    <span className={`text-sm font-bold ${
                        net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {formatCurrency(net)}
                    </span>
                </div>
            </div>
        </div>
    );
};