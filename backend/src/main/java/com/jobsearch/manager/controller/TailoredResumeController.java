package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.TailoredResumeResponse;
import com.jobsearch.manager.dto.TailoringRequest;
import com.jobsearch.manager.service.TailoredResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tailored-resumes")
@RequiredArgsConstructor
public class TailoredResumeController {

    private final TailoredResumeService tailoredResumeService;

    @GetMapping
    public List<TailoredResumeResponse> findAll(
            @RequestParam(required = false) Long jobApplicationId) {
        return tailoredResumeService.findAll(jobApplicationId);
    }

    @GetMapping("/{id}")
    public TailoredResumeResponse findById(@PathVariable Long id) {
        return tailoredResumeService.findById(id);
    }

    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public TailoredResumeResponse generate(@Valid @RequestBody TailoringRequest request) {
        return tailoredResumeService.generate(request);
    }
}
