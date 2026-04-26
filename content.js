window.addEventListener('load', () => {
  console.log('Страница загружена, начинаю поиск...');
  
  function findAndLogQuestion() {
    const question = document.querySelector('#trainer_question, .trainer_question, [data-id="trainer_question"]');
    
    if (question && question.textContent !== 'Здесь будет вопрос') {
      console.log('📝 ВОПРОС:', question.textContent.trim());
      return question.textContent.trim();
    }
    return false;
  }
  
  function findAndLogVariants() {
    const variants = document.querySelectorAll('.trainer_variant, [data-id="trainer_variants"] a');
    
    if (variants.length > 0) {
      const variantTexts = Array.from(variants).map(v => v.textContent);
      console.log('🔘 ВАРИАНТЫ ОТВЕТОВ:', variantTexts.join(', '));
      return true;
    }
    return false;
  }
  
  if (!findAndLogQuestion()) {
    const observer = new MutationObserver(() => {
      if (findAndLogQuestion()) {
        console.log('✅ Вопрос найден!');
        findAndLogVariants(); 
          const xhr = new XMLHttpRequest();
          xhr.open('GET', chrome.runtime.getURL('answers.json'), false);
          xhr.send();
          console.log(xhr.status)

          const data = JSON.parse(xhr.responseText);
          console.log("ПРАВИЛЬНЫЙ ОТВЕТ:", data[findAndLogQuestion()]);
          alert("ПРАВИЛЬНЫЙ ОТВЕТ: " + data[findAndLogQuestion()])
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('⏳ Ожидание появления вопроса...');
  }
  
  setTimeout(() => {
    findAndLogVariants();
  }, 1000);
});