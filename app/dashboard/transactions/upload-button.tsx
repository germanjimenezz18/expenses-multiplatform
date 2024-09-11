import { useCSVReader } from "react-papaparse";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: any) => void;
};
export default function UploadButton({ onUpload }: Props) {
  const { CSVReader } = useCSVReader();

  return (
    <>
      <CSVReader onUploadAccepted={onUpload}>
        {({ getRootProps }: any) => (
          <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
            <Upload className="mr-2 size-4" />
            Upload
          </Button>
        )}
      </CSVReader>
    </>
  );
}
