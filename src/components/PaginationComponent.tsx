// PaginationComponent.tsx

import React, {useState} from 'react';
import { globalT } from '../lang';

interface PaginationProps {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rangeLimit: number;
}

const PaginationComponent: React.FC<PaginationProps> = ({ pages, currentPage, onPageChange, rangeLimit }) => {
    const [rangeStart, setRangeStart] = useState(1);

    const handlePageChange = (page: number) => {
        onPageChange(page);
        if (page <= rangeStart || page >= rangeStart + rangeLimit) {
            const newRangeStart = Math.max(1, Math.min(page, pages - rangeLimit + 1));
            setRangeStart(newRangeStart);
        }
    };
  return (
    <div className="pagination-component mt-5">
        <button
            className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
        >
            {globalT("preview")}
        </button>
        {Array.from({ length: Math.min(rangeLimit, pages - rangeStart + 1) }, (_, i) => rangeStart + i).map((page) => (
                <button
                    className={`page-button ${page === currentPage ? 'active' : ''}`}
                    key={page}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
        <button
            className={`page-button ${currentPage === pages ? 'disabled' : ''}`}
            disabled={currentPage === pages}
            onClick={() => handlePageChange(currentPage + 1)}
        >
            {globalT("next")}
        </button>
            <style>{`
                .pagination-component {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .page-button {
                    padding: 10px 20px;
                    margin: 0 5px;
                    border: none;
                    background: #ddd;
                    border-radius: 10px;
                    color: #000;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .page-button.active {
                    background: #227c9d;
                    border-radius: 10px;
                    color: #fff;
                }
                .page-button:hover {
                    background: #227c9d;
                    color: #fff;
                }
                .page-button.disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
            `}</style>
        </div>
  );
};

export default PaginationComponent;
