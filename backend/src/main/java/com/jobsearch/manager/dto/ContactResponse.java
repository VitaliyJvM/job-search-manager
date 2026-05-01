package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.RelationshipType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContactResponse {

    private Long id;
    private Long companyId;
    private String companyName;
    private String fullName;
    private String roleTitle;
    private String linkedinUrl;
    private String email;
    private RelationshipType relationshipType;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
