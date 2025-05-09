import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
interface IInputProps {
  loading?: boolean;
  onSearch: (query: string) => void;
  value?: string;
}

const Input = ({ loading = false, onSearch, value }: IInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
    if (inputRef.current) {
      inputRef.current.value = value || "";
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="bg-input-background/70 backdrop-blur-sm border border-border rounded-full px-4 py-2  w-90 z-50">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for images"
        className="bg-transparent outline-none w-full disabled:opacity-50"
        onChange={handleInputChange}
        value={inputValue}
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <IconLoader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Input;
