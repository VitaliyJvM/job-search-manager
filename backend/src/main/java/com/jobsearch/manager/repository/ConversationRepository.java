package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByContact_IdOrderByConversationDateDesc(Long contactId);

    List<Conversation> findAllByOrderByConversationDateDesc();
}
