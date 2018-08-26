package br.gov.rj.niteroi.seplag.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import br.gov.rj.niteroi.seplag.domain.service.RedePmfService;

@Controller
@RequestMapping("/etl")
public class EtlController {

	@Autowired
	private RedePmfService redePmfService;

	@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/rede-pmf", method = { RequestMethod.GET, RequestMethod.OPTIONS })
	public @ResponseBody String redePmf(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

		redePmfService.carregarRedePmf();

		return null;
	}
}
