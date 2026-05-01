package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.ResumeDocumentResponse;
import com.jobsearch.manager.dto.ResumeTextRequest;
import com.jobsearch.manager.service.ResumeDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeDocumentController {

    private final ResumeDocumentService resumeDocumentService;

    @GetMapping
    public List<ResumeDocumentResponse> findAll() {
        return resumeDocumentService.findAll();
    }

    @GetMapping("/{id}")
    public ResumeDocumentResponse findById(@PathVariable Long id) {
        return resumeDocumentService.findById(id);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResumeDocumentResponse uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "isMaster", defaultValue = "false") Boolean isMaster
    ) throws IOException {
        return resumeDocumentService.uploadFile(file, name, isMaster);
    }

    @PostMapping("/text")
    @ResponseStatus(HttpStatus.CREATED)
    public ResumeDocumentResponse saveText(@Valid @RequestBody ResumeTextRequest request) {
        return resumeDocumentService.saveText(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        resumeDocumentService.delete(id);
    }
}
