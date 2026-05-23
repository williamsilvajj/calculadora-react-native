import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";

export default function HomeScreen() {
  const [display, setDisplay] = useState("0");
  const [primeiroNumero, setPrimeiroNumero] = useState<number | null>(null);
  const [operacao, setOperacao] = useState<string | null>(null);
  const [novoNumero, setNovoNumero] = useState(true);

  function formatarNumero(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 8,
    }).format(valor);
  }

  function converterParaNumero(valor: string) {
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  }

  function simboloOperacao(op: string | null) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
  }

  function clicarNumero(numero: string) {
    if (display === "Erro") {
      setDisplay(numero);
      return;
    }

    if (numero === "." && display.includes(",")) return;

    const numeroFormatado = numero === "." ? "," : numero;

    if (display === "0" || novoNumero) {
      setDisplay(numeroFormatado);
      setNovoNumero(false);
    } else {
      const novoValor = display + numeroFormatado;
      const valorNumerico = converterParaNumero(novoValor);

      if (!novoValor.includes(",")) {
        setDisplay(formatarNumero(valorNumerico));
      } else {
        setDisplay(novoValor);
      }
    }
  }

  function escolherOperacao(op: string) {
    setPrimeiroNumero(converterParaNumero(display));
    setOperacao(op);
    setNovoNumero(true);
  }

  function calcular() {
    if (primeiroNumero === null || operacao === null) return;

    const segundoNumero = converterParaNumero(display);
    let resultado = 0;

    if (operacao === "+") resultado = primeiroNumero + segundoNumero;
    if (operacao === "-") resultado = primeiroNumero - segundoNumero;
    if (operacao === "*") resultado = primeiroNumero * segundoNumero;

    if (operacao === "/") {
      if (segundoNumero === 0) {
        setDisplay("Erro");
        return;
      }

      resultado = primeiroNumero / segundoNumero;
    }

    let resultadoFormatado = formatarNumero(resultado);

    if (resultadoFormatado.length > 12) {
      resultadoFormatado = resultado.toPrecision(8);
    }

    setDisplay(resultadoFormatado);
    setPrimeiroNumero(null);
    setOperacao(null);
    setNovoNumero(true);
  }

  function limpar() {
    setDisplay("0");
    setPrimeiroNumero(null);
    setOperacao(null);
    setNovoNumero(true);
  }

  function apagarUltimo() {
    if (display === "Erro" || novoNumero) {
      setDisplay("0");
      setNovoNumero(true);
      return;
    }

    const novoDisplay = display.slice(0, -1);

    if (novoDisplay === "" || novoDisplay === "-") {
      setDisplay("0");
    } else {
      setDisplay(novoDisplay);
    }
  }

  function textoDoVisor() {
    if (primeiroNumero !== null && operacao !== null && novoNumero) {
      return `${formatarNumero(primeiroNumero)} ${simboloOperacao(operacao)}`;
    }

    return display;
  }

  function botao(
    texto: string,
    acao: () => void,
    tipo = "normal"
  ) {
    return (
      <Pressable
        style={[
          styles.botao,
          tipo === "operacao" && styles.botaoOperacao,
          tipo === "limpar" && styles.botaoLimpar,
          tipo === "igual" && styles.botaoIgual,
        ]}
        onPress={acao}
      >
        <Text
          selectable={false}
          style={[
            styles.textoBotao,
            Platform.OS === "web" && styles.textoNaoSelecionavel,
          ]}
        >
          {texto}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.calculadora}>
        <Text style={styles.titulo}>Calculadora</Text>

        <View style={styles.display}>
          <Text
            selectable={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.textoDisplay,
              Platform.OS === "web" && styles.textoNaoSelecionavel,
            ]}
          >
            {textoDoVisor()}
          </Text>
        </View>

        <View style={styles.linha}>
          {botao("C", limpar, "limpar")}
          {botao("⌫", apagarUltimo, "limpar")}
          {botao("÷", () => escolherOperacao("/"), "operacao")}
        </View>

        <View style={styles.linha}>
          {botao("7", () => clicarNumero("7"))}
          {botao("8", () => clicarNumero("8"))}
          {botao("9", () => clicarNumero("9"))}
          {botao("×", () => escolherOperacao("*"), "operacao")}
        </View>

        <View style={styles.linha}>
          {botao("4", () => clicarNumero("4"))}
          {botao("5", () => clicarNumero("5"))}
          {botao("6", () => clicarNumero("6"))}
          {botao("-", () => escolherOperacao("-"), "operacao")}
        </View>

        <View style={styles.linha}>
          {botao("1", () => clicarNumero("1"))}
          {botao("2", () => clicarNumero("2"))}
          {botao("3", () => clicarNumero("3"))}
          {botao("+", () => escolherOperacao("+"), "operacao")}
        </View>

        <View style={styles.linha}>
          {botao("0", () => clicarNumero("0"))}
          {botao(",", () => clicarNumero("."))}
          {botao("=", calcular, "igual")}
        </View>
      </View>
      <Text style={styles.creditos}>
        Projeto desenvolvido por: Geovana, Kelvin, Maiara, Walter e William
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9A9A9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  calculadora: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#2b2b2b",
    borderRadius: 25,
    padding: 20,
  },

  titulo: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  display: {
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "flex-end",
  },

  textoDisplay: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },

  linha: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },

  botao: {
    backgroundColor: "#505050",
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  botaoOperacao: {
    backgroundColor: "#00fa2e9e",
  },

  botaoLimpar: {
    backgroundColor: "#a5a5a5",
  },

  botaoIgual: {
    backgroundColor: "#a5a5a5",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  textoNaoSelecionavel: {
    userSelect: "none",
  },

  creditos: {
    color: "#fff",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
  },
});