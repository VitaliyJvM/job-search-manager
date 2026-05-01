package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.TailoredResumeResponse;
import com.jobsearch.manager.entity.TailoredResume;
import org.springframework.stereotype.Component;

@Component
public class TailoredResumeMapper {

    public TailoredResumeResponse toResponse(TailoredResume tailored) {
        TailoredResumeResponse response = new TailoredResumeResponse();
        response.setId(tailored.getId());
        if (tailored.getJobApplication() != null) {
            response.setJobApplicationId(tailored.getJobApplication().getId());
            response.setJobTitle(tailored.getJobApplication().getJobTitle());
        }
        if (tailored.getMasterResume() != null) {
            response.setMasterResumeId(tailored.getMasterResume().getId());
            response.setMasterResumeName(tailored.getMasterResume().getName());
        }
        if (tailored.getPromptTemplate() != null) {
            response.setPromptTemplateId(tailored.getPromptTemplate().getId());
            response.setPromptTemplateName(tailored.getPromptTemplate().getName());
        }
        response.setGeneratedContent(tailored.getGeneratedContent());
        response.setChangeSummary(tailored.getChangeSummary());
        response.setGapsOrWarnings(tailored.getGapsOrWarnings());
        response.setCreatedAt(tailored.getCreatedAt());
        return response;
    }
}
