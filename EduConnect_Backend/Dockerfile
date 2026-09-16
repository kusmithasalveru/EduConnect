# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Resolve dependencies first so this layer is cached until pom.xml changes.
COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src ./src
RUN mvn -q -B clean package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Run as a non-root user; /app/uploads is the default UPLOAD_DIR.
RUN useradd --system --uid 1001 --create-home app \
    && mkdir -p /app/uploads \
    && chown -R app:app /app
COPY --from=build /app/target/educonnect-backend-*.jar app.jar
USER app

ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# MaxRAMPercentage keeps the heap inside small container limits (e.g. 512 MB on Render free).
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
