import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { insertTransactionSchema } from "@/db/schema";
import { cn } from "@/lib/utils";
import { convertAmountToMiliUnits } from "@/lib/utils/currency";

const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().positive().optional(),
  totalPrice: z.string().min(1, "Price is required"),
});

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
  items: z.array(itemFormSchema).nullable().optional(),
});
const apiSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
  focusField?: string;
}

export default function TransactionForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
  focusField,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      date: defaultValues?.date ?? new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [showItems, setShowItems] = useState(
    () => !!defaultValues?.items?.length
  );

  useEffect(() => {
    if (focusField) {
      // Small delay to ensure the form is fully mounted
      const timer = setTimeout(() => {
        form.setFocus(focusField as keyof FormValues);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusField, form]);

  const handleSubmit = (values: FormValues) => {
    const amount = Number.parseFloat(values.amount);
    const amountInMiliUnits = convertAmountToMiliUnits(amount);

    const items = values.items?.length
      ? values.items.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity) || undefined,
          totalPrice: convertAmountToMiliUnits(
            Number.parseFloat(item.totalPrice)
          ),
        }))
      : null;

    onSubmit({ ...values, amount: amountInMiliUnits, items });
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
                  disabled={disabled}
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  disabled={disabled}
                  onChange={field.onChange}
                  onCreate={onCreateCategory}
                  options={categoryOptions}
                  placeholder="Select category"
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  placeholder="Add notes"
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showItems ? (
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-2">
              <span className="font-medium text-sm">
                Lines <span className="text-xs">{fields.length}</span>
              </span>
              <Button
                className="h-auto p-1 text-muted-foreground text-xs"
                onClick={() => {
                  setShowItems(false);
                  form.setValue("items", null);
                }}
                type="button"
                variant="ghost"
              >
                Remove All
              </Button>
            </div>
            <Separator />
            <div className="space-y-1">
              {fields.map((field, index) => (
                <div
                  className="flex items-center gap-2 border-b px-3"
                  key={field.id}
                >
                  <ItemInput
                    className="w-8 shrink-0"
                    disabled={disabled}
                    min={1}
                    placeholder="1"
                    type="number"
                    {...form.register(`items.${index}.quantity`)}
                  />
                  <ItemInput
                    className="min-w-0 flex-1"
                    disabled={disabled}
                    placeholder="Item name"
                    {...form.register(`items.${index}.name`)}
                  />
                  <ItemCurrencyInput
                    className="flex w-24 shrink-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    decimalScale={2}
                    decimalsLimit={2}
                    disabled={disabled}
                    onValueChange={(value) =>
                      form.setValue(`items.${index}.totalPrice`, value ?? "")
                    }
                    placeholder="0.00"
                    value={form.watch(`items.${index}.totalPrice`)}
                  />
                  <Button
                    className="size-1 p-0"
                    disabled={disabled}
                    onClick={() => {
                      remove(index);
                      if (fields.length <= 1) {
                        setShowItems(false);
                        form.setValue("items", null);
                      }
                    }}
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-1" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              className="w-full gap-2 text-muted-foreground"
              disabled={disabled}
              onClick={() => append({ name: "", totalPrice: "" })}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Plus className="size-4" />
              Add item
            </Button>
          </div>
        ) : (
          <Button
            className="w-full gap-2 text-muted-foreground"
            disabled={disabled}
            onClick={() => {
              setShowItems(true);
              if (fields.length === 0) {
                append({ name: "", totalPrice: "" });
              }
            }}
            type="button"
            variant="outline"
          >
            <ListPlus className="size-4" />
            Add items
          </Button>
        )}

        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create transaction"}
        </Button>
        {!!id && (
          <Button
            className="w-full"
            disabled={disabled}
            onClick={handleDelete}
            type="button"
            variant={"outline"}
          >
            <Trash className="mr-2 size-4" />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
}

interface ItemInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function ItemInput({ className, ...props }: ItemInputProps) {
  return (
    <Input
      className={cn("m-0 h-fit border-none p-0 text-xs", className)}
      {...props}
    />
  );
}

function ItemCurrencyInput({
  className,
  ...props
}: React.ComponentProps<typeof CurrencyInput>) {
  return (
    <CurrencyInput
      className={cn("m-0 border-none p-0 text-right text-sm", className)}
      decimalScale={2}
      decimalsLimit={2}
      placeholder="0.00"
      {...props}
    />
  );
}
