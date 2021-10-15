let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];  //коллекция объектов, должна быть изначально пустой(без этого объекта)
let valueInput = ""; //вроде как содержимое инпута из разметки, здесь пустая строка
let input = null;  //переменная используется в событии load
let editInd = null; //флаг для определения редактируемого таска по индексу, используется в функции onEditItem

const onClickButton = () => { //функция, котрая вызывается при нажатии на кнопку add
  if (valueInput !== '') { //проверка на пустоту инпута - если он не пустой, то добавляется таск, если пустой, то нет
    allTasks.push({ //пушим таск в пустую коллекцию
        text: valueInput, //в поле текста добавляется содержимое инпута
        isCheck: false, //и рядом добавляется чекбокс(галочка) с значением ложь
      });
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      valueInput = ""; //очищает значение переменной, которая хранит в себе значение инпута
      input.value = ""; //очищается инпут визуально
      render(); //вызывается функция отрисовки
      //console.log('allTasks', allTasks);
  }
};

window.onload = function init() {  //событие load на объекте window наступает, когда загрузилась вся страница, включая стили, картинки и другие ресурсы. Почему ему присваивается функция?
  input = document.getElementById("add-task");  //переменной присваивается Id
  input.addEventListener("change", updateValue); //навешивается слушатель на измения на инпут, если сработал слушатель, вызывается функция updateValue
  render(); //вызывается функция отрисовки
  //localStorage.setItem('tasks', JSON.stringify(allTasks));
  //const tasks = JSON.parse(localStorage.getItem('tasks'));
  //input.addEventListener('keyup', updateValue1); //вернуться к этому моменту
  //input.addEventListener('keydown', updateValue2);
  //bulbazavr
};

const updateValue = (event) => { //функция принимает параметром событие (здесть это change)
  valueInput = event.target.value;//
  //console.log('value', valueInput);
};

const render = () => {    //функция отрисовки
  const content = document.getElementById("content-page");  //объявляем переменную и присваеваем ей div из разметки html по id
  content.innerHTML = ""; //получаем разметку дочерних элементов html и очищаем ее
  allTasks.map((item, index) => { //цикл
    const container = document.createElement("div"); //создаем контейнер для каждого таска
    container.id = `task-${index}`; //даем контейнеру для каждого таска по индексу свой id
    container.className = 'task-container'; //даем контейнеру класс

    if (editInd === index) { //если текст редактируется, то рисуем:
      const editInput = document.createElement("input"); //создаем инпут
      editInput.type = 'text'; //с типом текст
      editInput.value = item.text; //текст таска присваивается значению инпута
      container.appendChild(editInput); //показываем место инпуту(в контейнере)

      const imageDone = document.createElement("img"); //создаем картинку
      imageDone.src = "done.png"; //галочка
      imageDone.onclick = () => { //событие при нажатии, ссылка на функцию должна передавать функцию(без ссылки не будет работать)
      onDoneItem(editInput.value, index); //вызывается функция с параметрами значение редактируемого инпута и индекс редактирумого таска
      }
      container.appendChild(imageDone); //показываем место изображению(в контейнере)

    } else { //если текст не редактируется, то рисуем:
      const checkbox = document.createElement('input'); //создаем инпут 
      checkbox.type = 'checkbox'; //тип чекбокс(галочка)
      checkbox.checked = item.isCheck; //присваиваем значение isCheck(идет как ложь)
      checkbox.onchange = () => { //событие при нажатии, ссылка на функцию должна передавать функцию(без ссылки не будет работать)
      onChangeCheckbox(index); //вызывается функция с параметром индекса редактирумого таска
      }
      container.appendChild(checkbox); //показываем место чекбоксу(в контейнере)
      
      const text = document.createElement("p"); //создаем текстовое поле
      text.innerText = item.text; //значение ключа текст объекта таска присваивается полю, innerText - это свойство, позволяющее задавать или получать текстовое содержимое элемента
      text.className = item.isCheck ? "text-tasks done-text" : "text-tasks"; //условие - в зависимости от значения ключа isCheck объекта таска тексту присваевается класс для стилей
      container.appendChild(text); //показываем место чекбоксу(в контейнере)
    

      const imageEdit = document.createElement("img"); //создаем картинку
      imageEdit.src = "edit1.png"; //карандашик
      imageEdit.onclick = () => { //событие при нажатии, ссылка на функцию должна передавать функцию(без ссылки не будет работать)
      onEditItem(index);  //вызывается функция с параметром индекса редактирумого таска
      }
      container.appendChild(imageEdit);  //показываем место изображению(в контейнере)

      const imageDelete = document.createElement("img"); //создаем картинку
      imageDelete.src = "delete.png"; //крестик
      imageDelete.onclick = () => {  //событие при нажатии, ссылка на функцию должна передавать функцию(без ссылки не будет работать)
      onDeleteItem(index); //вызывается функция с параметром индекса редактирумого таска
      }
      container.appendChild(imageDelete); //показываем место изображению(в контейнере)
    };

    content.appendChild(container); //показываем место контейнеру(в контенте)
  });
};

const onChangeCheckbox = (index) => { //функция, вызываемая при событии изменение(ставим галочку или убираем), в параметре индекс, потому что меняем для конкретного таска с конкретным индексом 
  allTasks[index].isCheck = !allTasks[index].isCheck; //меняем ложь на проавду и наоборот
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render(); //вызываем функцию отрисовки после каждого изменения
};

const onDeleteItem = (index) => {  //функция, вызываемая при нажатии на крестик, в параметре индекс, потому что удаляем конкретный таск
  allTasks = allTasks.filter((item, ind) => ind !== index);  //в коллекцию передаются все таски, чей индекс не совпадает с индексом удаляемого таска
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();  //вызываем функцию отрисовки после каждого изменения
};

const onEditItem = (index) => {  //функция, вызываемая при нажатии на карандашик, в параметре индекс, потому что редактируем конкретный таск
  editInd = index;  //присваиваем флагу зачение индекса редактируемого таска
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render(); //вызываем функцию отрисовки после каждого изменения
};

const onDoneItem = (text, index) => {  //функция, вызываемая при нажатии на галочку, в параметрах текст и индекс, потому что сохраняем конкретный таск с содержимым текстом
    if (text !== '') {  //проверка на пустоту, если нет текста, не срабатывает
        allTasks[index].text = text; //присваеваем текст из параметров полю ключа объекта коллекции
        editInd = null; //очищаем флаг
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        render(); //вызываем функцию отрисовки после каждого изменения
    }
}

/*
const updateValue1 = (event) => {
    console.log('value-up', event.target.value);
}

const updateValue2 = (event) => {
    console.log('value-down', event.target.value);
}*/
