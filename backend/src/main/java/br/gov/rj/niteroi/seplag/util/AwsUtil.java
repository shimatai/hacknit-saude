package br.gov.rj.niteroi.seplag.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.rekognition.AmazonRekognition;
import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
import com.amazonaws.services.rekognition.model.Attribute;
import com.amazonaws.services.rekognition.model.CreateCollectionRequest;
import com.amazonaws.services.rekognition.model.CreateCollectionResult;
import com.amazonaws.services.rekognition.model.DeleteFacesRequest;
import com.amazonaws.services.rekognition.model.DeleteFacesResult;
import com.amazonaws.services.rekognition.model.DetectFacesRequest;
import com.amazonaws.services.rekognition.model.DetectFacesResult;
import com.amazonaws.services.rekognition.model.Face;
import com.amazonaws.services.rekognition.model.FaceMatch;
import com.amazonaws.services.rekognition.model.Image;
import com.amazonaws.services.rekognition.model.IndexFacesRequest;
import com.amazonaws.services.rekognition.model.IndexFacesResult;
import com.amazonaws.services.rekognition.model.ListCollectionsRequest;
import com.amazonaws.services.rekognition.model.ListCollectionsResult;
import com.amazonaws.services.rekognition.model.ListFacesRequest;
import com.amazonaws.services.rekognition.model.ListFacesResult;
import com.amazonaws.services.rekognition.model.S3Object;
import com.amazonaws.services.rekognition.model.SearchFacesByImageRequest;
import com.amazonaws.services.rekognition.model.SearchFacesByImageResult;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

public class AwsUtil {

	private static final Logger LOGGER = Logger.getLogger(AwsUtil.class);
	public static final String TMP_DIR = System.getProperty("java.io.tmpdir");

	public static final String DEFAULT_AWS_REGION = "<AWS REGION>";

	public static final String S3_ACCESS_KEY = "<AWS ACCESS KEY>";
	public static final String S3_PASSWORD_KEY = "<AWS SECRET KEY>";
	public static final String AI_ACCESS_KEY = "<AWS ACCESS KEY>";
	public static final String AI_PASSWORD_KEY = "<AWS SECRET KEY>";

	public static AWSCredentials getAwsCredential(String key, String passwordKey) {
		BasicAWSCredentials credentials = new BasicAWSCredentials(key, passwordKey);
		return credentials;
	}

	public static AWSStaticCredentialsProvider getAwsCredentialProvider(String key, String passwordKey) {
		BasicAWSCredentials credentials = new BasicAWSCredentials(key, passwordKey);
		return new AWSStaticCredentialsProvider(credentials);
	}

	public static String enviarArquivoS3(String dirName, String fileName, String bucketName, byte[] bytes) {
		return enviarArquivoS3(dirName, fileName, bucketName, bytes, true);
	}

	public static String enviarArquivoS3(String dirName, String fileName, String bucketName, byte[] bytes, boolean deleteDocumentFile) {
		try {
			if (bytes != null && bytes.length > 0) {
				AmazonS3 s3client = AmazonS3ClientBuilder.standard().withCredentials(getAwsCredentialProvider(S3_ACCESS_KEY, S3_PASSWORD_KEY)).withRegion(DEFAULT_AWS_REGION).build();

				//String fileExtension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
				String s3Filename = (dirName != null ? dirName + "/" : "") + fileName;

				File documentFile = new File(TMP_DIR + File.separator + fileName);

				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(documentFile));
				stream.write(bytes);
				stream.close();
				//LOGGER.info("[enviarArquivoS3] Arquivo de " + documentFile.length() + " bytes: " + documentFile.getAbsolutePath());
				// Upload para o S3 Bucket
				s3client.putObject(new PutObjectRequest(bucketName, s3Filename, documentFile).withCannedAcl(CannedAccessControlList.PublicRead));
				if (deleteDocumentFile) documentFile.delete();

				return "https://" + bucketName + ".s3." + DEFAULT_AWS_REGION + ".amazonaws.com/" + s3Filename;
			}
		} catch (Exception e) {
			LOGGER.error("[enviarArquivoS3] Erro ao salvar arquivo no S3 " + dirName + "/" + fileName + ": " + e.getMessage(), e);
		}

		return null;
	}
	
	public static String enviarArquivoS3(String dirName, String fileName, String bucketName, File documentFile) {
		try {
			if (documentFile != null) {
				AmazonS3 s3client = AmazonS3ClientBuilder.standard().withCredentials(getAwsCredentialProvider(S3_ACCESS_KEY, S3_PASSWORD_KEY)).withRegion(DEFAULT_AWS_REGION).build();

				String s3Filename = (dirName != null ? dirName + "/" : "") + fileName;

				// Upload para o S3 Bucket
				s3client.putObject(new PutObjectRequest(bucketName, s3Filename, documentFile).withCannedAcl(CannedAccessControlList.PublicRead));
				documentFile.delete();

				return "https://" + bucketName + ".s3." + DEFAULT_AWS_REGION + ".amazonaws.com/" + s3Filename;
			}
		} catch (Exception e) {
			LOGGER.error("[enviarArquivoS3] Erro ao salvar arquivo no S3 " + dirName + "/" + fileName + ": " + e.getMessage(), e);
		}

		return null;
	}

	public static boolean excluirArquivoS3(String dirName, String fileName, String bucketName) {
		try {
			if (fileName != null && !"".equals(fileName.trim())) {
				AmazonS3 s3client = AmazonS3ClientBuilder.standard().withCredentials(getAwsCredentialProvider(S3_ACCESS_KEY, S3_PASSWORD_KEY)).withRegion(DEFAULT_AWS_REGION).build();

				String s3Filename = (dirName != null ? dirName + "/" : "") + fileName;

				// Exclui arquivo do S3 Bucket
				s3client.deleteObject(new DeleteObjectRequest(bucketName, s3Filename));

				return true;
			}
		} catch (Exception e) {
			LOGGER.error("[excluirArquivoS3] Erro ao excluir arquivo no S3 " + dirName + "/" + fileName + ": " + e.getMessage(), e);
		}

		return false;
	}

	public static CreateCollectionResult createRekognitionCollection(String collectionId) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Criando coleção: " + collectionId);

		CreateCollectionRequest request = new CreateCollectionRequest().withCollectionId(collectionId);

		CreateCollectionResult createCollectionResult = rekognitionClient.createCollection(request);

		return createCollectionResult;

	}
	
	public static List<String> listRekognitionCollections() {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
				.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
				.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Listando coleções:");

		List<String> collections = new ArrayList<>();

		ListCollectionsResult listCollectionsResult = null;
	    String paginationToken = null;
		do {
			if (listCollectionsResult != null) {
				paginationToken = listCollectionsResult.getNextToken();
			}
			ListCollectionsRequest listCollectionsRequest = new ListCollectionsRequest().withMaxResults(100).withNextToken(paginationToken);
			listCollectionsResult = rekognitionClient.listCollections(listCollectionsRequest);

			List<String> collectionIds = listCollectionsResult.getCollectionIds();
			for (String resultId : collectionIds) {
				collections.add(resultId);
			}
		} while (listCollectionsResult != null && listCollectionsResult.getNextToken() != null);
  
		return collections;
	}
	
	public static List<Face> listFacesInRekognitionCollection(String collectionId) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
				.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
				.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Listando faces na coleção: " + collectionId);

		List<Face> facesList = new ArrayList<>();

		ListFacesResult listFacesResult = null;

		String paginationToken = null;
		do {
			if (listFacesResult != null) {
				paginationToken = listFacesResult.getNextToken();
			}

			ListFacesRequest listFacesRequest = new ListFacesRequest().withCollectionId(collectionId)
																	  .withMaxResults(100)
																	  .withNextToken(paginationToken);

			listFacesResult = rekognitionClient.listFaces(listFacesRequest);
			List<Face> faces = listFacesResult.getFaces();
			for (Face face : faces) {
				facesList.add(face);
			}
		} while (listFacesResult != null && listFacesResult.getNextToken() != null);

		return facesList;
	}

	public static IndexFacesResult addFaceToRekognitionCollection(String bucketName, String imagePath, String collectionId, String userId) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Adicionando face a coleção " + collectionId + " a partir do bucket " + bucketName + "/" + imagePath);

		Image image = new Image().withS3Object(new S3Object().withBucket(bucketName).withName(imagePath));

		IndexFacesRequest indexFacesRequest = new IndexFacesRequest().withImage(image).withExternalImageId(userId).withCollectionId(collectionId).withDetectionAttributes("ALL");

		IndexFacesResult indexFacesResult = rekognitionClient.indexFaces(indexFacesRequest);

		return indexFacesResult;
	}
	
	public static List<String> removeFaceToRekognitionCollection(String faceId, String collectionId) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Removendo face " + faceId + " da coleção " + collectionId);

		DeleteFacesRequest deleteFacesRequest = new DeleteFacesRequest().withCollectionId(collectionId).withFaceIds(faceId);

		DeleteFacesResult deleteFacesResult = rekognitionClient.deleteFaces(deleteFacesRequest);

		List<String> faceRecords = deleteFacesResult.getDeletedFaces();

		return faceRecords;
	}

	public static List<FaceMatch> searchFaceInCollection(String bucketName, String imagePath, String collectionId) {

		return searchFaceInCollection(bucketName, imagePath, collectionId, 80F, 1);
	}

	public static List<FaceMatch> searchFaceInCollection(String bucketName, String imagePath, String collectionId, float threshold, int maxFaces) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Pesquisando face " + bucketName + "/" + imagePath + " na coleção " + collectionId);

		Image image = new Image().withS3Object(new S3Object().withBucket(bucketName).withName(imagePath));

		SearchFacesByImageRequest searchFacesByImageRequest = new SearchFacesByImageRequest()
																.withCollectionId(collectionId)
																.withImage(image)
																.withFaceMatchThreshold(threshold)
																.withMaxFaces(maxFaces);

		SearchFacesByImageResult searchFacesByImageResult = rekognitionClient.searchFacesByImage(searchFacesByImageRequest);
		List<FaceMatch> faceImageMatches = searchFacesByImageResult.getFaceMatches();

		return faceImageMatches;
	}
	
	public static List<FaceMatch> searchFaceInCollection(File imageFile, String collectionId, float threshold, int maxFaces) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		LOGGER.info("[Amazon Rekognition] Pesquisando face na coleção " + collectionId + " a partir do arquivo " + imageFile.getAbsolutePath());
		
		List<FaceMatch> faceImageMatches = null;

		try {
			InputStream is = new FileInputStream(imageFile);
			byte[] bytes = IOUtils.toByteArray(is);
			ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);

			Image image = new Image().withBytes(byteBuffer);

			SearchFacesByImageRequest searchFacesByImageRequest = new SearchFacesByImageRequest()
																	.withCollectionId(collectionId)
																	.withImage(image)
																	.withFaceMatchThreshold(threshold)
																	.withMaxFaces(maxFaces);

			SearchFacesByImageResult searchFacesByImageResult = rekognitionClient.searchFacesByImage(searchFacesByImageRequest);
			faceImageMatches = searchFacesByImageResult.getFaceMatches();
		} catch (Exception e) {
			LOGGER.error("Erro ao pesquisar face na colecao a partir de arquivo: " + e.getMessage(), e);
		}

		return faceImageMatches;
	}
	
	public static DetectFacesResult detectFaces(String bucketName, String imagePath) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		DetectFacesRequest request = new DetectFacesRequest()
										.withImage(new Image().withS3Object(new S3Object().withName(imagePath)
																						  .withBucket(bucketName)))
										.withAttributes(Attribute.ALL);

		DetectFacesResult result = rekognitionClient.detectFaces(request);
        //List<FaceDetail> faceDetails = result.getFaceDetails();

        return result;
	}

	public static DetectFacesResult detectFaces(File imageFile) {
		AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder.standard()
												.withCredentials(getAwsCredentialProvider(AI_ACCESS_KEY, AI_PASSWORD_KEY))
												.withRegion(DEFAULT_AWS_REGION).build();

		//List<FaceDetail> faceDetails = null;
		try {
			InputStream is = new FileInputStream(imageFile);
			byte[] bytes = IOUtils.toByteArray(is);
			ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);
			DetectFacesRequest request = new DetectFacesRequest()
											.withImage(new Image().withBytes(byteBuffer))
											.withAttributes(Attribute.ALL);

			DetectFacesResult result = rekognitionClient.detectFaces(request);
			//faceDetails = result.getFaceDetails();

			return result;
		} catch (Exception e) {
			LOGGER.error("Erro ao identificar face a partir de arquivo: " + e.getMessage(), e);
		}

        return null;
	}

	public static File downloadS3Object(String bucketName, String s3FilePath, String localFileName) {
		AmazonS3 s3client = AmazonS3ClientBuilder.standard().withCredentials(getAwsCredentialProvider(S3_ACCESS_KEY, S3_PASSWORD_KEY)).withRegion(DEFAULT_AWS_REGION).build();

		File file = new File(localFileName);

		com.amazonaws.services.s3.model.S3Object obj = s3client.getObject(bucketName, s3FilePath);
		try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file)); 
			 S3ObjectInputStream s3is = obj.getObjectContent();) {

			byte[] readBuffArr = new byte[4096];
			int readBytes = 0;
			while ((readBytes = s3is.read(readBuffArr)) >= 0) {
				bos.write(readBuffArr, 0, readBytes);
			}

		} catch (Exception e) {
			LOGGER.error("Erro efetuando download do arquivo " + bucketName + "/" + s3FilePath);
		}

		return file;
	}
}
