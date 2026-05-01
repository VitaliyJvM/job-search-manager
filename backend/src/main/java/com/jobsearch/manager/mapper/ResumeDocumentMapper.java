package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.ResumeDocumentResponse;
import com.jobsearch.manager.entity.ResumeDocument;
import org.springframework.stereotype.Component;

@Component
public class ResumeDocumentMapper {

    public ResumeDocumentResponse toResponse(ResumeDocument doc) {
        ResumeDocumentResponse response = new ResumeDocumentResponse();
        response.setId(doc.getId());
        response.setName(doc.getName());
        response.setOriginalFilename(doc.getOriginalFilename());
        response.setContentText(doc.getContentText());
        response.setFilePath(doc.getFilePath());
        response.setIsMaster(doc.getIsMaster());
        response.setCreatedAt(doc.getCreatedAt());
        response.setUpdatedAt(doc.getUpdatedAt());
        return response;
    }
}
