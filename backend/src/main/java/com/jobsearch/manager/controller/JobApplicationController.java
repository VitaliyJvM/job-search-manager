package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.JobApplicationRequest;
import com.jobsearch.manager.dto.JobApplicationResponse;
import com.jobsearch.manager.entity.ApplicationStatus;
import com.jobsearch.manager.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping
    public List<JobApplicationResponse> findAll(
            @RequestParam(required = false) ApplicationStatus status) {
        return jobApplicationService.findAll(status);
    }

    @GetMapping("/{id}")
    public JobApplicationResponse findById(@PathVariable Long id) {
        return jobApplicationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse create(@Valid @RequestBody JobApplicationRequest request) {
        return jobApplicationService.create(request);
    }

    @PutMapping("/{id}")
    public JobApplicationResponse update(@PathVariable Long id,
                                         @Valid @RequestBody JobApplicationRequest request) {
        return jobApplicationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        jobApplicationService.delete(id);
    }
}
