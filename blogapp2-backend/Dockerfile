# use amazon corretto (reliable jdk distribution)
FROM amazoncorretto:21-alpine-jdk

WORKDIR /app

COPY gradlew gradlew.bat build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src

RUN chmod +x gradlew
RUN ./gradlew build -x test

EXPOSE 8080

CMD ["java", "-jar", "build/libs/blogapp2-backend-0.0.1-SNAPSHOT.jar"]
