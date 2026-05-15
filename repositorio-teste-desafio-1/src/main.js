import { stdin, stdout } from "process";
import { createInterface } from "node:readline/promises";
import { writeFile, readFile } from "node:fs/promises";

async function buscarUsuario(username) {
  const urlBase = "https://api.github.com/users/";

  try {
    const response = await fetch(`${urlBase}${username}`);

    if (!response.ok) {
      // Diferencia o erro 404 (Não encontrado) de outros erros de servidor
      if (response.status === 404) {
        throw new Error("Usuário não encontrado no GitHub.");
      }
      throw new Error(`Erro na requisição. Status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    // Relança o erro para ser capturado e tratado no bloco catch da função main()
    throw error;
  }
}

async function lerArquivo() {
  try {
    const usuariosText = await readFile("./database.json", {
      encoding: "utf-8",
    });
    return JSON.parse(usuariosText);
  } catch (error) {
    // Se o arquivo não existir (código ENOENT), retornamos um array vazio para criar a base
    if (error.code === "ENOENT") {
      return [];
    }
    console.error("Arquivo corrompido, não foi possível ler os dados.");
    return [];
  }
}

async function salvarArquivo(usuario) {
  const usuarios = await lerArquivo();

  // Verifica se o usuário já existe pelo 'login' para não salvar duplicados
  const usuarioJaExiste = usuarios.find(
    (u) => u.login.toLowerCase() === usuario.login.toLowerCase(),
  );

  if (usuarioJaExiste) {
    console.log(
      `\nAviso: O usuário "${usuario.login}" já está salvo no banco de dados. Nenhuma alteração foi feita.`,
    );
    return;
  }

  // Adiciona o novo usuário ao array existente (não sobrescreve)
  usuarios.push(usuario);

  // Salva no formato JSON com identação (null, 2) para melhor leitura
  await writeFile(`./database.json`, JSON.stringify(usuarios, null, 2), {
    encoding: "utf-8",
  });

  console.log(`\nUsuário "${usuario.login}" salvo com sucesso!`);
}

async function main() {
  const interfaceConsole = createInterface(stdin, stdout);

  console.log("\n________________________\n");
  console.log("=========================");
  console.log("          MENU          ");
  console.log("=========================");
  console.log(" INSTRUÇÕES DE USO:");
  console.log(" • Digite o username válido do GitHub");
  console.log(" • O sistema perguntará se você quer salvar");
  console.log("==========================\n");

  // 1. O programa pede um usuário
  const respostaOperacao = await interfaceConsole.question(
    "Digite o usuário do GitHub:\n",
  );

  try {
    const usuario = await buscarUsuario(respostaOperacao.trim());

    // 3. Se o usuário for encontrado, mostra na tela o nome e o username
    console.log("\n--- Usuário Encontrado ---");
    console.log(`Nome: ${usuario.name || "Não informado no perfil"}`);
    console.log(`Username: ${usuario.login}`);
    console.log("--------------------------\n");

    // 4. Pergunta ao usuário se deseja salvar
    const desejaSalvar = await interfaceConsole.question(
      "Deseja salvar este usuário no banco de dados? (S/N)\n",
    );

    if (desejaSalvar.trim().toLowerCase() === "s") {
      // 5 e 6. Salva o usuário verificando regras de duplicidade
      await salvarArquivo(usuario);
    } else {
      console.log("\nOperação de salvamento cancelada.");
    }
  } catch (error) {
    // 2. Trata os erros corretamente (usuário inexistente ou falha)
    console.error(`\n❌ Falha na operação: ${error.message}`);
  } finally {
    // Sempre fecha a interface no final, independente de erro ou sucesso
    interfaceConsole.close();
  }
}

main().catch((erroInesperado) =>
  console.log("Erro inesperado:", erroInesperado),
);

//Questoes a serem resolvidas nesse desafio:
//1-O programa deve pedir um usuário
//2-Caso o usuário Não exista, ou a requisição de busca falhe, o programa deve tratar os erros corretamente e mostrar ao usuário a mensagem adequada
//3-Se o usuário for encontrado, deve ser mostrado na tela (terminal), o nome e o username
//4-Perguntar ao usuário se deseja salvar
//5-Não poderá salvar usuários repetidos
//6-Não deverá sobrescrever usuários já existentes
