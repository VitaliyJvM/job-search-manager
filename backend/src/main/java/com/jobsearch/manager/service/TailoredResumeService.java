package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.TailoredResumeResponse;
import com.jobsearch.manager.dto.TailoringRequest;
import com.jobsearch.manager.entity.JobApplication;
import com.jobsearch.manager.entity.OpenAiModel;
import com.jobsearch.manager.entity.PromptTemplate;
import com.jobsearch.manager.entity.ResumeDocument;
import com.jobsearch.manager.entity.TailoredResume;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.TailoredResumeMapper;
import com.jobsearch.manager.repository.JobApplicationRepository;
import com.jobsearch.manager.repository.PromptTemplateRepository;
import com.jobsearch.manager.repository.TailoredResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TailoredResumeService {

    private final TailoredResumeRepository tailoredResumeRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final PromptTemplateRepository promptTemplateRepository;
    private final ResumeDocumentService resumeDocumentService;
    private final OpenAiService openAiService;
    private final TailoredResumeMapper mapper;

    public List<TailoredResumeResponse> findAll(Long jobApplicationId) {
        List<TailoredResume> list = (jobApplicationId != null)
                ? tailoredResumeRepository.findByJobApplication_IdOrderByCreatedAtDesc(jobApplicationId)
                : tailoredResumeRepository.findAllByOrderByCreatedAtDesc();
        return list.stream().map(mapper::toResponse).toList();
    }

    public TailoredResumeResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public TailoredResumeResponse generate(TailoringRequest request) {
        // Resolve master resume
        ResumeDocument masterResume = resumeDocumentService.getEntityOrThrow(request.getMasterResumeId());
        if (masterResume.getContentText() == null || masterResume.getContentText().isBlank()) {
            throw new IllegalArgumentException("Master resume has no extracted text. Please re-upload or paste the content.");
        }

        // Resolve prompt template
        PromptTemplate promptTemplate = promptTemplateRepository.findById(request.getPromptTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("PromptTemplate", request.getPromptTemplateId()));

        // Resolve job description (from request or linked application)
        String jobDescription = resolveJobDescription(request);
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description is required. Provide it directly or link to a job application with a description.");
        }

        // Resolve optional job application
        JobApplication jobApplication = null;
        if (request.getJobApplicationId() != null) {
            jobApplication = jobApplicationRepository.findById(request.getJobApplicationId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobApplication", request.getJobApplicationId()));
        }

        OpenAiModel resolvedModel = (request.getModel() != null) ? request.getModel() : OpenAiModel.DEFAULT;
        log.info("Generating tailored resume: masterResume={}, prompt={}, model={}", masterResume.getName(), promptTemplate.getName(), resolvedModel.getModelId());

        // Call OpenAI
        OpenAiService.TailoredResumeResult result = openAiService.generateTailoredResume(
                masterResume.getContentText(),
                jobDescription,
                promptTemplate.getPromptText(),
                resolvedModel
        );

        // Persist result
        TailoredResume tailored = TailoredResume.builder()
                .jobApplication(jobApplication)
                .masterResume(masterResume)
                .promptTemplate(promptTemplate)
                .generatedContent(result.tailoredResume())
                .changeSummary(result.changeSummary())
                .gapsOrWarnings(result.gapsOrWarnings())
                .build();

        return mapper.toResponse(tailoredResumeRepository.save(tailored));
    }

    private String resolveJobDescription(TailoringRequest request) {
        if (request.getJobDescription() != null && !request.getJobDescription().isBlank()) {
            return request.getJobDescription();
        }
        if (request.getJobApplicationId() != null) {
            return jobApplicationRepository.findById(request.getJobApplicationId())
                    .map(JobApplication::getJobDescription)
                    .orElse(null);
        }
        return null;
    }

    private TailoredResume getOrThrow(Long id) {
        return tailoredResumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TailoredResume", id));
    }
}
