package br.gov.rj.niteroi.seplag.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "prontuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Prontuario {

	@Id
	private String id;

	private Paciente paciente;

	// Vacinas
	private String bcgId;
	private String hepatiteB;
	private String pnm101;
	private String vip1;
	private String pentavalente1;
	private String rotavirus1;
	private String mngC1;
	private String pnm102;
	private String vip2;
	private String pentavalente2;
	private String rotavirus2;
	private String mngC2;
	private String vip3;
	private String pentavalente3;
	private String febreAmarela;
	private String tripliceViral1;
	private String mngCReforco;
	private String pnm10Reforco;
	private String vopBivalente1;
	private String dtp1;
	private String tripleViral2;
	private String varicela1;
	private String hepatiteA;
	private String vopBivalente2;
	private String dtp2;
	private String varicela2;
	private String hpv1;
	private String hpv2;
	private String hpv3;
	private String hpv4;
	private String mngCReforco2;
	private String mngCDoseUnica;
	private String dt1;
	private String dt2;
	private String dt3;
	private String dt4;
	private String dt5;
	private String dt6;
	private String dt7;
	private String dt8;
	private String dt9;
	private String dt10;
	private String tripliceViralDose1;
	private String tripliceViralDose2;
	private String hepatiteBDose1;
	private String hepatiteBDose2;
	private String hepatiteBDose3;
	private String influenza1;
	private String influenza2;
	private String influenza3;
	private String influenza4;
	private String influenza5;
}
