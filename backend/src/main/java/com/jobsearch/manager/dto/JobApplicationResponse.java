package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.ApplicationStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {

    private Long id;
    private Long companyId;
    private String companyName;
    private String jobTitle;
    private String jobDescription;
    private ApplicationStatus status;
    private String salaryRange;
    private String sourceUrl;
    private String resumeVersionUsed;
    private LocalDate appliedAt;
    private LocalDate nextFollowUpAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
