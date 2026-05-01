package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationRequest {

    private Long companyId;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String jobDescription;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String salaryRange;
    private String sourceUrl;
    private String resumeVersionUsed;
    private LocalDate appliedAt;
    private LocalDate nextFollowUpAt;
    private String notes;
}
