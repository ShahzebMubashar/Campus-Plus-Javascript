// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { useLocation } from "react-router-dom";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// // Import the worker explicitly for React-PDF (v5+)
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// // Assign the worker
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// const View = () => {
//     const location = useLocation();
//     const fileURL = location.state?.fileURL; // Retrieve the file URL from the state

//     const [numPages, setNumPages] = useState(null); // Total pages in the document
//     const [pageNumber, setPageNumber] = useState(1); // Current page being displayed

//     if (!fileURL) {
//         return <p>No file provided for viewing. Please go back and select a valid file.</p>;
//     }

//     const onDocumentLoadSuccess = ({ numPages }) => {
//         setNumPages(numPages);
//         setPageNumber(1); // Reset to the first page
//     };

//     const handleNextPage = () => {
//         if (pageNumber < numPages) setPageNumber(pageNumber + 1);
//     };

//     const handlePreviousPage = () => {
//         if (pageNumber > 1) setPageNumber(pageNumber - 1);
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <h1>PDF Viewer</h1>
//             <div
//                 style={{
//                     display: "inline-block",
//                     border: "1px solid #ccc",
//                     margin: "20px auto",
//                     padding: "10px",
//                 }}
//             >
//                 <Document
//                     file={fileURL}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                     options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }}
//                 >
//                     <Page pageNumber={pageNumber} />
//                 </Document>
//                 <p>
//                     Page {pageNumber} of {numPages}
//                 </p>
//                 <div>
//                     <button
//                         onClick={handlePreviousPage}
//                         disabled={pageNumber <= 1}
//                         style={{ marginRight: "10px" }}
//                     >
//                         Previous
//                     </button>
//                     <button
//                         onClick={handleNextPage}
//                         disabled={pageNumber >= numPages}
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default View;
