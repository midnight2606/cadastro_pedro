import { db } from "../backend/firebaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

class Tarefa {
  #status;

  constructor(titulo, descricao, responsavel) {
    if (!titulo || !descricao || !responsavel) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    this.titulo = titulo;
    this.descricao = descricao;
    this.responsavel = responsavel;
    this.#status = "Pendente";
  }

  get status() {
    return this.#status;
  }

  alterarStatus() {
    const estados = ["Pendente", "Em Andamento", "Concluída"];
    const idx = estados.indexOf(this.#status);
    this.#status = estados[(idx + 1) % estados.length];
  }
}

const tarefas = [];

document.getElementById("tarefa-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const responsavel = document.getElementById("responsavel").value;

  try {
    const novaTarefa = new Tarefa(titulo, descricao, responsavel);
    tarefas.push(novaTarefa);

    await addDoc(collection(db, "tarefas"), {
      titulo,
      descricao,
      responsavel,
      status: novaTarefa.status
    });

    atualizarTabela();
    e.target.reset();
  } catch (erro) {
    alert(erro.message);
  }
});

async function atualizarTabela() {
  const tbody = document.querySelector("#tabela-tarefas tbody");
  tbody.innerHTML = "";
  tarefas.length = 0;

  const querySnapshot = await getDocs(collection(db, "tarefas"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tarefa = new Tarefa(data.titulo, data.descricao, data.responsavel);
    while (tarefa.status !== data.status) tarefa.alterarStatus();
    tarefas.push(tarefa);
  });

  tarefas.forEach((tarefa, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tarefa.titulo}</td>
      <td>${tarefa.responsavel}</td>
      <td>${tarefa.status}</td>
      <td>
        <button onclick="alterarStatus(${index})">Alterar Status</button>
        <button onclick="removerTarefa(${index})">Remover</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  atualizarResumo();
}

function alterarStatus(index) {
  tarefas[index].alterarStatus();
  atualizarTabela(); // ⚠️ Aqui não atualiza no Firebase ainda
}

function removerTarefa(index) {
  tarefas.splice(index, 1);
  atualizarTabela(); // ⚠️ Aqui também só remove localmente
}

function atualizarResumo() {
  const contagem = { "Pendente": 0, "Em Andamento": 0, "Concluída": 0 };
  tarefas.forEach(t => contagem[t.status]++);
  document.getElementById("resumo-status").textContent = 
    `Pendente: ${contagem["Pendente"]} | Em Andamento: ${contagem["Em Andamento"]} | Concluída: ${contagem["Concluída"]}`;
}

// Carrega as tarefas ao abrir
window.addEventListener("load", atualizarTabela);
