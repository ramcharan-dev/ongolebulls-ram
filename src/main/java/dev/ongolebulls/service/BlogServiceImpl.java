package dev.ongolebulls.service;

import dev.ongolebulls.model.Blog;
import dev.ongolebulls.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    @Override
    public Blog saveBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public boolean deleteBlog(Long id) {
        if (blogRepository.existsById(id)) {
            blogRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Blog updateBlog(Long id, Blog updatedBlog) {
        return blogRepository.findById(id).map(existingBlog -> {
            existingBlog.setTitle(updatedBlog.getTitle());
            existingBlog.setShortDescription(updatedBlog.getShortDescription());
            existingBlog.setFullContent(updatedBlog.getFullContent());
            existingBlog.setImage(updatedBlog.getImage());
            existingBlog.setAuthor(updatedBlog.getAuthor());
            existingBlog.setCreatedAt(updatedBlog.getCreatedAt());
            return blogRepository.save(existingBlog);
        }).orElse(null);
    }

}
