import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Converts the prescription preview element into a high-resolution,
 * professionally formatted A4 PDF.
 */
export async function downloadElementAsPdf(elementId, filename = "prescription.pdf") {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Prescription preview element not found.");

  // Render element to high-res canvas (2x DPI scale for razor-sharp text and graphics)
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
  heightLeft -= pageHeight;

  // Multi-page support if prescription extends beyond 1 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
