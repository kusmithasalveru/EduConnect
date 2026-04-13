package com.educonnect.backend.service;

import com.educonnect.backend.dto.course.CourseCreateRequest;
import com.educonnect.backend.dto.course.CourseResponse;
import com.educonnect.backend.dto.course.CourseUpdateRequest;

import java.util.List;

public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest request);
    CourseResponse updateCourse(Long courseId, CourseUpdateRequest request);
    void deleteCourse(Long courseId);
    List<CourseResponse> getAllCourses();
    void enrollInCourse(Long courseId);
    List<String> getEnrolledStudents(Long courseId);
}
