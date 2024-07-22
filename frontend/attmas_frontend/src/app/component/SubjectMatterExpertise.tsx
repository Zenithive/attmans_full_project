import React, { useState, useRef, useEffect } from 'react';
import { Box, Chip, Checkbox, TextField } from '@mui/material';
import { options } from '@/app/constants/categories';

interface options {
  label: string;
  value: string;
  children?: options[];
}

interface SubjectMatterExpertiseProps {
  Option : string[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  options: options[];
  value: string[];
  onChange: (selectedSubjects: string[]) => void;
}

const SubjectMatterExpertise: React.FC<SubjectMatterExpertiseProps> = ({ selectedValues, setSelectedValues, options }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    let updatedSelectedValues = [...selectedValues];
    if (isChecked) {
      updatedSelectedValues.push(value);
    } else {
      updatedSelectedValues = updatedSelectedValues.filter(v => v !== value);
    }
    setSelectedValues(updatedSelectedValues);
  };

  const filterOptions = (options: options[], searchTerm: string): options[] => {
    return options.reduce<options[]>((acc, option) => {
      const match = option.label.toLowerCase().includes(searchTerm.toLowerCase());
      const children = option.children ? filterOptions(option.children, searchTerm) : [];
      if (match || children.length > 0) {
        acc.push({ ...option, children: children.length > 0 ? children : undefined });
      }
      return acc;
    }, []);
  };

  const renderOptions = (options: options[], level: number = 0) => {
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
            <Checkbox
              color='secondary'
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
    setButtonClicked(true);
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
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="button-with-label"
        style={{ minHeight: '57.5px', borderWidth: isOpen ? '2px' : '1px' }}
      >
        {isOpen && (
          <span className="button-label">Subject Matter Expertise</span>
        )}

        {selectedValues.length > 0 ? (
          selectedValues.map(value => (
            <Chip
              key={value}
              label={value}
              onDelete={() => handleCheckboxChange(value, false)}
              color="primary"
              style={{ marginRight: 5, marginBottom: 5 }}
            />
          ))
        ) : (
          !buttonClicked && (
            <span style={{ color: '#666666', fontSize: '1.2 rem' }}>Subject Matter Expertise</span>
          )
        )}
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
          width: 100%;
        }

        .dropdown-content {
          display: block;
          position: absolute;
          background-color: #ffffff;
          min-width: 100%;
          max-height: 300px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          padding: 12px 16px;
          z-index: 10;
          border: 1px solid #fff;
          border-radius: 16px;
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

        .button-with-label {
          position: relative;
          margin-right: 10px;
          width: 100%;
          border-radius: 20px;
          background-color: white;
          min-height: 57px;
          padding: 10px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          border: 1px solid #616161;
          transition: border-width 0.2s;
        }

        .button-with-label:hover {
          border-width: 2px;
        }

        .button-label {
          position: absolute;
          top: -10px;
          left: 10px;
          background: white;
          padding: 0 5px;
          color: #000;
          font-weight: normal;
          z-index: 1;
        }

        .dropdown-content input {
          width: 100%;
          padding: 5px;
          margin-bottom: 10px;
          border: 1px solid #616161;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default SubjectMatterExpertise;
