interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

const CommentForm = ({ value, onChange, onSubmit, placeholder, isLoading }: Props) => (
  <div className="flex gap-2">
    <input
      type="text"
      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    <button
      onClick={onSubmit}
      disabled={!value.trim() || isLoading}
      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? "..." : "Post"}
    </button>
  </div>
);

export default CommentForm;
