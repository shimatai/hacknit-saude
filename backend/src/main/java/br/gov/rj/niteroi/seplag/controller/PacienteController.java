package br.gov.rj.niteroi.seplag.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;
import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;
import br.gov.rj.niteroi.seplag.domain.service.PacienteService;

@Controller
@RequestMapping("/paciente")
public class PacienteController extends BaseController {

	private static final Logger LOGGER = Logger.getLogger(PacienteController.class);
	
	@Autowired
	private PacienteService pacienteService;

	@CrossOrigin(origins = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/buscar", method = { RequestMethod.POST, RequestMethod.OPTIONS }, consumes = "multipart/form-data")
	public @ResponseBody Prontuario buscarPaciente(@RequestParam("foto") MultipartFile foto, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());

		try {
			Prontuario prontuario = pacienteService.buscarProntuarioPorFoto(foto.getBytes());

			if (prontuario != null) {
				httpResponse.setStatus(HttpStatus.OK.value());
				return prontuario;
			} else {
				httpResponse.setStatus(HttpStatus.NOT_FOUND.value());
			}
		} catch (IOException e) {
			LOGGER.error("Erro ao realizar upload da foto do paciente: " + e.getMessage(), e);
		}

		return null;
	}
	
	@CrossOrigin(origins = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/cadastro", method = { RequestMethod.POST, RequestMethod.OPTIONS }, consumes = "multipart/form-data")
	public @ResponseBody Paciente cadastro(@RequestParam("foto") MultipartFile foto, 
										   @RequestParam("id") String id,							   
										   @RequestParam("nome") String nome,
										   @RequestParam("nomeSocial") String nomeSocial,
										   @RequestParam("cpf") String cpf,
										   @RequestParam("sexo") String sexo,
										   @RequestParam("telefone") String telefone,
										   @RequestParam("dataNascimento") String dataNascimento,
										   HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());
		
		Paciente paciente = new Paciente();
		paciente.setId(!StringUtils.isEmpty(id) ? id : null);
		paciente.setNome(nome);
		paciente.setNomeSocial(StringUtils.isEmpty(nomeSocial) ? nome : nomeSocial);
		paciente.setCpf(cpf);
		paciente.setSexo(sexo);
		paciente.setTelefone(telefone);
		paciente.setDataNascimento(dataNascimento);

		try {
			paciente = pacienteService.cadastrarPaciente(paciente, foto.getBytes());

			if (paciente != null) {
				httpResponse.setStatus(HttpStatus.OK.value());
				return paciente;
			}
		} catch (IOException e) {
			LOGGER.error("Erro ao realizar cadastro do paciente: " + e.getMessage(), e);
		}

		return null;
	}
	
	@CrossOrigin(origins = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/cadastro-paciente", method = { RequestMethod.POST, RequestMethod.OPTIONS })
	public @ResponseBody Paciente cadastroPaciente(@RequestBody String jsonBody, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());
		
		JSONObject body = new JSONObject(jsonBody);

		Paciente paciente = new Paciente();
		paciente.setNome(body.getString("nome"));
		paciente.setNomeSocial(StringUtils.isEmpty(body.getString("nomeSocial")) ? body.getString("nome") : body.getString("nomeSocial"));
		paciente.setCpf(body.getString("cpf"));
		paciente.setSexo(body.getString("sexo"));
		paciente.setTelefone(body.getString("telefone"));
		paciente.setDataNascimento(body.getString("dataNascimento"));

		paciente = pacienteService.cadastrarPaciente(paciente, null);
		if (paciente != null) {
			httpResponse.setStatus(HttpStatus.OK.value());
		}

		return paciente;
	}

	@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/cpf/{cpf}", method = { RequestMethod.GET, RequestMethod.OPTIONS })
	public @ResponseBody Paciente cpf(@PathVariable String cpf, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.NOT_FOUND.value());

		Paciente paciente = pacienteService.buscarPacientePorCpf(cpf);
		if (paciente != null) {
			httpResponse.setStatus(HttpStatus.OK.value());
		}

		return paciente;
	}
}
