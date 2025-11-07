package dev.ongolebulls.controller;

import dev.ongolebulls.model.Blog;
import dev.ongolebulls.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    // Get all blogs
    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    // Get blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Blog blog = blogService.getBlogById(id);
        if (blog == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(blog);
    }

    // Create blog (form-data with image)
    @PostMapping
    public ResponseEntity<Blog> createBlog(
            @ModelAttribute Blog blog,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        handleImageUpload(blog, imageFile);
        blog.setCreatedAt(LocalDateTime.now());

        Blog saved = blogService.saveBlog(blog);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update blog
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(
            @PathVariable Long id,
            @ModelAttribute Blog updatedBlog,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        Blog existing = blogService.getBlogById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        existing.setTitle(updatedBlog.getTitle());
        existing.setShortDescription(updatedBlog.getShortDescription());
        existing.setFullContent(updatedBlog.getFullContent());
        existing.setAuthor(updatedBlog.getAuthor());

        handleImageUpload(existing, imageFile);

        Blog saved = blogService.saveBlog(existing);
        return ResponseEntity.ok(saved);
    }

    // Delete blog
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        boolean deleted = blogService.deleteBlog(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Helper method to save image
    private void handleImageUpload(Blog blog, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
            Path uploadPath = Paths.get("src/main/resources/static/assets/");
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            Files.copy(imageFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            blog.setImage(fileName);
        }
    }
}
