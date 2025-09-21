import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {useCSVReader } from  "react-papaparse"

type Props = {
    onUpload : (result: any) => void
};

export const UploadButton = ({onUpload}: Props ) => {

    const { CSVReader } = useCSVReader();

    //TODO ADD PAYWALL

    return (
        <CSVReader onUploadAccepted = {onUpload}>
            {({getRootProps} : any) => (
                <Button
                size="sm"
                {...getRootProps()}
                >
                    <Upload className="size-4 mr-2"/>
                    Import
                </Button>
            )}
        </CSVReader>
    );
}