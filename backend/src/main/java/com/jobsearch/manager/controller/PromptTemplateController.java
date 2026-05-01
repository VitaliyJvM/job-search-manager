package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.PromptTemplateRequest;
import com.jobsearch.manager.dto.PromptTemplateResponse;
import com.jobsearch.manager.service.PromptTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptTemplateController {

    private final PromptTemplateService promptTemplateService;

    @GetMapping
    public List<PromptTemplateResponse> findAll() {
        return promptTemplateService.findAll();
    }

    @GetMapping("/{id}")
    public PromptTemplateResponse findById(@PathVariable Long id) {
        return promptTemplateService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromptTemplateResponse create(@Valid @RequestBody PromptTemplateRequest request) {
        return promptTemplateService.create(request);
    }

    @PutMapping("/{id}")
    public PromptTemplateResponse update(@PathVariable Long id,
                                         @Valid @RequestBody PromptTemplateRequest request) {
        return promptTemplateService.update(id, request);
    }

    @PutMapping("/{id}/set-default")
    public PromptTemplateResponse setDefault(@PathVariable Long id) {
        return promptTemplateService.setDefault(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        promptTemplateService.delete(id);
    }
}
