type Props = {
    data?: {
      date: string;
      income: number;
      expenses: number;
    }[];
  };
  
export default function AreaVariant({ data }: Props) {
  return <div>area-variant</div>;
}
