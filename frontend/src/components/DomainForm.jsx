import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';

const DomainForm = ({ onSubmit, isLoading, placeholder = "Enter domain to check", buttonText = "Check Domain" }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (domain.trim()) {
      await onSubmit(domain.trim());
    }
  };

  const handleChange = (e) => {
    setDomain(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={domain}
            onChange={handleChange}
            placeholder={placeholder}
            className="input pl-10"
            disabled={isLoading}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !domain.trim()}
        className="btn btn-primary disabled:opacity-50"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
};

export default DomainForm;
