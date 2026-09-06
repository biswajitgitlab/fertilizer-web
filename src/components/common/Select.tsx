import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: SelectOption[];
  helperText?: string;
  placeholder?: string;
  sizeVariant?: 'md' | 'sm';
  native?: boolean;
  searchable?: boolean;
  value?: string | number;
  onChange?: (e: any) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  icon,
  options,
  children,
  className = '',
  id,
  disabled = false,
  sizeVariant = 'md',
  helperText,
  placeholder = 'Select an option...',
  native = false,
  searchable,
  value,
  onChange,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isSmall = sizeVariant === 'sm';

  // If native mode is forced, or if raw <option> children are passed instead of options array
  const useNative = native || !options;

  // Custom Popover State
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (useNative) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [useNative]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const selectedOption = options?.find((opt) => String(opt.value) === String(value));

  const shouldShowSearch = searchable ?? ((options?.length || 0) > 7);

  const filteredOptions = options?.filter((opt) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchLabel = opt.label.toLowerCase().includes(q);
    const matchSublabel = opt.sublabel?.toLowerCase().includes(q) || false;
    const matchBadge = opt.badge?.toLowerCase().includes(q) || false;
    return matchLabel || matchSublabel || matchBadge;
  }) || [];

  const handleSelect = (val: string | number) => {
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          value: val,
          name: props.name
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  };

  if (useNative) {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative rounded-xl shadow-xs">
          {/* Leading Icon */}
          {icon && (
            <div className={`absolute inset-y-0 left-0 ${isSmall ? 'pl-2.5' : 'pl-3.5'} flex items-center pointer-events-none text-slate-400 dark:text-slate-500 z-10`}>
              {icon}
            </div>
          )}

          <select
            id={selectId}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={`w-full ${isSmall ? 'h-9 text-xs pl-3 pr-8 py-1.5' : 'h-11 text-sm pl-3.5 pr-10 py-2.5'} ${
              icon ? (isSmall ? 'pl-8' : 'pl-10') : ''
            } font-medium bg-white dark:bg-slate-900 border ${
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500'
            } rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed appearance-none bg-none ${className}`}
            style={{ backgroundImage: 'none' }}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Trailing Chevron Icon */}
          <div className={`absolute inset-y-0 right-0 ${isSmall ? 'pr-2.5' : 'pr-3.5'} flex items-center pointer-events-none text-slate-400 dark:text-slate-500`}>
            <ChevronDown className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform duration-200`} />
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
      </div>
    );
  }

  // Modern Designer Popover Mode
  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {label && (
        <label
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Hidden input for standard HTML form synchronization */}
      {props.name && (
        <input type="hidden" name={props.name} value={value ?? ''} />
      )}

      <div className="relative">
        {/* Custom Trigger Button */}
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full ${
            isSmall ? 'h-9 text-xs px-3' : 'h-11 text-sm px-3.5'
          } rounded-xl font-medium text-left flex items-center justify-between transition-all duration-200 ${
            disabled
              ? 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-white dark:bg-slate-900 border hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer shadow-2xs'
          } ${
            error
              ? 'border-rose-500 ring-2 ring-rose-500/10'
              : isOpen
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'border-slate-200 dark:border-slate-700'
          } ${className}`}
        >
          {/* Left Side: Leading Icon & Selected Value Preview */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            {icon && (
              <span className="text-slate-400 dark:text-slate-500 shrink-0">
                {icon}
              </span>
            )}

            {selectedOption?.icon && !icon && (
              <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
                {selectedOption.icon}
              </span>
            )}

            <div className="truncate flex items-center gap-1.5 min-w-0">
              {selectedOption ? (
                <>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
                    {selectedOption.label}
                  </span>
                  {selectedOption.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
                      {selectedOption.badge}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">
                  {placeholder}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Chevron with Animated 180 Rotation */}
          <ChevronDown
            className={`${
              isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'
            } text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
            }`}
          />
        </button>

        {/* Modern Popover Panel */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
          >
            {/* Integrated Search Box when items > 7 */}
            {shouldShowSearch && (
              <div className="relative px-1 pt-0.5 pb-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Rich Item List */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between group transition-all duration-150 ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/25 shadow-2xs'
                          : 'hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:translate-x-0.5 border border-transparent'
                      }`}
                    >
                      {/* Left: Icon, Label & Sublabel */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        {opt.icon && (
                          <div
                            className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-600'
                            }`}
                          >
                            {opt.icon}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="truncate flex items-center gap-1.5">
                            <span className={isSelected ? 'font-black' : 'font-semibold'}>
                              {opt.label}
                            </span>
                            {opt.badge && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                {opt.badge}
                              </span>
                            )}
                          </div>

                          {opt.sublabel && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 font-normal truncate mt-0.5">
                              {opt.sublabel}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Selected Checkmark indicator */}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
    </div>
  );
};
