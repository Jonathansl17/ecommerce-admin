import { USERS_MESSAGES } from '@/features/users/constants/messages';
import type { UserSearchBarProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.search;

export function UserSearchBar({ field, inputValue, onFieldChange, onInputChange, onSearch }: UserSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <>
      <div className="flex overflow-hidden rounded-md border border-foreground/20">
        <button
          onClick={() => onFieldChange('name')}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            field === 'name'
              ? 'bg-foreground/10 text-foreground'
              : 'text-foreground/60 hover:bg-foreground/5'
          }`}
        >
          {strings.fieldName}
        </button>
        <button
          onClick={() => onFieldChange('email')}
          className={`border-l border-foreground/20 px-3 py-2 text-sm font-medium transition-colors ${
            field === 'email'
              ? 'bg-foreground/10 text-foreground'
              : 'text-foreground/60 hover:bg-foreground/5'
          }`}
        >
          {strings.fieldEmail}
        </button>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={field === 'name' ? strings.placeholderName : strings.placeholderEmail}
        className="w-64 rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={onSearch}
        className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        {strings.button}
      </button>
    </>
  );
}
