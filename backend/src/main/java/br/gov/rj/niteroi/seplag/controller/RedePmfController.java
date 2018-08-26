package br.gov.rj.niteroi.seplag.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import br.gov.rj.niteroi.seplag.domain.entity.RedePmf;
import br.gov.rj.niteroi.seplag.domain.service.RedePmfService;

@Controller
@RequestMapping("/rede-pmf")
public class RedePmfController {

	private static final Logger LOGGER = Logger.getLogger(RedePmfController.class);

	@Autowired
	private RedePmfService redePmfService;

	@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/lista", method = { RequestMethod.GET, RequestMethod.OPTIONS })
	public @ResponseBody List<RedePmf> lista(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.OK.value());

		return redePmfService.listaRedePmf();
	}
}
