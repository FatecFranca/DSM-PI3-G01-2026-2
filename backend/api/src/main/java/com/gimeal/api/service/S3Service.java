package com.gimeal.api.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service 
public class S3Service {
    
    @Autowired 
    private S3Client s3Client;

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
