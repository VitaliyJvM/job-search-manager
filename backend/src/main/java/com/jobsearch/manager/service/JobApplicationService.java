package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.JobApplicationRequest;
import com.jobsearch.manager.dto.JobApplicationResponse;
import com.jobsearch.manager.entity.ApplicationStatus;
import com.jobsearch.manager.entity.Company;
import com.jobsearch.manager.entity.JobApplication;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.JobApplicationMapper;
import com.jobsearch.manager.repository.CompanyRepository;
import com.jobsearch.manager.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyRepository companyRepository;
    private final JobApplicationMapper mapper;

    public List<JobApplicationResponse> findAll(ApplicationStatus status) {
        List<JobApplication> apps = (status != null)
                ? jobApplicationRepository.findByStatus(status)
                : jobApplicationRepository.findAll();
        return apps.stream().map(mapper::toResponse).toList();
    }

    public JobApplicationResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public JobApplicationResponse create(JobApplicationRequest request) {
        Company company = resolveCompany(request.getCompanyId());
        JobApplication app = mapper.toEntity(request, company);
        return mapper.toResponse(jobApplicationRepository.save(app));
    }

    @Transactional
    public JobApplicationResponse update(Long id, JobApplicationRequest request) {
        JobApplication app = getOrThrow(id);
        Company company = resolveCompany(request.getCompanyId());
        mapper.updateEntity(app, request, company);
        return mapper.toResponse(jobApplicationRepository.save(app));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        jobApplicationRepository.deleteById(id);
    }

    private JobApplication getOrThrow(Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", id));
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", companyId));
    }
}
