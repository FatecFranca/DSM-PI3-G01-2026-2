import React from 'react';
import { X, ImagePlus } from "lucide-react";

function ModalPrato({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isEdicao, 
    categoriaNome, 
    nomePrato, setNomePrato, 
    descricaoPrato, setDescricaoPrato, 
    precoPrato, setPrecoPrato, 
    imagemPrato, onUploadImagem 
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-conteudo modal-prato">
                <button className="modal-fechar modal-fechar-prato" onClick={onClose} aria-label="Fechar">
                    <X size={22} />
                </button>

                <h2 className="modal-titulo modal-titulo-prato">
                    {isEdicao ? 'Editar Prato' : 'Novo Prato'}
                </h2>
                <p className="modal-subtitulo modal-subtitulo-prato">
                    Este item aparece na categoria <strong>{categoriaNome}</strong>
                </p>

                <form onSubmit={onSubmit}>
                    <label className="upload-imagem">
                        <div className="upload-imagem-area">
                            {imagemPrato ? (
                                <img src={imagemPrato} alt="Prévia" />
                            ) : (
                                <div className="upload-placeholder">
                                    <ImagePlus size={32} />
                                    <span>Toque para enviar uma imagem</span>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={onUploadImagem} hidden />
                    </label>

                    <div className="campo-prato">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nomePrato}
                            onChange={(e) => setNomePrato(e.target.value)}
                            placeholder="Croassant de Goiabada"
                            required
                        />
                    </div>

                    <div className="campo-prato">
                        <label>Descrição</label>
                        <textarea
                            value={descricaoPrato}
                            onChange={(e) => setDescricaoPrato(e.target.value)}
                            placeholder="Texto informativo sobre o prato"
                            rows={3}
                        />
                    </div>

                    <div className="campo-prato campo-preco">
                        <label>Preço R$</label>
                        <input
                            type="text"
                            value={precoPrato}
                            onChange={(e) => setPrecoPrato(e.target.value)}
                            placeholder="33,90"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-modal btn-modal-primario">
                        Salvar alterações
                    </button>
                    <button type="button" className="btn-modal btn-modal-secundario" onClick={onClose}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalPrato;