package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.ConversationRequest;
import com.jobsearch.manager.dto.ConversationResponse;
import com.jobsearch.manager.entity.Contact;
import com.jobsearch.manager.entity.Conversation;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.ConversationMapper;
import com.jobsearch.manager.repository.ContactRepository;
import com.jobsearch.manager.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ContactRepository contactRepository;
    private final ConversationMapper mapper;

    public List<ConversationResponse> findAll(Long contactId) {
        List<Conversation> conversations = (contactId != null)
                ? conversationRepository.findByContact_IdOrderByConversationDateDesc(contactId)
                : conversationRepository.findAllByOrderByConversationDateDesc();
        return conversations.stream().map(mapper::toResponse).toList();
    }

    public ConversationResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public ConversationResponse create(ConversationRequest request) {
        Contact contact = contactRepository.findById(request.getContactId())
                .orElseThrow(() -> new ResourceNotFoundException("Contact", request.getContactId()));
        Conversation conversation = mapper.toEntity(request, contact);
        return mapper.toResponse(conversationRepository.save(conversation));
    }

    @Transactional
    public ConversationResponse update(Long id, ConversationRequest request) {
        Conversation conversation = getOrThrow(id);
        Contact contact = contactRepository.findById(request.getContactId())
                .orElseThrow(() -> new ResourceNotFoundException("Contact", request.getContactId()));
        mapper.updateEntity(conversation, request, contact);
        return mapper.toResponse(conversationRepository.save(conversation));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        conversationRepository.deleteById(id);
    }

    private Conversation getOrThrow(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", id));
    }
}
