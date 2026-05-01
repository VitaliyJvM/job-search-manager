package com.jobsearch.manager.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class FileExtractionService {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase()
                : "";

        if (filename.endsWith(".pdf")) {
            return extractFromPdf(file.getBytes());
        } else if (filename.endsWith(".docx")) {
            return extractFromDocx(file.getInputStream());
        } else if (filename.endsWith(".doc")) {
            throw new IllegalArgumentException("Legacy .doc format is not supported. Please convert to .docx or .pdf.");
        } else {
            // Treat as plain text (txt, md, etc.)
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        }
    }

    private String extractFromPdf(byte[] data) throws IOException {
        try (PDDocument document = Loader.loadPDF(data)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.debug("Extracted {} chars from PDF", text.length());
            return text;
        }
    }

    private String extractFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            StringBuilder sb = new StringBuilder();
            document.getParagraphs().forEach(para -> {
                sb.append(para.getText());
                sb.append("\n");
            });
            String text = sb.toString();
            log.debug("Extracted {} chars from DOCX", text.length());
            return text;
        }
    }
}
