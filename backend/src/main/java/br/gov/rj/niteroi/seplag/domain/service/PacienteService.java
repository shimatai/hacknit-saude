package br.gov.rj.niteroi.seplag.domain.service;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;
import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;

public interface PacienteService {

	Paciente cadastrarPaciente(Paciente paciente, byte[] foto);
	Paciente buscarPacientePorCpf(String cpf);
	Prontuario buscarProntuarioPorFoto(byte[] foto);
	boolean adicionarFaceAColecao(String idPaciente, String imagePath, String collectionId);
}
