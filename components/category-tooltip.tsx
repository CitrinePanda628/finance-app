import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export const CategoryTooltip = ({ active, payload }: any) => {

    if (!active || !payload || payload.length === 0) return null;

    const name = payload[0].payload.name /100;
    const value = payload[0].value /100;

    return (
        <div className="rounded-lg bg-white shadow-xl border border-gray-300 overflow-hidden min-w-[220px]">

            <div className="text-sm p-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold border-b">
                {name}
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                        <div className="size-3.5 bg-rose-500 rounded-full ring-2 ring-rose-100"></div>
                        <span className="text-sm font-medium text-gray-600">Expenses</span>
                    </div>
                    <span className="text-sm font-bold text-rose-600">
                        {formatCurrency(value * -1)}
                    </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
            </div>
        </div>
    );
};