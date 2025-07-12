import jsPDF from "jspdf";

export const generateSampleQuestionsPDF = (questions) => {
  const doc = new jsPDF("p", "mm", "a4");
  let y = 20;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Sample Questions with Correct Answers", 10, 10);
  doc.setFontSize(10);

  questions.forEach((q, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("Helvetica", "bold");
    doc.text(`${index + 1}. ${q.questionCode || "Question"}`, 10, y);
    y += 6;

    const questionText = q.questionText.replace(/<[^>]+>/g, "");
    doc.setFont("Helvetica", "normal");
    doc.text(`Q: ${questionText}`, 10, y);
    y += 6;

    q.options.forEach((opt) => {
      const optText = opt.text?.replace(/<[^>]+>/g, "") || "";
      doc.text(`${opt.label}. ${optText}`, 15, y);
      y += 5;
    });

    doc.text(`✅ Correct Answer: ${q.correctAnswers.join(", ")}`, 10, y);
    y += 5;

    const explanation = q.explanation?.replace(/<[^>]+>/g, "");
    if (explanation) {
      doc.text(`📝 Explanation: ${explanation}`, 10, y);
      y += 5;
    }

    y += 6;
  });

  doc.save("sample-questions.pdf");
};
