window.addEventListener('load', () => {
  console.log('Страница загружена, начинаю поиск...');

  var last = ""
  
  function findAndLogQuestion() {
    const question = document.querySelector('#trainer_question, .trainer_question, [data-id="trainer_question"]');
    
    if (question && question.textContent !== 'Здесь будет вопрос') {
      console.log('📝 ВОПРОС:', question.textContent.trim());
      return question.textContent.trim();
    }
    return false;
  }
  
  if (!findAndLogQuestion()) {
    const observer = new MutationObserver(() => {
      if (findAndLogQuestion()) {
        question = findAndLogQuestion()
        console.log('✅ Вопрос найден!');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL('answers.json'), false);
        xhr.send();
        console.log(xhr.status)

        const data = JSON.parse(xhr.responseText);
        console.log("ПРАВИЛЬНЫЙ ОТВЕТ:", data[question]);
        if (last != question)
        {
        alert("ПРАВИЛЬНЫЙ ОТВЕТ: " + data[question])
        last = question
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true, 
      attributeFilter: ["trainer_question"]
    });
    
    console.log('⏳ Ожидание появления вопроса...');
  }
  
  setTimeout(() => {
    findAndLogVariants();
  }, 1000);
});