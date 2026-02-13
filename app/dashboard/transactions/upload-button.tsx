import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: any) => void;
};
export default function UploadButton({ onUpload }: Props) {
  const { CSVReader } = useCSVReader();

  const logResult = (results: any) => {
    console.log({ results });
    onUpload(results);
  };

  return (
    <>
      <CSVReader onUploadAccepted={logResult}>
        {({ getRootProps }: any) => (
          <Button className="w-full lg:w-auto" size="sm" {...getRootProps()}>
            <Upload className="mr-2 size-4" />
            Upload
          </Button>
        )}
      </CSVReader>
    </>
  );
}
