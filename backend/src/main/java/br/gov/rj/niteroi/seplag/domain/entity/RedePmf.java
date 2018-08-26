package br.gov.rj.niteroi.seplag.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "redePmf")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedePmf {

	@Id
	private String id;
	
	private String nome;
	
	private String nomeGen;
	
	private String tipoUnidade;
	
	private String nivel;
	
	private String logradouro;
	
	private String numero;
	
	private String cep;
	
	private String bairro;
	
	private String municipio;
	
	private String uf;
	
	private String telefone;

	private Integer numeroEquip;
	
	private Integer numeroEquipBu;
	
	private Integer numeroFamCad;

	private Integer numeroUsuariosCad;
	
	private Double latitude;

	private Double longitude;
}
