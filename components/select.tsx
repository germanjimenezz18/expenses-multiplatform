"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate: (name: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string, value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      className="text-sm h-10 "
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "border-primary",
          backgroundColor: "Background",
          color: "text-primary",
          ":hover": { borderColor: "green", 
           },
           ":focus": { borderColor: "border-primary",}
        }),
        
        menu: (base) => ({
          ...base,
          color:  "text-primary",
          backgroundColor: "Background",


        }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "ButtonFace" : "Background",
          color: "text-primary",
        }),

    
      }}
      value={formattedValue}
      onChange={onSelect}
      theme={(theme) => ({
        ...theme,
        borderRadius: 10,
        colors: {
          ...theme.colors,
          primary: 'black',
          background: 'Background',
        },
      })}
      options={options}
      onCreateOption={onCreate}
      placeholder={placeholder}
      isDisabled={disabled}
    />
  );
};
