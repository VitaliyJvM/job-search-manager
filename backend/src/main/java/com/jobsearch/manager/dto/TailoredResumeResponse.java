package com.jobsearch.manager.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TailoredResumeResponse {

    private Long id;
    private Long jobApplicationId;
    private String jobTitle;
    private Long masterResumeId;
    private String masterResumeName;
    private Long promptTemplateId;
    private String promptTemplateName;
    private String generatedContent;
    private String changeSummary;
    private String gapsOrWarnings;
    private LocalDateTime createdAt;
}
