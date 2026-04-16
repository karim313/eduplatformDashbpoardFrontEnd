import api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  instructor?: {
    _id: string;
    name: string;
    email: string;
  };
  price?: number;
  category?: string;
  thumbnail?: string;
  videos?: Video[];
  enrollments?: number;
  rating?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Video {
  _id: string;
  title: string;
  url?: string;
  videoUrl?: string;
  duration?: number | string;
  views?: number;
  size?: string;
  status?: string;
  videoType?: 'youtube' | 'uploaded';
  createdAt?: string;
}

export interface InstructorUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  coursesCount?: number;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  status: string;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export const coursesService = {
  getAll: () =>
    api.get<Course[]>('/courses'),

  getById: (id: string) =>
    api.get<Course>(`/courses/${id}`),

  create: (data: Partial<Course>) =>
    api.post<Course>('/courses', data),

  update: (id: string, data: Partial<Course>) =>
    api.put<Course>(`/courses/${id}`, data),

  delete: (id: string) =>
    api.delete(`/courses/${id}`),

  deleteAll: () =>
    api.delete('/courses'),

  addVideo: (courseId: string, data: FormData | Record<string, any>) =>
    api.post<Course>(`/courses/${courseId}/videos`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    }),

  addVideoToPlaylist: (courseId: string, data: Partial<Video>) =>
    api.post<Course>(`/courses/${courseId}/videos`, data),

  deleteVideo: (courseId: string, videoId: string) =>
    api.delete(`/courses/${courseId}/videos/${videoId}`),

  deleteAllVideos: (courseId: string) =>
    api.delete(`/courses/${courseId}/videos`),
};

// ─── Instructor ───────────────────────────────────────────────────────────────

export const instructorService = {
  getUsers: () =>
    api.get<InstructorUser[]>('/instructor/users'),
};

// ─── Enrollments ──────────────────────────────────────────────────────────────

export const enrollmentsService = {
  purchaseStripe: (courseId: string) =>
    api.post('/enrollments/stripe', { courseId }),

  purchaseVodafone: (courseId: string) =>
    api.post('/enrollments/vodafone', { courseId }),

  verifyEnrollment: (enrollmentId: string) =>
    api.put(`/enrollments/verify`, { enrollmentId }),

  getMyCourses: () =>
    api.get<Enrollment[]>('/enrollments/my-courses'),
};
