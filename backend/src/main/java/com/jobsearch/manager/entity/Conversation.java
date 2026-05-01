package com.jobsearch.manager.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    private Channel channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_direction")
    private MessageDirection messageDirection;

    @Column(name = "message_text", columnDefinition = "TEXT")
    private String messageText;

    @Column(name = "conversation_date")
    private LocalDate conversationDate;

    @Column(name = "next_follow_up_at")
    private LocalDate nextFollowUpAt;

    @Column(name = "ai_suggested_reply", columnDefinition = "TEXT")
    private String aiSuggestedReply;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
