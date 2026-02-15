import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { insertAccountBalanceSchema } from "@/db/schema";
import { convertAmountToMiliUnits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  balance: z.string(),
  note: z.string().nullable().optional(),
});

const apiSchema = insertAccountBalanceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
}

export default function AccountBalanceForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  onCreateAccount,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      date: defaultValues?.date ?? new Date(),
    },
  });

  const handleSubmit = (values: FormValues) => {
    const balance = Number.parseFloat(values.balance);
    const balanceInMiliUnits = convertAmountToMiliUnits(balance);

    onSubmit({ ...values, balance: balanceInMiliUnits });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 pt-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  disabled={disabled}
                  onChange={field.onChange}
                  value={field.value as Date | undefined}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  disabled={disabled || !!defaultValues?.accountId}
                  onChange={field.onChange}
                  onCreate={onCreateAccount}
                  options={accountOptions}
                  placeholder="Select an account"
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={disabled}
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  placeholder="e.g. Monthly reconciliation"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Balance Check"}
        </Button>

        {!!id && (
          <Button
            className="w-full"
            disabled={disabled}
            onClick={handleDelete}
            type="button"
            variant="outline"
          >
            <Trash className="mr-2 size-4" />
            Delete Balance Check
          </Button>
        )}
      </form>
    </Form>
  );
}
