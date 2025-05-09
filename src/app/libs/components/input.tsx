import { IconLoader2 } from "@tabler/icons-react";

interface IInputProps {
  loading?: boolean;
  onSearch: (query: string) => void;
}

const Input = ({ loading = false, onSearch }: IInputProps) => {
  return (
    <div className="bg-input-background/70 backdrop-blur-sm border border-border rounded-full px-4 py-2 fixed bottom-4 right-0 left-0 m-auto w-90 z-50">
      <input
        type="text"
        placeholder="Search for images"
        className="bg-transparent outline-none w-full"
        onChange={(e) => onSearch(e.target.value)}
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
