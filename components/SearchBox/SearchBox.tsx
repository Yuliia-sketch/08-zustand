import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value?: string;
  onSearch: (searchTerm: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };
  return (
    <input
      className={css.input}
      value={value}
      onChange={handleChange}
      type="text"
      placeholder="Search notes"
    />
  );
}