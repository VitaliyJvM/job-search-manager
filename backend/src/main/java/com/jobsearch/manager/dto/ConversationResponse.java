package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.Channel;
import com.jobsearch.manager.entity.MessageDirection;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ConversationResponse {

    private Long id;
    private Long contactId;
    private String contactName;
    private Long companyId;
    private String companyName;
    private Channel channel;
    private MessageDirection messageDirection;
    private String messageText;
    private LocalDate conversationDate;
    private LocalDate nextFollowUpAt;
    private String aiSuggestedReply;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
