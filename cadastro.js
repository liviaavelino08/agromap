
(() => {
  "use strict";

  // Configuração do projeto Supabase
  const SUPABASE_URL =
    "https://jzjbsjplmjgtltyswyft.supabase.co";

  const SUPABASE_PUBLIC_KEY =
    "sb_publishable_lzgGRU_n1Ch3kjZy5wVezw_EwwLDANm";

  const formulario = document.getElementById("cadastroForm");
  const mensagem = document.getElementById("mensagem");
  const botao = document.getElementById("botaoCadastro");

  if (!formulario || !mensagem || !botao) return;

  function informar(texto, tipo = "error") {
    mensagem.textContent = texto;
    mensagem.className = "form-message" + (tipo ? " " + tipo : "");
  }

  if (!window.supabase) {
    informar(
      "Não foi possível carregar o serviço de cadastro. Atualize a página e tente novamente."
    );
    botao.disabled = true;
    return;
  }

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
  );

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    informar("");

    const valor = (id) =>
      (document.getElementById(id)?.value ?? "").trim();

    const senha = document.getElementById("senha").value;
    const confirmarSenha =
      document.getElementById("confirmarSenha").value;

    if (senha.length < 6) {
      informar("Sua senha precisa ter pelo menos 6 caracteres.");
      document.getElementById("senha").focus();
      return;
    }

    if (senha !== confirmarSenha) {
      informar("As senhas não coincidem. Confira os dois campos.");
      document.getElementById("confirmarSenha").focus();
      return;
    }

    const totalTexto = valor("hectaresTotal");
    const plantadosTexto = valor("hectaresPlantados");

    const total =
      totalTexto === "" ? null : Number(totalTexto);

    const plantados =
      plantadosTexto === "" ? null : Number(plantadosTexto);

    if (total !== null && (!Number.isFinite(total) || total < 0)) {
      informar("A área total deve ser igual ou maior que zero.");
      return;
    }

    if (
      plantados !== null &&
      (!Number.isFinite(plantados) || plantados < 0)
    ) {
      informar("A área plantada deve ser igual ou maior que zero.");
      return;
    }

    if (
      total !== null &&
      plantados !== null &&
      plantados > total
    ) {
      informar("A área plantada não pode superar a área total.");
      return;
    }

    const nome = valor("nome");
    const email = valor("email").toLowerCase();

    const metadados = {
      nome,
      telefone: valor("telefone") || null,
      nome_fazenda: valor("nomeFazenda") || null,
      endereco: valor("enderecoRural") || null,
      cidade: valor("cidade") || null,
      estado: valor("estado") || null,

      localizacao:
        [valor("cidade"), valor("estado")]
          .filter(Boolean)
          .join(", ") ||
        valor("enderecoRural") ||
        null,

      area_total: total,
      hectares_plantados: plantados,
      cultura_principal: valor("culturaPrincipal") || null,
      outras_culturas: valor("outrasCulturas") || null,
      epoca_plantio: valor("epocaPlantio") || null,
      irrigacao: valor("irrigacao") || null,
      observacoes: valor("observacoes") || null
    };

    botao.disabled = true;
    botao.innerHTML = 'Criando sua conta <span>…</span>';

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password: senha,
        options: {
          data: metadados,
          emailRedirectTo: new URL(
            "login.html",
            window.location.href
          ).href
        }
      });

      if (error) throw error;

      if (data?.session) {
        informar(
          "Conta criada com sucesso! Redirecionando...",
          "success"
        );

        window.setTimeout(() => {
          window.location.href = new URL(
            "dashboard.html",
            window.location.href
          ).href;
        }, 900);
      } else {
        informar(
          "Cadastro enviado! Verifique seu e-mail para confirmar a conta e depois entre pela página de login.",
          "success"
        );

        formulario.reset();
      }
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      const detalhe = String(
        erro?.message || ""
      ).toLowerCase();

      if (
        detalhe.includes("already registered") ||
        detalhe.includes("already been registered")
      ) {
        informar(
          "Este e-mail já possui cadastro. Tente entrar ou recuperar sua senha."
        );
      } else if (
        detalhe.includes("password") &&
        detalhe.includes("weak")
      ) {
        informar("Escolha uma senha mais forte e tente novamente.");
      } else {
        informar(
          "Não foi possível concluir o cadastro. Confira sua conexão e as configurações de autenticação do Supabase."
        );
      }
    } finally {
      botao.disabled = false;
      botao.innerHTML = 'Criar minha conta <span>→</span>';
    }
  });
})();
