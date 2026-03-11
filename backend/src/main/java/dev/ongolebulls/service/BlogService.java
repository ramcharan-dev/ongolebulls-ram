package dev.ongolebulls.service;

import dev.ongolebulls.model.Blog;
import java.util.List;

public interface BlogService {
    List<Blog> getAllBlogs();
    Blog getBlogById(Long id);
    Blog saveBlog(Blog blog);
    boolean deleteBlog(Long id);
    Blog updateBlog(Long id, Blog updatedBlog);
}

