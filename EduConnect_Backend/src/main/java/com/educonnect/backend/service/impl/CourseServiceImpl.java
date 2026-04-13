package com.educonnect.backend.service.impl;

import com.educonnect.backend.dto.course.CourseCreateRequest;
import com.educonnect.backend.dto.course.CourseResponse;
import com.educonnect.backend.dto.course.CourseUpdateRequest;
import com.educonnect.backend.entity.*;
import com.educonnect.backend.exception.BadRequestException;
import com.educonnect.backend.exception.ResourceNotFoundException;
import com.educonnect.backend.repository.CourseRepository;
import com.educonnect.backend.repository.EnrollmentRepository;
import com.educonnect.backend.repository.UserRepository;
import com.educonnect.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Override
    public CourseResponse createCourse(CourseCreateRequest request) {
        User mentor = getCurrentUser();
        if (mentor.getRole() != Role.MENTOR && mentor.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only mentor/admin can create courses");
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .mentor(mentor)
                .build();

        return toResponse(courseRepository.save(course));
    }

    @Override
    public CourseResponse updateCourse(Long courseId, CourseUpdateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        User current = getCurrentUser();
        if (!course.getMentor().getId().equals(current.getId()) && current.getRole() != Role.ADMIN) {
            throw new BadRequestException("You can update only your courses");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        return toResponse(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        User current = getCurrentUser();
        if (!course.getMentor().getId().equals(current.getId()) && current.getRole() != Role.ADMIN) {
            throw new BadRequestException("You can delete only your courses");
        }
        courseRepository.delete(course);
    }

    @Override
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void enrollInCourse(Long courseId) {
        User student = getCurrentUser();
        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can enroll");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.findByStudentAndCourse(student, course).isPresent()) {
            throw new BadRequestException("Already enrolled");
        }

        Enrollment enrollment = Enrollment.builder().student(student).course(course).build();
        enrollmentRepository.save(enrollment);
    }

    @Override
    public List<String> getEnrolledStudents(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return enrollmentRepository.findByCourse(course)
                .stream().map(e -> e.getStudent().getFullName() + " <" + e.getStudent().getEmail() + ">")
                .toList();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private CourseResponse toResponse(Course course) {
        long enrolledCount = enrollmentRepository.findByCourse(course).size();
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .mentorId(course.getMentor().getId())
                .mentorName(course.getMentor().getFullName())
                .enrolledCount(enrolledCount)
                .build();
    }
}
