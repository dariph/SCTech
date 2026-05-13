import { stdin, stdout } from "process"; //standardIn E standardOut -> entrada padrão e saída padrão
import { createInterface } from "node:readline/promises";

import { adicao } from "./services/adicao.js";
import { subtracao } from "./services/subtracao.js";
import { divisao } from "./services/divisao.js";
import { multiplicacao } from "./services/multiplicacao.js";

async function main() {
  const interfaceConsole = createInterface(stdin, stdout);

  const respostaOperação = await interfaceConsole.question(
    "Digite a operação:\n", // \n - Quebra de linha
  );

  const aString = await interfaceConsole.question(
    "Digite o primeiro número: \n",
  );
  const bString = await interfaceConsole.question(
    "Digite o segundo número: \n",
  ); // string -> texto-

  const a = aString; // transforme
  const b = bString; // transforme

  // 1- Fazer a transformação para número -> Caso o usuário não digite um número, jogue um erro
  // 2- Criar as outras operações uma em cada arquivo e importar
  // BÔNUS: Resolver o problema do console preso quando a aplicação dá erro.

  switch (respostaOperação) {
    case "+":
      const respostaAdicao = adicao(aString, bString);
      console.log(`Resposta da operação: ${respostaAdicao}`);
      break;
    case "-":
      const respostaSubtracao = subtracao(aString, bString);
      console.log(`Resposta da operação: ${respostaSubtracao}`);
      break;
    case "/":
      const respostaDivisao = divisao(aString, bString);
      console.log(`Resposta da operação: ${respostaDivisao}`);
      break;
    case "*":
      const respostaMultiplicacao = multiplicacao(aString, bString);
      console.log(`Resposta da operação: ${respostaMultiplicacao}`);
      break;

    default:
      throw new Error(`Não suportamos essa operação`);
  }

  interfaceConsole.close();
}

main().catch(console.log);
