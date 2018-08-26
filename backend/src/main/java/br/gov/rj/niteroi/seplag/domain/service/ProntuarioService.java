package br.gov.rj.niteroi.seplag.domain.service;

import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;

public interface ProntuarioService {

	Prontuario consultarProntuario(String cpf);
	Prontuario cadastrarProntuario(String idPaciente, Prontuario prontuario);
}
