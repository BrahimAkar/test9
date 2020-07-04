let allRows = document.querySelectorAll('.js-file-line');  
let arrayOfObjects = [];
  allRows.forEach(el => {
   
    arrayOfObjects.push({
      IP: el.textContent.substring(0, el.textContent.indexOf(':')),
         PORT: el.textContent.substring(el.textContent.indexOf(':') + 1, el.lenght).trim()
    });
  });

copy(arrayOfObjects)