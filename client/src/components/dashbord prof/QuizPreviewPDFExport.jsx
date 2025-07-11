import { jsPDF } from "jspdf";

export function exportQuizToPDF(quizData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Title - bold, larger font, dark blue
  doc.setFontSize(18);
  doc.setTextColor(10, 38, 102);
  doc.setFont("helvetica", "bold");
  doc.text(quizData.title || 'Quiz', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Metadata - smaller font, gray color
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  if (quizData.settings?.dueDate) {
    const dueDate = new Date(quizData.settings.dueDate);
    if (!isNaN(dueDate.getTime())) {
      doc.text(`Due Date: ${dueDate.toLocaleString()}`, margin, y);
      y += 7;
    }
  }
  if (quizData.settings?.difficulty) {
    doc.text(`Difficulty: ${quizData.settings.difficulty}`, margin, y);
    y += 7;
  }
  if (quizData.settings?.type) {
    doc.text(`Type: ${quizData.settings.type}`, margin, y);
    y += 10;
  }

  // Questions header - medium font, black
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text('Questions:', margin, y);
  y += 10;

  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.getHeight();

  quizData.questions.forEach((q, idx) => {
    // Question number - bold, dark red
    doc.setFontSize(12);
    doc.setTextColor(139, 0, 0);
    doc.setFont("helvetica", "bold");
    const questionNumber = `${idx + 1}. `;
    const questionText = q.question;
    const questionNumberWidth = doc.getTextWidth(questionNumber);
    const maxWidth = pageWidth - 2 * margin - questionNumberWidth;
    const splitQuestion = doc.splitTextToSize(questionText, maxWidth);

    if (y + splitQuestion.length * lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(questionNumber, margin, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(splitQuestion, margin + questionNumberWidth, y);
    y += splitQuestion.length * lineHeight;

    // Answers - bullet points, indented, dark gray
    const answers = q.answers || q.options || [];
    answers.forEach((answer) => {
      const bullet = '\u2022 ';
      const answerText = bullet + answer;
      const splitAnswer = doc.splitTextToSize(answerText, pageWidth - 2 * margin - 20);
      if (y + splitAnswer.length * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setTextColor(80, 80, 80);
      doc.text(splitAnswer, margin + 20, y);
      y += splitAnswer.length * lineHeight;
    });

    y += 8;
  });

  // Footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`${quizData.title || 'quiz'}.pdf`);
}
