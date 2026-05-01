package com.jobsearch.manager.service;

import com.jobsearch.manager.config.OpenAiProperties;
import com.jobsearch.manager.dto.ResumeDocumentResponse;
import com.jobsearch.manager.dto.ResumeTextRequest;
import com.jobsearch.manager.entity.ResumeDocument;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.ResumeDocumentMapper;
import com.jobsearch.manager.repository.ResumeDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResumeDocumentService {

    private final ResumeDocumentRepository resumeDocumentRepository;
    private final ResumeDocumentMapper mapper;
    private final FileExtractionService fileExtractionService;
    private final OpenAiProperties openAiProperties;

    // Injected via application.yml: app.upload.dir
    @org.springframework.beans.factory.annotation.Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public List<ResumeDocumentResponse> findAll() {
        return resumeDocumentRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ResumeDocumentResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public ResumeDocumentResponse uploadFile(MultipartFile file, String name, Boolean isMaster) throws IOException {
        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        // Save file to disk
        String safeFilename = Instant.now().toEpochMilli() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(safeFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text
        String contentText = fileExtractionService.extractText(file);

        ResumeDocument doc = ResumeDocument.builder()
                .name(name != null && !name.isBlank() ? name : file.getOriginalFilename())
                .originalFilename(file.getOriginalFilename())
                .contentText(contentText)
                .filePath(filePath.toString())
                .isMaster(Boolean.TRUE.equals(isMaster))
                .build();

        return mapper.toResponse(resumeDocumentRepository.save(doc));
    }

    @Transactional
    public ResumeDocumentResponse saveText(ResumeTextRequest request) {
        ResumeDocument doc = ResumeDocument.builder()
                .name(request.getName())
                .contentText(request.getContentText())
                .isMaster(Boolean.TRUE.equals(request.getIsMaster()))
                .build();
        return mapper.toResponse(resumeDocumentRepository.save(doc));
    }

    @Transactional
    public void delete(Long id) {
        ResumeDocument doc = getOrThrow(id);
        // Delete physical file if it exists
        if (doc.getFilePath() != null) {
            try {
                Files.deleteIfExists(Paths.get(doc.getFilePath()));
            } catch (IOException ex) {
                log.warn("Could not delete file {}: {}", doc.getFilePath(), ex.getMessage());
            }
        }
        resumeDocumentRepository.deleteById(id);
    }

    public ResumeDocument getEntityOrThrow(Long id) {
        return getOrThrow(id);
    }

    private ResumeDocument getOrThrow(Long id) {
        return resumeDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResumeDocument", id));
    }
}
