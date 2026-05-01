package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.PromptTemplateRequest;
import com.jobsearch.manager.dto.PromptTemplateResponse;
import com.jobsearch.manager.entity.PromptTemplate;
import org.springframework.stereotype.Component;

@Component
public class PromptTemplateMapper {

    public PromptTemplateResponse toResponse(PromptTemplate template) {
        PromptTemplateResponse response = new PromptTemplateResponse();
        response.setId(template.getId());
        response.setName(template.getName());
        response.setType(template.getType());
        response.setPromptText(template.getPromptText());
        response.setIsDefault(template.getIsDefault());
        response.setCreatedAt(template.getCreatedAt());
        response.setUpdatedAt(template.getUpdatedAt());
        return response;
    }

    public PromptTemplate toEntity(PromptTemplateRequest request) {
        return PromptTemplate.builder()
                .name(request.getName())
                .type(request.getType())
                .promptText(request.getPromptText())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();
    }

    public void updateEntity(PromptTemplate template, PromptTemplateRequest request) {
        template.setName(request.getName());
        template.setType(request.getType());
        template.setPromptText(request.getPromptText());
        template.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));
    }
}
