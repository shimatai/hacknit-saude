package br.gov.rj.niteroi.seplag.test;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class CarregaRedePmf {

	public static void main(String[] args) {
		

	}
	
	public void start() {
		String file = "BENEFICIADO_090817.csv";
		
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String line;
		    int i = 0;
		    while ((line = br.readLine()) != null) {
		    	if (line != null && !"".equals(line.trim()) && i > 0) {
		    		
		    	}
		    	i++;
		    }
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
