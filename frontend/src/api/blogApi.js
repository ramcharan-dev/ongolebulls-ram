/**
 * Blog API — maps to BlogController (/api/blogs)
 */
import api from './axiosConfig';

/**
 * GET /api/blogs
 * Fetch all published blog posts.
 */
export const getAllBlogs = () =>
  api.get('/api/blogs');

/**
 * GET /api/blogs/{id}
 * Fetch a single blog post by ID.
 */
export const getBlogById = (id) =>
  api.get(`/api/blogs/${id}`);

/**
 * POST /api/blogs   (multipart/form-data)
 * Create a new blog post. Optionally attach an image file.
 *
 * FormData fields:
 *   title, shortDescription, fullContent, author
 *   imageFile (optional File)
 */
export const createBlog = (formData) =>
  api.post('/api/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * PUT /api/blogs/{id}   (multipart/form-data)
 * Update an existing blog post. Only non-empty fields are updated.
 *
 * FormData fields (all optional — only updates provided fields):
 *   title, shortDescription, fullContent, author
 *   imageFile (optional new image File)
 */
export const updateBlog = (id, formData) =>
  api.put(`/api/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * DELETE /api/blogs/{id}
 * Delete a blog post. Returns 204 No Content on success.
 */
export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`);
