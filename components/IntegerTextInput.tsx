"use client";
import {useState, useEffect} from "react";

interface IntegerTextInputProps {
  value?: string | number;
  placeholder?: string | number;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
}

export default function IntegerTextInput({value = "", placeholder = "", min = 0, max = Number.POSITIVE_INFINITY, onChange}: IntegerTextInputProps) {
  const [currentValue, setCurrentValue] = useState<string>(String(value));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value.replace(/\D/g, "");
    if (input !== "") {
      if (Number(input) < min || Number(input) > max) {
        input = currentValue;
      }
    }
    setCurrentValue(input === "" ? input : Number(input).toString());
  }

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue]);

  return (
    <input type="text" placeholder={!placeholder ? "" : String(placeholder)} value={currentValue} onChange={handleChange} maxLength={max.toString().length}/>
  );
}
