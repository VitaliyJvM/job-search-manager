package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.RelationshipType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactRequest {

    private Long companyId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String roleTitle;
    private String linkedinUrl;
    private String email;
    private RelationshipType relationshipType;
    private String notes;
}
