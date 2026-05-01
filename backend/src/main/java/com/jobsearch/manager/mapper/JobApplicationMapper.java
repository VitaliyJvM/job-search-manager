package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.JobApplicationRequest;
import com.jobsearch.manager.dto.JobApplicationResponse;
import com.jobsearch.manager.entity.Company;
import com.jobsearch.manager.entity.JobApplication;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationMapper {

    public JobApplicationResponse toResponse(JobApplication app) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(app.getId());
        if (app.getCompany() != null) {
            response.setCompanyId(app.getCompany().getId());
            response.setCompanyName(app.getCompany().getName());
        }
        response.setJobTitle(app.getJobTitle());
        response.setJobDescription(app.getJobDescription());
        response.setStatus(app.getStatus());
        response.setSalaryRange(app.getSalaryRange());
        response.setSourceUrl(app.getSourceUrl());
        response.setResumeVersionUsed(app.getResumeVersionUsed());
        response.setAppliedAt(app.getAppliedAt());
        response.setNextFollowUpAt(app.getNextFollowUpAt());
        response.setNotes(app.getNotes());
        response.setCreatedAt(app.getCreatedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        return response;
    }

    public JobApplication toEntity(JobApplicationRequest request, Company company) {
        return JobApplication.builder()
                .company(company)
                .jobTitle(request.getJobTitle())
                .jobDescription(request.getJobDescription())
                .status(request.getStatus())
                .salaryRange(request.getSalaryRange())
                .sourceUrl(request.getSourceUrl())
                .resumeVersionUsed(request.getResumeVersionUsed())
                .appliedAt(request.getAppliedAt())
                .nextFollowUpAt(request.getNextFollowUpAt())
                .notes(request.getNotes())
                .build();
    }

    public void updateEntity(JobApplication app, JobApplicationRequest request, Company company) {
        app.setCompany(company);
        app.setJobTitle(request.getJobTitle());
        app.setJobDescription(request.getJobDescription());
        app.setStatus(request.getStatus());
        app.setSalaryRange(request.getSalaryRange());
        app.setSourceUrl(request.getSourceUrl());
        app.setResumeVersionUsed(request.getResumeVersionUsed());
        app.setAppliedAt(request.getAppliedAt());
        app.setNextFollowUpAt(request.getNextFollowUpAt());
        app.setNotes(request.getNotes());
    }
}
