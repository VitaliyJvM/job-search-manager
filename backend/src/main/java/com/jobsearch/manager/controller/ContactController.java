package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.ContactRequest;
import com.jobsearch.manager.dto.ContactResponse;
import com.jobsearch.manager.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public List<ContactResponse> findAll(@RequestParam(required = false) Long companyId) {
        return contactService.findAll(companyId);
    }

    @GetMapping("/{id}")
    public ContactResponse findById(@PathVariable Long id) {
        return contactService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        return contactService.create(request);
    }

    @PutMapping("/{id}")
    public ContactResponse update(@PathVariable Long id, @Valid @RequestBody ContactRequest request) {
        return contactService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        contactService.delete(id);
    }
}
