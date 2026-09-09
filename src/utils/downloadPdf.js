import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Converts any on-screen element (like the prescription preview) into a
// real downloadable PDF file — takes a screenshot and fits it into an
// A4-page PDF.
export async function downloadElementAsPdf(elementId, filename = "document.pdf") {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Preview element not found.");

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // If the content is longer than one page, continue onto the next pages.
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
