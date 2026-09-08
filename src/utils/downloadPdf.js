import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Kisi bhi on-screen element (jaise prescription preview) ko real
// downloadable PDF file mein convert karta hai — screenshot leke
// usko ek A4 page ke PDF mein fit karta hai.
export async function downloadElementAsPdf(elementId, filename = "document.pdf") {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Preview element nahi mila.");

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

  // Agar content ek page se lamba ho, to next pages mein continue karo.
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
