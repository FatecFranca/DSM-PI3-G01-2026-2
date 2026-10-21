package com.gimeal.api.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service 
public class S3Service {
    
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    @Autowired 
    private S3Client s3Client;

    @Autowired 
    private S3Presigner s3Presigner;

    @Value("${aws.bucket-name}")
    private String bucketName;

    public String uploadFile(MultipartFile file) {

        String entityFile = "images/";
        String fileUri = UUID.randomUUID().toString();

        String fileName = entityFile + fileUri; 
        File fileObj = convertMultiPartFileToFile(file);

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName) 
                .build();

        s3Client.putObject(objectRequest, fileObj.toPath());

        fileObj.delete();
        
        return fileUri;
    }

    public String criarGetUrlTemporaria(String fileName) {
        
        String key = "images/" + fileName;

        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(objectRequest)
                .build();
        
        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        logger.info("URL TEMPORÁRIA: [{}]", presignedRequest.url().toString());
        logger.info("HTTP method: [{}]", presignedRequest.httpRequest().method());

        return presignedRequest.url().toExternalForm();
        
    }

    private File convertMultiPartFileToFile(MultipartFile file) {

        File convertedFile = new File(file.getOriginalFilename());

        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return convertedFile;
    }

}
