# Single stage - Maven handles both build and runtime
FROM maven:3.8.1-openjdk-17
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/educonnect-backend-1.0.0.jar"]
