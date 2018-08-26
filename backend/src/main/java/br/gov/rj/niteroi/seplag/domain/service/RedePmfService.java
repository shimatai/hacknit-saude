package br.gov.rj.niteroi.seplag.domain.service;

import java.util.List;

import br.gov.rj.niteroi.seplag.domain.entity.RedePmf;

public interface RedePmfService {

	List<RedePmf> listaRedePmf();
	int carregarRedePmf();
}
