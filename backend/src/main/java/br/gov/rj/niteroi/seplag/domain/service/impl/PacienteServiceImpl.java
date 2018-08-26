package br.gov.rj.niteroi.seplag.domain.service.impl;

import java.io.File;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.rekognition.model.DetectFacesResult;
import com.amazonaws.services.rekognition.model.FaceDetail;
import com.amazonaws.services.rekognition.model.FaceMatch;
import com.amazonaws.services.rekognition.model.FaceRecord;
import com.amazonaws.services.rekognition.model.IndexFacesResult;

import br.gov.rj.niteroi.seplag.domain.entity.Paciente;
import br.gov.rj.niteroi.seplag.domain.entity.Prontuario;
import br.gov.rj.niteroi.seplag.domain.repository.PacienteRepository;
import br.gov.rj.niteroi.seplag.domain.repository.ProntuarioRepository;
import br.gov.rj.niteroi.seplag.domain.service.PacienteService;
import br.gov.rj.niteroi.seplag.util.AwsUtil;

@Service
public class PacienteServiceImpl implements PacienteService {

	private static final Logger LOGGER = Logger.getLogger(PacienteServiceImpl.class);

	private static final String FOTOS_DIR = "fotos";
	private static final String BUCKET_NAME = "hacknit";
	
	private final Float FACE_THRESHOLD = 90F;

	@Autowired
	private PacienteRepository pacienteRepository;

	@Autowired
	private ProntuarioRepository prontuarioRepository;

	private String salvarFoto(byte[] foto, String fileName, String dir, boolean deleteFile) {
		String url = AwsUtil.enviarArquivoS3(dir, fileName, BUCKET_NAME, foto, deleteFile);

		if (url != null) {
			return url;
		}

		return null;
	}

	@Override
	public Paciente cadastrarPaciente(Paciente paciente, byte[] foto) {
		if (paciente.getId() == null) paciente = pacienteRepository.save(paciente);

		if (foto != null) {
			String url = salvarFoto(foto, paciente.getId() + ".jpg", "pacientes", true);

			if (url != null) {
				adicionarFaceAColecao(paciente.getId(), "pacientes/" + paciente.getId() + ".jpg", "pacientes");
				paciente.setUrlFoto(url);
				pacienteRepository.save(paciente);
			}
		}
		
		return paciente;
	}

	@Override
	public Paciente buscarPacientePorCpf(String cpf) {
		return pacienteRepository.findByCpf(cpf);
	}

	@Override
	public Prontuario buscarProntuarioPorFoto(byte[] foto) {
		String filename = salvarFoto(foto, "paciente-" + new Date().getTime() + ".jpg", FOTOS_DIR, false);
		filename = FilenameUtils.getBaseName(filename) + "." + FilenameUtils.getExtension(filename);

		String downloadDir = AwsUtil.TMP_DIR;

		File sourceFile = new File(downloadDir + File.separator + filename);

		DetectFacesResult faceDetectionResult = AwsUtil.detectFaces(BUCKET_NAME, FOTOS_DIR + "/" + filename);

		final Integer maxFaces = 3;

		List<FaceDetail> faceDetails = faceDetectionResult.getFaceDetails();
		if (faceDetails != null && !faceDetails.isEmpty()) {
			LOGGER.info("Qtd. de rostos na imagem " + sourceFile.getAbsolutePath() + ": " + faceDetails.size());
			for (FaceDetail face : faceDetails) {
				LOGGER.info(
			 			"========== FACE DETAILS ==========\n" +
					 	"Confidence level: " + face.getConfidence() + "\n" +
			 			"Quality: " + face.getQuality() + "\n" +
			 			"Age range: " + face.getAgeRange() + "\n" + 
			 			"Beard?: " + face.getBeard().isValue() + " / " + face.getBeard().getConfidence() + "\n" +
			 			"Gender: " + face.getGender().getValue() + " / " + face.getGender().getConfidence() + "\n" +
			 			"Eye open?: " + face.getEyesOpen().isValue() + " / " + face.getEyesOpen().getConfidence() + "\n" +
			 			"Glasses?: " + face.getEyeglasses().isValue() + " / " + face.getEyeglasses().getConfidence() + "\n" +
			 			"Mouth open?: " + face.getMouthOpen().isValue() + " / " + face.getMouthOpen().getConfidence() + "\n" +
			 			"Mustache?: " + face.getMustache().isValue() + " / " + face.getMustache().getConfidence() + "\n" +
			 			"Smiling?: " + face.getSmile().isValue() + " / " + face.getSmile().getConfidence());

				List<FaceMatch> faceImageMatches = AwsUtil.searchFaceInCollection(sourceFile, "pacientes", FACE_THRESHOLD, maxFaces);
				if (faceImageMatches != null && !faceImageMatches.isEmpty()) {
					LOGGER.info("Total de matches para " + filename + ": " + faceImageMatches.size());
					for (FaceMatch faceMatch : faceImageMatches) {
						String userId = faceMatch.getFace().getExternalImageId();
						sourceFile.delete();
						Paciente paciente = pacienteRepository.findOne(userId);
						if (paciente != null) {
							return prontuarioRepository.findByPaciente(paciente);
						}
					}
				}
			}
		}

		sourceFile.delete();

		return null;
	}

	@Override
	public boolean adicionarFaceAColecao(String idPaciente, String imagePath, String collectionId) {
		Paciente paciente = pacienteRepository.findOne(idPaciente);

		IndexFacesResult indexFacesResult = AwsUtil.addFaceToRekognitionCollection(BUCKET_NAME, imagePath, collectionId, idPaciente);
	    List <FaceRecord> faceRecords = indexFacesResult.getFaceRecords();

	    for (FaceRecord faceRecord: faceRecords) {
	    	if (faceRecord.getFace().getConfidence() >= FACE_THRESHOLD) {
	    		paciente.setFaceId(faceRecord.getFace().getFaceId());
		    	pacienteRepository.save(paciente);

		    	LOGGER.info("Face ID do usuario " + paciente.getNome() + " atualizado com sucesso para " + paciente.getFaceId());
		    	LOGGER.info("Face ID: " + faceRecord.getFace().getFaceId() + "\n" +
	    		 			"External image ID: " + faceRecord.getFace().getExternalImageId() + "\n" +
	    		 			"Image ID: " + faceRecord.getFace().getImageId() + "\n" +
	    		 			"Confidence level: " + faceRecord.getFace().getConfidence() + "\n" +
	    		 			"========== FACE DETAILS ==========\n" +
	    		 			"Quality: " + faceRecord.getFaceDetail().getQuality() + "\n" +
	    		 			"Age range: " + faceRecord.getFaceDetail().getAgeRange() + "\n" + 
	    		 			"Beard?: " + faceRecord.getFaceDetail().getBeard().isValue() + " / " + faceRecord.getFaceDetail().getBeard().getConfidence() + "\n" +
	    		 			"Gender: " + faceRecord.getFaceDetail().getGender().getValue() + " / " + faceRecord.getFaceDetail().getGender().getConfidence() + "\n" +
	    		 			"Eye open?: " + faceRecord.getFaceDetail().getEyesOpen().isValue() + " / " + faceRecord.getFaceDetail().getEyesOpen().getConfidence() + "\n" +
	    		 			"Glasses?: " + faceRecord.getFaceDetail().getEyeglasses().isValue() + " / " + faceRecord.getFaceDetail().getEyeglasses().getConfidence() + "\n");
		    	
		    	return true;
	    	}
	    }

	    return false;
	}

}
