import { Document, Packer, Paragraph, TextRun } from "docx";

export function showCopyConfirmation() {
  const confirmation = document.getElementById("copy-confirmation");
  confirmation.classList.add("show");
  setTimeout(() => {
    confirmation.classList.remove("show");
  }, 2000);
}
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyConfirmation();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}
export function copyApplication(emailBody) {
  copyToClipboard(emailBody);
}
export async function downloadApplication(emailBody) {
  // Get the application body content

  // Split the content into paragraphs
  const paragraphs = emailBody.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
      }),
  );

  // Create a new Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });
  Packer.toBlob(doc)
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Email.docx";
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    })
    .catch((err) => {
      console.error("Error creating .docx file:", err);
    });
}
