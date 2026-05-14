import { stdin, stdout } from "process"; //standardIn E standardOut -> entrada padrão e saída padrão
import { createInterface } from "node:readline/promises";
import { writeFile, readFile } from "node:fs/promises"; // file-system

async function buscarUsuario(username) {
  const urlBase = "https://api.github.com/users/";

  try {
    const response = await fetch(`${urlBase}${username}`);

    if (!response.ok) {
      throw new Error("Deu errado");
    }

    const body = await response.json();

    return body;
  } catch (error) {
    console.log(error);
  }
}

async function lerArquivo() {
  try {
    const usuariosText = await readFile("./database.json", {
      encoding: "utf-8",
    });
    return JSON.parse(usuariosText);
  } catch (error) {
    console.error("Arquivo corrompido, não foi possível ler os dados");
  }
}
async function salvarArquivo(usuario) {
  const usuarios = await lerArquivo();

  if (!usuarios) {
    await writeFile(`./database.json`, JSON.stringify([usuario]), {
      encoding: "utf-8",
    });
  }

  usuarios.push(usuario)
  await writeFile(`./database.json`, JSON.stringify(usuarios), {
    encoding: "utf-8",
  });
}

async function main() {
  const interfaceConsole = createInterface(stdin, stdout);

  // INTERFACE DE USUÁRIO (CLI): Cabeçalho informativo
  console.log("\n________________________\n ");
  console.log("=========================");
  console.log("           MENU         ");
  console.log("=========================");
  console.log(" INSTRUÇÕES DE USO:");
  console.log(" • ");
  console.log(" • ");
  console.log("==========================\n");

  const respostaOperação = await interfaceConsole.question(
    "Digite o usuário:\n", // \n - Quebra de linha
  );

  const usuario = await buscarUsuario(respostaOperação);
  // callstack -> stacktrace
  await salvarArquivo(usuario);

  interfaceConsole.close();
}

// O programa deve pedir um usuário
// Caso o usuário Não exista, ou a requisição de busca falhe, o programa deve tratar os erros corretamente e mostrar ao usuário a mensagem adequada
// Se o usuário for encontrado, deve ser mostrado na tela (terminal), o nome e o username
// Perguntar ao usuário se deseja salvar
// Não poderá salvar usuários repetidos
// Não deverá sobrescrever usuários já existentes
main().catch(console.log);
