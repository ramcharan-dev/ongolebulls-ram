package dev.ongolebulls.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(@Value("${file.storage.location:uploads}") String storageLocationStr) {
        this.storageLocation = Paths.get(storageLocationStr).toAbsolutePath().normalize();
        try { Files.createDirectories(this.storageLocation); } catch (IOException e) { throw new RuntimeException(e); }
    }

    public String storeFile(MultipartFile file, String prefix) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String finalName = prefix + "_" + System.currentTimeMillis() + "_" + filename;
        try {
            if (filename.contains("..")) throw new IOException("Invalid path sequence " + filename);
            Path target = this.storageLocation.resolve(finalName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + filename, e);
        }
    }
}
