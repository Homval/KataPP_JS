package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.exceptionHandler.NoSuchUserException;
import ru.kata.spring.boot_security.demo.exceptionHandler.NoUniqueLoginException;
import ru.kata.spring.boot_security.demo.exceptionHandler.UserDataInfo;
import ru.kata.spring.boot_security.demo.services.UserServiceInterface;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/rest/admin")
public class AdminRestController {

    private final UserServiceInterface userService;

    @Autowired
    public AdminRestController(UserServiceInterface userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable long id) {
        User user = userService.findById(id);
        if (user == null) {
            throw new NoSuchUserException("User with id " + id + " not found");
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<UserDataInfo> createUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage();
            return new ResponseEntity<>(new UserDataInfo(errorMessage), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.createUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new NoUniqueLoginException("User with login " + user.getEmail() + " already exists");
        }

    }

    @PutMapping()
    public ResponseEntity<UserDataInfo> updateUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage();
            return new ResponseEntity<>(new UserDataInfo(errorMessage), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new NoUniqueLoginException("User with login " + user.getEmail() + " already exists");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDataInfo> deleteUser(@PathVariable long id) {
        userService.deleteById(id);
        return new ResponseEntity<>(new UserDataInfo("User was deleted"), HttpStatus.OK);
    }


}
