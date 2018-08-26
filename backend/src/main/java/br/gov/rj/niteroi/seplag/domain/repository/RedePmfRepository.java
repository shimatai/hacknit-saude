package br.gov.rj.niteroi.seplag.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.gov.rj.niteroi.seplag.domain.entity.RedePmf;

public interface RedePmfRepository extends MongoRepository<RedePmf, String> {

}
