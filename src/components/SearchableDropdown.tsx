import React, {
    useEffect,
    useRef,
    useState,
  } from "react";
  
  export type SearchableDropdownOption = {
    label: string;
    value: string | number;
  };
  
  type SearchableDropdownProps = {
    options: SearchableDropdownOption[];
  
    value?: string | number;
  
    placeholder?: string;
  
    className?: string;
  
    debounceDelay?: number;
  
    isLoading?: boolean;
  
    onSearch?: (
      searchText: string
    ) => void;
  
    onChange?: (
      option: SearchableDropdownOption
    ) => void;
  };
  
  const SearchableDropdown = ({
    options,
    value,
    placeholder = "Search...",
    className = "",
    debounceDelay = 500,
    isLoading = false,
    onSearch,
    onChange,
  }: SearchableDropdownProps) => {
    const wrapperRef =
      useRef<HTMLDivElement>(null);
  
    const debounceRef =
      useRef<NodeJS.Timeout | null>(null);
  
    const [searchText, setSearchText] =
      useState("");
  
    const [showDropdown, setShowDropdown] =
      useState(false);
  
    useEffect(() => {
      const selectedOption =
        options.find(
          (item) => item.value === value
        );
  
      if (selectedOption) {
        setSearchText(
          selectedOption.label
        );
      }
    }, [value, options]);
  
    useEffect(() => {
      const handleOutsideClick = (
        event: MouseEvent
      ) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(
            event.target as Node
          )
        ) {
          setShowDropdown(false);
        }
      };
  
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
  
      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutsideClick
        );
      };
    }, []);
  
    const handleSearch = (
      text: string
    ) => {
      setSearchText(text);
  
      setShowDropdown(true);
  
      if (debounceRef.current) {
        clearTimeout(
          debounceRef.current
        );
      }
  
      debounceRef.current =
        setTimeout(() => {
          onSearch?.(text);
        }, debounceDelay);
    };
  
    const handleSelect = (
      option: SearchableDropdownOption
    ) => {
      setSearchText(option.label);
  
      setShowDropdown(false);
  
      onChange?.(option);
    };
  
    return (
      <div
        ref={wrapperRef}
        className={`relative ${className}`}
      >
        <input
          type="text"
          value={searchText}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() =>
            setShowDropdown(true)
          }
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
        />
  
        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading...
              </div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                  onClick={() =>
                    handleSelect(option)
                  }
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No Data Found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
export default SearchableDropdown;
