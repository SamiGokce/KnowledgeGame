function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const easySheet = ss.getSheetByName('Easy');
    const mediumSheet = ss.getSheetByName('Medium');
    const hardSheet = ss.getSheetByName('Hard');

    function getQuestions(sheet) {
      if (!sheet) return [];
      const data = sheet.getDataRange().getValues();
      const questions = [];

      // Skip header row (index 0)
      for (let i = 1; i < data.length; i++) {
        const question = data[i][0];
        const answers = data[i][1];
        const imageUrl = data[i][2] || '';

        if (question && answers) {
          const q = {
            q: question.toString().trim(),
            a: answers.toString().split(',').map(a => a.trim()).filter(a => a)
          };

          // Only include image field if URL exists
          if (imageUrl && imageUrl.toString().trim()) {
            q.i = imageUrl.toString().trim();
          }

          // Column D: category
          const category = data[i][3] || '';
          if (category && category.toString().trim()) {
            q.c = category.toString().trim();
          }

          questions.push(q);
        }
      }
      return questions;
    }

    const result = {
      easy: getQuestions(easySheet),
      medium: getQuestions(mediumSheet),
      hard: getQuestions(hardSheet),
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
