package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.ConversationRequest;
import com.jobsearch.manager.dto.ConversationResponse;
import com.jobsearch.manager.entity.Contact;
import com.jobsearch.manager.entity.Conversation;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper {

    public ConversationResponse toResponse(Conversation conversation) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        if (conversation.getContact() != null) {
            response.setContactId(conversation.getContact().getId());
            response.setContactName(conversation.getContact().getFullName());
            if (conversation.getContact().getCompany() != null) {
                response.setCompanyId(conversation.getContact().getCompany().getId());
                response.setCompanyName(conversation.getContact().getCompany().getName());
            }
        }
        response.setChannel(conversation.getChannel());
        response.setMessageDirection(conversation.getMessageDirection());
        response.setMessageText(conversation.getMessageText());
        response.setConversationDate(conversation.getConversationDate());
        response.setNextFollowUpAt(conversation.getNextFollowUpAt());
        response.setAiSuggestedReply(conversation.getAiSuggestedReply());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setUpdatedAt(conversation.getUpdatedAt());
        return response;
    }

    public Conversation toEntity(ConversationRequest request, Contact contact) {
        return Conversation.builder()
                .contact(contact)
                .channel(request.getChannel())
                .messageDirection(request.getMessageDirection())
                .messageText(request.getMessageText())
                .conversationDate(request.getConversationDate())
                .nextFollowUpAt(request.getNextFollowUpAt())
                .aiSuggestedReply(request.getAiSuggestedReply())
                .build();
    }

    public void updateEntity(Conversation conversation, ConversationRequest request, Contact contact) {
        conversation.setContact(contact);
        conversation.setChannel(request.getChannel());
        conversation.setMessageDirection(request.getMessageDirection());
        conversation.setMessageText(request.getMessageText());
        conversation.setConversationDate(request.getConversationDate());
        conversation.setNextFollowUpAt(request.getNextFollowUpAt());
        conversation.setAiSuggestedReply(request.getAiSuggestedReply());
    }
}
