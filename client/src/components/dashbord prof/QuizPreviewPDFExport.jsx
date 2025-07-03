import { jsPDF } from "jspdf";

export function exportQuizToPDF(quizData) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = margin;

  doc.setFontSize(16);
  doc.text(quizData.title || 'Quiz', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  if (quizData.settings?.dueDate) {
    const dueDate = new Date(quizData.settings.dueDate);
    if (!isNaN(dueDate.getTime())) {
      doc.text(`Due Date: ${dueDate.toLocaleString()}`, margin, y);
      y += 8;
    }
  }
  if (quizData.settings?.difficulty) {
    doc.text(`Difficulty: ${quizData.settings.difficulty}`, margin, y);
    y += 8;
  }
  if (quizData.settings?.type) {
    doc.text(`Type: ${quizData.settings.type}`, margin, y);
    y += 10;
  }

  doc.setFontSize(14);
  doc.text('Questions:', margin, y);
  y += 8;

  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();

  quizData.questions.forEach((q, idx) => {
    const questionText = `${idx + 1}. ${q.question}`;
    const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 2 * margin);
    if (y + splitQuestion.length * lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(12);
    doc.text(splitQuestion, margin, y);
    y += splitQuestion.length * lineHeight;

    const answers = q.answers || q.options || [];
    answers.forEach((answer) => {
      const answerText = `- ${answer}`;
      const splitAnswer = doc.splitTextToSize(answerText, pageWidth - 2 * margin - 10);
      if (y + splitAnswer.length * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(splitAnswer, margin + 10, y);
      y += splitAnswer.length * lineHeight;
    });

    y += 5;
  });

  doc.save(`${quizData.title || 'quiz'}.pdf`);
}
