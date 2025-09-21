import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { UploadButton } from "./upload-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss"
const outputFormat = "yyyy-MM-dd"

const requiredOption = [
    "amount",
    "date",
    "payee"
]

interface SelectedColumnsState {
    [key: string]: string | null;
}


type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export const ImportCard = ({
    data,
    onCancel,
    onSubmit
}: Props) => {

    const [selectedColumns, setSelectedColumns] = 
    useState<SelectedColumnsState>({})

    const headers = data[0]
    const body = data.slice(1)

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string| null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev}

            for (const key in newSelectedColumns){
                if( newSelectedColumns[key] === value){
                    newSelectedColumns[key] = null;
                }
            }
            
            if (value === "skip"){
                value = null
            }

            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns

        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    const handleContinue = () => {

        const getColumnIndex = (column: string) => {
            return column.split("_")[1]
        }

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`)
                return selectedColumns[`column_${columnIndex}`] || null
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`)
                    return selectedColumns[`column_${columnIndex}`] ? cell : null
                })

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow
            }).filter((row) => row.length > 0)
        }

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if(header !== null) {
                    acc[header] = cell
                }
                return acc;
            }, {})
        })
            const formattedData = arrayOfData.map((item)=> ({
                ...item,
                amount: convertAmountFromMiliUnits(parseFloat(item.amount)),
                date: format(parse(item.date, dateFormat, new Date()), outputFormat)
            }))
            onSubmit(formattedData)
        }

    return (
        <div className="px-6 -mt-16">
            <Card className="border-none px-4drop-shadow-sm">
                <CardHeader className="gap-y-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transaction 
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-3">
                        <Button 
                        onClick={onCancel} 
                        size="sm" 
                        className="w-full lg:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                        size="sm"
                        disabled={progress < requiredOption.length}
                        onClick={handleContinue}
                        className="w-full lg:w-auto"
                        >
                            Continue ({progress} / {requiredOption.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                    headers={headers}
                    body={body}
                    selectedColumns={selectedColumns}   
                    onTableHeadSelectChange={onTableHeadSelectChange} 
                    />
                </CardContent>
            </Card>
        </div>
    )
}