let allTasks = [];
let valueInput = "";
let input = null;
let editInd = null;

const onClickButton = async () => {
  if (valueInput) {
    const response = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });
    let result = await response.json();
    allTasks = result.data;
    valueInput = "";
    input.value = "";
    render();
  }
};

window.onload = async function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const response = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });
  let result = await response.json();
  allTasks = result.data;
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  content.innerHTML = "";
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    if (editInd === index) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = item.text;
      container.appendChild(editInput);
      const imageDone = document.createElement("img");
      imageDone.src = "done.png";
      imageDone.onclick = () => {
        onDoneItem(editInput.value, index);
      };
      container.appendChild(imageDone);
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.isCheck;
      checkbox.onchange = () => {
        onChangeCheckbox(index);
      };
      container.appendChild(checkbox);

      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-tasks done-text" : "text-tasks";
      container.appendChild(text);

      const imageEdit = document.createElement("img");
      imageEdit.src = "edit1.png";
      imageEdit.onclick = () => {
        onEditItem(index);
      };
      container.appendChild(imageEdit);

      const imageDelete = document.createElement("img");
      imageDelete.src = "delete.png";
      imageDelete.onclick = () => {
        onDeleteItem(index);
      };
      container.appendChild(imageDelete);
    }

    content.appendChild(container);
  });
};

const onChangeCheckbox = async (index) => {
  const response = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id: allTasks[index].id,
      isCheck: !allTasks[index].isCheck,
    }),
  });
  let result = await response.json();
  allTasks = result.data;

  render();
};

const onDeleteItem = async (index) => {
  const response = await fetch(
    `http://localhost:8000/deleteTask?id=${allTasks[index].id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  let result = await response.json();
  allTasks = result.data;
  render();
};

const onEditItem = (index) => {
  editInd = index;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

const onDoneItem = async (text, index) => {
  if (text) {
    editInd = null;
    const response = await fetch("http://localhost:8000/updateTask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: allTasks[index].id,
        text,
      }),
    });
    let result = await response.json();
    allTasks = result.data;
    render();
  }
};
