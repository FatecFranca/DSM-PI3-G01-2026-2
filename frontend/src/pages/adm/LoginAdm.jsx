import { useState } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import "../../styles/LoginAdm.css";

function LoginAdm({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");

        if (!usuario.trim() || !senha.trim()) {
            setErro("Preencha todos os campos.");
            return;
        }

        setCarregando(true);

        // Simulação de autenticação — substituir por chamada à API quando o backend estiver pronto
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Por enquanto aceita qualquer usuário/senha não vazios
            // Quando integrar com o backend, substituir por:
            // const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ usuario, senha }) });
            // if (!response.ok) throw new Error('Credenciais inválidas');

            if (onLogin) {
                onLogin({ usuario });
            }
        } catch {
            setErro("Usuário ou senha incorretos.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-overlay">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icone">
                        <Lock size={28} />
                    </div>
                    <h2 className="login-titulo">Área Administrativa</h2>
                    <p className="login-subtitulo">Acesse o painel de gerenciamento</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-campo">
                        <label htmlFor="usuario">Usuário</label>
                        <div className="login-input-wrapper">
                            <User size={18} className="login-input-icone" />
                            <input
                                id="usuario"
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                placeholder="Digite seu usuário"
                                autoComplete="username"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="login-campo">
                        <label htmlFor="senha">Senha</label>
                        <div className="login-input-wrapper">
                            <Lock size={18} className="login-input-icone" />
                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="login-toggle-senha"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {erro && <p className="login-erro">{erro}</p>}

                    <button
                        type="submit"
                        className="btn-modal btn-modal-primario login-btn"
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="login-footer">GiMeal — Gestão de Cardápio</p>
            </div>
        </div>
    );
}

export default LoginAdm;