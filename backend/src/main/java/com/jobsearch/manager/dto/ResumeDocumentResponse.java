package com.jobsearch.manager.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResumeDocumentResponse {

    private Long id;
    private String name;
    private String originalFilename;
    private String contentText;
    private String filePath;
    private Boolean isMaster;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
