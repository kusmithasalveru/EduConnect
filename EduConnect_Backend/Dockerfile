# Multi-stage build for Spring Boot application
FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/educonnect-backend-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
