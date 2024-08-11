package ru.kata.spring.boot_security.demo.exceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<UserDataInfo> handleException(NoSuchUserException ex) {
        return new ResponseEntity<>(new UserDataInfo(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<UserDataInfo> handleException(NoUniqueLoginException ex) {
        return new ResponseEntity<>(new UserDataInfo(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<UserDataInfo> handleException(Exception ex) {
        return new ResponseEntity<>(new UserDataInfo(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
