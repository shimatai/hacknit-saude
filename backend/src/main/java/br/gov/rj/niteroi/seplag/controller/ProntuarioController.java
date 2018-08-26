package br.gov.rj.niteroi.seplag.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;
import br.gov.rj.niteroi.seplag.domain.service.ProntuarioService;

@Controller
@RequestMapping("/prontuario")
public class ProntuarioController extends BaseController {

	private static final Logger LOGGER = Logger.getLogger(ProntuarioController.class);
	
	@Autowired
	private ProntuarioService prontuarioService;

	@CrossOrigin(origins = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/cadastro", method = { RequestMethod.POST, RequestMethod.OPTIONS })
	public @ResponseBody Prontuario cadastroPaciente(String idPaciente,
													String bcgId,
													String hepatiteB,
													String pnm101,
													String vip1,
													String pentavalente1,
													String rotavirus1,
													String mngC1,
													String pnm102,
													String vip2,
													String pentavalente2,
													String rotavirus2,
													String mngC2,
													String vip3,
													String pentavalente3,
													String febreAmarela,
													String tripliceViral1,
													String mngCReforco,
													String pnm10Reforco,
													String vopBivalente1,
													String dtp1,
													String tripleViral2,
													String varicela1,
													String hepatiteA,
													String vopBivalente2,
													String dtp2,
													String varicela2,
													String hpv1,
													String hpv2,
													String hpv3,
													String hpv4,
													String mngCReforco2,
													String mngCDoseUnica,
													String dt1,
													String dt2,
													String dt3,
													String dt4,
													String dt5,
													String dt6,
													String dt7,
													String dt8,
													String dt9,
													String dt10,
													String tripliceViralDose1,
													String tripliceViralDose2,
													String hepatiteBDose1,
													String hepatiteBDose2,
													String hepatiteBDose3,
													String influenza1,
													String influenza2,
													String influenza3,
													String influenza4,
													String influenza5,
													HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());

		Prontuario prontuario = new Prontuario();
		prontuario.setBcgId(bcgId);
		prontuario.setHepatiteB(hepatiteB);
		prontuario.setPnm101(pnm101);
		prontuario.setVip1(vip1);
		prontuario.setPentavalente1(pentavalente1);
		prontuario.setRotavirus1(rotavirus1);
		prontuario.setMngC1(mngC1);
		prontuario.setPnm102(pnm102);
		prontuario.setVip2(vip2);
		prontuario.setPentavalente2(pentavalente2);
		prontuario.setRotavirus2(rotavirus2);
		prontuario.setMngC2(mngC2);
		prontuario.setVip3(vip3);
		prontuario.setPentavalente3(pentavalente3);
		prontuario.setFebreAmarela(febreAmarela);
		prontuario.setTripliceViral1(tripliceViral1);
		prontuario.setMngCReforco(mngCReforco);
		prontuario.setPnm10Reforco(pnm10Reforco);
		prontuario.setVopBivalente1(vopBivalente1);
		prontuario.setDtp1(dtp1);
		prontuario.setTripleViral2(tripleViral2);
		prontuario.setVaricela1(varicela1);
		prontuario.setHepatiteA(hepatiteA);
		prontuario.setVopBivalente2(vopBivalente2);
		prontuario.setDtp2(dtp2);
		prontuario.setVaricela2(varicela2);
		prontuario.setHpv1(hpv1);
		prontuario.setHpv2(hpv2);
		prontuario.setHpv3(hpv3);
		prontuario.setHpv4(hpv4);
		prontuario.setMngCReforco2(mngCReforco2);
		prontuario.setMngCDoseUnica(mngCDoseUnica);
		prontuario.setDt1(dt1);
		prontuario.setDt2(dt2);
		prontuario.setDt3(dt3);
		prontuario.setDt4(dt4);
		prontuario.setDt5(dt5);
		prontuario.setDt6(dt6);
		prontuario.setDt7(dt7);
		prontuario.setDt8(dt8);
		prontuario.setDt9(dt9);
		prontuario.setDt10(dt10);
		prontuario.setTripliceViralDose1(tripliceViralDose1);
		prontuario.setTripliceViralDose2(tripliceViralDose2);
		prontuario.setHepatiteBDose1(hepatiteBDose1);
		prontuario.setHepatiteBDose2(hepatiteBDose2);
		prontuario.setHepatiteBDose3(hepatiteBDose3);
		prontuario.setInfluenza1(influenza1);
		prontuario.setInfluenza2(influenza2);
		prontuario.setInfluenza3(influenza3);
		prontuario.setInfluenza4(influenza4);
		prontuario.setInfluenza5(influenza5);

		prontuario = prontuarioService.cadastrarProntuario(idPaciente, prontuario);
		if (prontuario != null) {
			LOGGER.info("Prontuario do paciente cadastrado com sucesso!");
			httpResponse.setStatus(HttpStatus.OK.value());
		}

		return prontuario;
	}

	@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.OPTIONS }, allowedHeaders = "*")
	@RequestMapping(value = "/cpf/{cpf}", method = { RequestMethod.GET, RequestMethod.OPTIONS })
	public @ResponseBody Prontuario cpf(@PathVariable String cpf, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
		httpResponse.setStatus(HttpStatus.NOT_FOUND.value());

		Prontuario prontuario = prontuarioService.consultarProntuario(cpf);
		if (prontuario != null) {
			httpResponse.setStatus(HttpStatus.OK.value());
		}

		return prontuario;
	}
}
