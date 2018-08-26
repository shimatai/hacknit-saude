package br.gov.rj.niteroi.seplag.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;

public interface PacienteRepository extends MongoRepository<Paciente, String> {

	public Paciente findByCpf(String cpf);
	public Paciente findByFaceId(String faceId);
}
