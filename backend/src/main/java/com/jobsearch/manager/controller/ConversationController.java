package com.jobsearch.manager.controller;

import com.jobsearch.manager.dto.ConversationRequest;
import com.jobsearch.manager.dto.ConversationResponse;
import com.jobsearch.manager.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public List<ConversationResponse> findAll(@RequestParam(required = false) Long contactId) {
        return conversationService.findAll(contactId);
    }

    @GetMapping("/{id}")
    public ConversationResponse findById(@PathVariable Long id) {
        return conversationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponse create(@Valid @RequestBody ConversationRequest request) {
        return conversationService.create(request);
    }

    @PutMapping("/{id}")
    public ConversationResponse update(@PathVariable Long id,
                                       @Valid @RequestBody ConversationRequest request) {
        return conversationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        conversationService.delete(id);
    }
}
