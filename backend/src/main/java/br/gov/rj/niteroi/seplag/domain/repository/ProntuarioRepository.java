package br.gov.rj.niteroi.seplag.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;
import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;

public interface ProntuarioRepository extends MongoRepository<Prontuario, String> {

	public Prontuario findByPaciente(Paciente paciente);
}
