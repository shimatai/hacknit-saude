package br.gov.rj.niteroi.seplag.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "paciente")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Paciente {

	@Id
	private String id;
	
	private Prontuario prontuario;
	
	private String faceId;

	private String nome;
	
	private String nomeMae;
	
	private String nomePai;
	
	private String nomeSocial;
	
	private String paisNascimento;
	
	private String ufNascimento;
	
	private String municipioNascimento;

	private String dataNascimento;

	private String cartaoSus;
	
	private String rg;
	
	private String ufRg;
	
	private String municipio;
	
	private String endereco;
	
	private String bairro;
	
	private String cep;
	
	private String telefone;
	
	private String celular;
	
	private String email;
	
	private String cpf;
	
	private String sexo;
	
	private String urlFoto;

}
