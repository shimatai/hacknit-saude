package br.gov.rj.niteroi.seplag.domain.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;
import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;
import br.gov.rj.niteroi.seplag.domain.repository.PacienteRepository;
import br.gov.rj.niteroi.seplag.domain.repository.ProntuarioRepository;
import br.gov.rj.niteroi.seplag.domain.service.ProntuarioService;

@Service
public class ProntuarioServiceImpl implements ProntuarioService {

	private static final Logger LOGGER = Logger.getLogger(ProntuarioServiceImpl.class);
	
	@Autowired
	private ProntuarioRepository prontuarioRepository;

	@Autowired
	private PacienteRepository pacienteRepository;

	@Override
	public Prontuario consultarProntuario(String cpf) {
		Paciente paciente = pacienteRepository.findByCpf(cpf);

		if (paciente != null) {
			return prontuarioRepository.findByPaciente(paciente);
		}
		
		return null;
	}

	@Override
	public Prontuario cadastrarProntuario(String idPaciente, Prontuario prontuario) {
		Paciente paciente = pacienteRepository.findOne(idPaciente);

		if (paciente != null) {
			LOGGER.info("Salvando prontuario do paciente " + paciente.getNomeSocial());
	
			prontuario.setPaciente(paciente);
		}

		return prontuarioRepository.save(prontuario);
	}
}
