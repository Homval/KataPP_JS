package ru.kata.spring.boot_security.demo.exceptionHandler;

public class NoUniqueLoginException extends RuntimeException {
    public NoUniqueLoginException(String message) {
        super(message);
    }
}
