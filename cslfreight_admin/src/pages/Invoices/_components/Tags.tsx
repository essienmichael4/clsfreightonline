import React, { useState, useEffect } from "react";

interface ITagsProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void; // notify parent
  maxTags?: number;
  placeholder?: string
}

const Tags: React.FC<ITagsProps> = ({
  value,
  defaultValue = [],
  onChange,
  maxTags = 10,
  placeholder="0200000000"
}) => {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const [tag, setTag] = useState("");

  // 🔄 Sync defaultValue when it changes
  useEffect(() => {
    if (!value) {
      setInternalTags(defaultValue);
    }
  }, [defaultValue, value]);

  const tags = value ?? internalTags;

  const updateTags = (newTags: string[]) => {
    if (!value) setInternalTags(newTags); // uncontrolled mode
    onChange?.(newTags); // notify parent
  };

  const addTag = (newTag: string) => {
    const cleanTag = newTag.trim();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < maxTags) {
      updateTags([...tags, cleanTag]);
    }
  };

  const addMultipleTags = (newTags: string[]) => {
    let updated = [...tags];
    newTags.forEach((t) => {
      const cleanTag = t.trim();
      if (cleanTag && !updated.includes(cleanTag) && updated.length < maxTags) {
        updated.push(cleanTag);
      }
    });
    updateTags(updated);
  };

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    updateTags(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      if (tag.trim()) {
        addTag(tag);
        setTag("");
      }
    }

    if (e.key === "Backspace" && tag === "" && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const splitTags = paste.split(/,|\s/).filter(Boolean);
    addMultipleTags(splitTags);
  };

  return (
    <div className="w-full flex flex-col gap-2 rounded-lg">
      <div className="flex flex-wrap gap-1">
        {tags.map((tagItem, index) => (
          <div
            key={index}
            className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full"
          >
            {tagItem}
            <button
              type="button"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tagItem}`}
              className="bg-gray-700 hover:bg-gray-900 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex w-full border h-10 items-center px-3 gap-3 rounded-md focus-within:border-gray-500">
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          value={tag}
          placeholder={placeholder}
          className="outline-none w-full text-sm bg-white flex-grow"
        />
      </div>

      <p className="text-xs text-start text-gray-500">
        Enter tags with comma, space, enter, or tab. Use backspace to remove the
        last tag. You can also paste multiple tags. (Max {maxTags} tags)
      </p>
    </div>
  );
};

export default Tags;
