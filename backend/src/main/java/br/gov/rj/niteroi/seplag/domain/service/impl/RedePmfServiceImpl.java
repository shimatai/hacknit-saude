package br.gov.rj.niteroi.seplag.domain.service.impl;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.rj.niteroi.seplag.domain.entity.RedePmf;
import br.gov.rj.niteroi.seplag.domain.repository.RedePmfRepository;
import br.gov.rj.niteroi.seplag.domain.service.RedePmfService;

@Service
public class RedePmfServiceImpl implements RedePmfService {

	private static final Logger LOGGER = Logger.getLogger(RedePmfServiceImpl.class);

	@Autowired
	private RedePmfRepository redePmfRepository;

	@Override
	public List<RedePmf> listaRedePmf() {
		return redePmfRepository.findAll();
	}

	public int carregarRedePmf() {
		String file = "/Users/shimatai/Downloads/Rede_PMF.csv";
		redePmfRepository.deleteAll();

		int i = 0;
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String line;
		    while ((line = br.readLine()) != null) {
		    	if (line != null && !"".equals(line.trim()) && i > 0) {
		    		RedePmf redePmf = new RedePmf();
		    		String[] field = line.split(",");
		    		redePmf.setLongitude(Double.valueOf(field[0]));
		    		redePmf.setLatitude(Double.valueOf(field[1]));
		    		redePmf.setNome(field[3]);
		    		redePmf.setNomeGen(field[4]);
		    		redePmf.setTipoUnidade(field[6]);
		    		redePmf.setNivel(field[7]);
		    		redePmf.setLogradouro(field[8]);
		    		redePmf.setNumero(field[9]);
		    		redePmf.setCep(field[10]);
		    		redePmf.setBairro(field[11]);
		    		redePmf.setMunicipio(field[12]);
		    		redePmf.setUf(field[13]);
		    		redePmf.setTelefone(field[15]);
		    		redePmf.setNumeroEquip(Integer.valueOf(field[16]));
		    		redePmf.setNumeroEquipBu(Integer.valueOf(field[17]));
		    		redePmf.setNumeroFamCad(Integer.valueOf(field[18]));
		    		redePmf.setNumeroUsuariosCad(Integer.valueOf(field[19]));
		    		
		    		redePmfRepository.save(redePmf);

		    		LOGGER.info("Rede PMF salva: " + redePmf.getNome());
		    	}
		    	i++;
		    }
		} catch (FileNotFoundException e) {
			LOGGER.error("Erro ao carregar rede PMF", e);
		} catch (IOException e) {
			LOGGER.error("Erro ao carregar rede PMF", e);
		}

		return i;
	}
}
