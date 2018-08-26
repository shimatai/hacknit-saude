package br.gov.rj.niteroi.seplag.test;

import br.gov.rj.niteroi.seplag.util.AwsUtil;

public class CriaColecaoFaces {

	public static void main(String[] args) {
		AwsUtil.createRekognitionCollection("pacientes");
	}

}
