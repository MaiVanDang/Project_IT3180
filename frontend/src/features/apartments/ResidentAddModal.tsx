import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./style.css";

// Types
interface Resident {
  id: number;
  name: string;
  dob: string;
}

interface ResidentAddModalProps {
  onResidentsSelect: (residents: Resident[]) => void;
}

// Constants
const API_BASE_URL = "http://localhost:8080/api/v1";
const API_ENDPOINTS = {
  residents: `${API_BASE_URL}/residents`,
};

// Component
export default function ResidentAddModal({ onResidentsSelect }: ResidentAddModalProps) {
  // State
  const [searchValue, setSearchValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidents, setSelectedResidents] = useState<Resident[]>([]);

  // API Calls
  const fetchResidents = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.residents}?size=100&page=1`);
      const residentsData = response.data.data.result;

      const formattedResidents = residentsData.map((resident: any) => ({
        id: resident.id,
        name: resident.name,
        dob: resident.statusDate,
      }));

      setResidents(formattedResidents);
      setSuggestions(formattedResidents.map((resident: Resident) => resident.name));
    } catch (error) {
      toast.error("Error loading residents list");
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // Event Handlers
  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = residents
      .filter(resident => 
        resident.name.toLowerCase().includes(value.toLowerCase())
      )
      .map(resident => resident.name);

    setSuggestions(filteredSuggestions);
  };

  const handleSelect = (residentName: string) => {
    const selectedResident = residents.find(resident => resident.name === residentName);
    
    if (selectedResident && !selectedResidents.some(r => r.id === selectedResident.id)) {
      setSelectedResidents(prev => [...prev, selectedResident]);
    }
    
    setSearchValue("");
    setSuggestions([]);
  };

  const handleRemove = (residentId: number) => {
    setSelectedResidents(prev => prev.filter(item => item.id !== residentId));
  };

  const handleSave = () => {
    onResidentsSelect(selectedResidents);
    toast.success("Residents added successfully");
  };

  // Render Methods
  const renderSearchInput = () => (
    <div className="searchDiv">
      <p className="text-cpn">Search Resident:</p>
      <div className="search-ctn">
        <input
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search here..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((name, index) => (
              <li
                key={index}
                onClick={() => handleSelect(name)}
                className="suggestion-item"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderSelectedResidents = () => (
    <div className="inforDiv">
      <p className="text-cpn">Selected Residents:</p>
      <div className="selectedRes">
        {selectedResidents.length > 0 ? (
          selectedResidents.map((resident) => (
            <div key={resident.id} className="selectedResidentItem">
              {resident.name} (ID: {resident.id})
              <span
                className="remove-icon"
                onClick={() => handleRemove(resident.id)}
              >
                &times;
              </span>
            </div>
          ))
        ) : (
          <p>No residents selected</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="wrp">
      {renderSearchInput()}
      {renderSelectedResidents()}
      <div className="wrp-btn">
        <button className="saveButton" type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}