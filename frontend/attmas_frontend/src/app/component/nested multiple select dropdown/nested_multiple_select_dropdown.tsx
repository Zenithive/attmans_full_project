import React, { useState, useRef, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type Option = {
  label: string;
  value: string;
  children?: Option[];
};

type NestedMultiselectDropdownProps = {
  options: Option[];
  onChange: (selectedValues: string[]) => void;
};

const NestedMultiselectDropdown: React.FC<NestedMultiselectDropdownProps> = ({ options, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    let updatedSelectedValues = [...selectedValues];
    if (isChecked) {
      updatedSelectedValues.push(value);
    } else {
      updatedSelectedValues = updatedSelectedValues.filter(v => v !== value);
    }
    setSelectedValues(updatedSelectedValues);
    onChange(updatedSelectedValues);
  };

  const filterOptions = (options: Option[], searchTerm: string): Option[] => {
    return options.reduce<Option[]>((acc, option) => {
      const match = option.label.toLowerCase().includes(searchTerm.toLowerCase());
      const children = option.children ? filterOptions(option.children, searchTerm) : [];
      if (match || children.length > 0) {
        acc.push({ ...option, children: children.length > 0 ? children : undefined });
      }
      return acc;
    }, []);
  };

  const renderOptions = (options: Option[], level: number = 0) => {
    return options.map(option => (
      <div key={option.value} style={{ paddingLeft: `${level * 20}px` }}>
        {option.children ? (
          <div>
            <div className="parent-option" style={{ fontWeight: 'bold' }}>
              {option.label}
            </div>
            {renderOptions(option.children, level + 1)}
          </div>
        ) : (
          <label>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={e => handleCheckboxChange(option.value, e.target.checked)}
            />
            {option.label}
          </label>
        )}
      </div>
    ));
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = filterOptions(options, searchTerm);

  return (
    <div className="nested-multiselect-dropdown" ref={dropdownRef}>
      <div className="selected-values">
        <strong>Selected Values: </strong>
        {selectedValues.length > 0 ? (
          <Stack direction="row" spacing={1}>
            {selectedValues.map(value => (
              <Chip
                key={value}
                label={value}
                onDelete={() => handleCheckboxChange(value, false)} // Handle chip deletion
              />
            ))}
          </Stack>
        ) : (
          'None'
        )}
      </div>
      <button onClick={handleToggleDropdown}>
        Subject matter expertise
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="options-container">
            {renderOptions(filteredOptions)}
          </div>
        </div>
      )}
      <style jsx>{`
        .nested-multiselect-dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-content {
          display: block;
          position: absolute;
          background-color: #f9f9f9;
          min-width: 560px;
          max-height: 300px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          padding: 12px 16px;
          z-index: 1;
          border: 1px solid #ccc;
          overflow-y: auto;
        }

        .options-container {
          max-height: 200px;
          overflow-y: auto;
        }

        .nested-multiselect-dropdown label {
          display: block;
          margin-bottom: 5px;
        }

        .parent-option {
          cursor: pointer;
        }

        .parent-option:hover {
          background-color: #f1f1f1;
        }

        .selected-values {
          margin-bottom: 10px;
        }

        .selected-values strong {
          display: inline-block;
          margin-right: 5px;
        }

        button {
          margin-right: 10px;
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        .dropdown-content input {
          width: 100%;
          padding: 5px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default NestedMultiselectDropdown;