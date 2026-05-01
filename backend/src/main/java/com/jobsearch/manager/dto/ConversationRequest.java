package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.Channel;
import com.jobsearch.manager.entity.MessageDirection;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ConversationRequest {

    @NotNull(message = "Contact is required")
    private Long contactId;

    private Channel channel;
    private MessageDirection messageDirection;
    private String messageText;
    private LocalDate conversationDate;
    private LocalDate nextFollowUpAt;
    private String aiSuggestedReply;
}
