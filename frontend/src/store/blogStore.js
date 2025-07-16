import { create } from 'zustand';
import axios from 'axios';

const useBlogStore = create((set, get) => ({
  blogs: [],
  blogCategories: [],
  loading: false,
  error: null,
  selectedCategory: '',

  setBlogs: (blogs) => set({ blogs }),
  setBlogCategories: (blogCategories) => set({ blogCategories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  updateBlog: (updatedBlog) =>
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      ),
    })),
  deleteBlog: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog._id !== id),
    })),

  addBlogCategory: (category) => set((state) => ({ blogCategories: [...state.blogCategories, category] })),
  updateBlogCategory: (updatedCategory) =>
    set((state) => ({
      blogCategories: state.blogCategories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      ),
    })),
  deleteBlogCategory: (id) =>
    set((state) => ({
      blogCategories: state.blogCategories.filter((cat) => cat._id !== id),
    })),

  getBlogsByCategory: (state) => (category) => {
    return state.blogs.filter(blog => blog.category === category);
  },

  fetchBlogs: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:8000/api/blogs');
      set({ blogs: response.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchBlogById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`http://localhost:8000/api/blogs/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchBlogCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:8000/api/blog-categories');
      set({ blogCategories: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchBlogCategoryById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`http://localhost:8000/api/blog-categories/${id}`);
      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useBlogStore;
