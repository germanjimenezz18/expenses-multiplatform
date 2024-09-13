import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorClosed } from "lucide-react";


const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";
const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export default function ImportCard({ data, onCancel, onSubmit }: Props) {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
      <div className="max-w-screen-1xl  w-full">
        <Card className=" drop-shadow-sm">
          <CardHeader className=" gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Import Transaction
            </CardTitle>
            <div className="flex items-center gap-x-2">
              <Button size={"sm"} onClick={onCancel}>
                <DoorClosed className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>Hello</CardContent>
        </Card>
      </div>
    </div>
  );
}
