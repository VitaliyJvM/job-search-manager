package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.PromptTemplateRequest;
import com.jobsearch.manager.dto.PromptTemplateResponse;
import com.jobsearch.manager.entity.PromptTemplate;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.PromptTemplateMapper;
import com.jobsearch.manager.repository.PromptTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromptTemplateService {

    private final PromptTemplateRepository promptTemplateRepository;
    private final PromptTemplateMapper mapper;

    public List<PromptTemplateResponse> findAll() {
        return promptTemplateRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public PromptTemplateResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public PromptTemplateResponse create(PromptTemplateRequest request) {
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearExistingDefault();
        }
        PromptTemplate template = mapper.toEntity(request);
        return mapper.toResponse(promptTemplateRepository.save(template));
    }

    @Transactional
    public PromptTemplateResponse update(Long id, PromptTemplateRequest request) {
        PromptTemplate template = getOrThrow(id);
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearExistingDefault();
        }
        mapper.updateEntity(template, request);
        return mapper.toResponse(promptTemplateRepository.save(template));
    }

    @Transactional
    public PromptTemplateResponse setDefault(Long id) {
        clearExistingDefault();
        PromptTemplate template = getOrThrow(id);
        template.setIsDefault(true);
        return mapper.toResponse(promptTemplateRepository.save(template));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        promptTemplateRepository.deleteById(id);
    }

    private PromptTemplate getOrThrow(Long id) {
        return promptTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PromptTemplate", id));
    }

    private void clearExistingDefault() {
        promptTemplateRepository.findFirstByIsDefaultTrue().ifPresent(existing -> {
            existing.setIsDefault(false);
            promptTemplateRepository.save(existing);
        });
    }
}
