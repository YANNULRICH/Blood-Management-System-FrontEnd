import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const EncryptedPdfViewer = ({ base64EncryptedPdf }) => {
    const [numPages, setNumPages] = useState(null);
    const [pdfData, setPdfData] = useState(null);

    // useEffect(() => {
    //     const pdfBlobUrl = `data:application/pdf;base64,${base64EncryptedPdf}`;
    //     setPdfData(pdfBlobUrl);
    // }, [base64EncryptedPdf]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Document
                file={base64EncryptedPdf}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page  key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}

            </Document>
        </div>
    );
};

export default EncryptedPdfViewer;