let sound = document.querySelector("#sound");
let form = document.querySelector("#form2");
let input = document.querySelector("#text");
let listContainer = document.querySelector(".todolist");
let username = localStorage.getItem("username");
let clikded = false;
if (!username) {
  username = prompt("Введите ваше имя");
  localStorage.setItem("username", username);
}

async function createTODO(username) {
  const response = await fetch(
    "https://696e3d67d7bacd2dd7163424.mockapi.io/todo/todo",
  );

  const todos = (await response.json()).filter(
    (todo) => todo.username === username,
  );

  listContainer.innerHTML = todos
    .map(
      (item) => `
    <div class="list" data-id="${item.id}">
      <input type="text"  class="text2" disabled value="${item.text}">
      <div class="buttons">
        <button class="delete">Delete</button>
        <button class="edit">
          <i class="fa-solid fa-pencil"></i> Edit
        </button>
        <input type="checkbox" class="isdone" ${item.done ? "checked" : ""} />
      </div>
      <h1 class="time">Последний раз изменено: ${item.last_edited_time}</h1>
    </div>
  `,
    )
    .join("");
  listContainer.querySelectorAll(".list").forEach((item) => {
    item.querySelector(".text2").style.textDecoration = item.querySelector(
      ".isdone",
    ).checked
      ? "line-through"
      : "none";
  });
}

function getDateTime() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  sound.currentTime = 0;
  sound.play();

  const text = input.value.trim();
  if (!text) {
    alert("Пожалуйста введите текст");
    return;
  }

  const newTodo = {
    username: username,
    text: text,
    done: false,
    last_edited_time: getDateTime(),
  };
  input.value = "";

  await fetch("https://696e3d67d7bacd2dd7163424.mockapi.io/todo/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });

  createTODO(username);
});

createTODO(username);

listContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    sound.currentTime = 0;
    sound.play();
    let item = e.target.closest(".list");
    let id = Number(item.dataset.id);
    await fetch(
      `${"https://696e3d67d7bacd2dd7163424.mockapi.io/todo/todo/" + id}`,
      {
        method: "DELETE",
      },
    );
    createTODO(username);
  } else if (e.target.classList.contains("edit") && !clikded) {
    console.log("edit");
    sound.currentTime = 0;
    sound.play();
    let item = e.target.closest(".list");
    let input = item.querySelector(".text2");
    input.removeAttribute("disabled");
    clikded = true;
  } else if (e.target.classList.contains("edit") && clikded) {
    sound.currentTime = 0;
    sound.play();
    let item = e.target.closest(".list");
    let id = Number(item.dataset.id);
    let input = item.querySelector(".text2");
    input.setAttribute("disabled", "true");
    await fetch(`https://696e3d67d7bacd2dd7163424.mockapi.io/todo/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input.value,
        last_edited_time: getDateTime(),
      }),
    });
    clikded = false;
    createTODO(username);
  } else if (e.target.classList.contains("isdone")) {
    sound.currentTime = 0;
    sound.play();
    let item = e.target.closest(".list");
    let id = Number(item.dataset.id);
    let isdone = item.querySelector(".isdone");
    let input = item.querySelector(".text2");
    input.style.textDecoration = isdone.checked ? "line-through" : "none";
    await fetch(`https://696e3d67d7bacd2dd7163424.mockapi.io/todo/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        done: isdone.checked,
        last_edited_time: getDateTime(),
      }),
    });
    createTODO(username);
  }
});
