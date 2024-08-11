package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.UserService;
import ru.kata.spring.boot_security.demo.services.UserServiceInterface;

import java.security.Principal;

@RestController
@RequestMapping("/rest/user")
public class UserRestController {

    private final UserServiceInterface userService;

    public UserRestController(UserServiceInterface userService) {
        this.userService = userService;
    }

    public ResponseEntity<User> findUserByUsername(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(user);
    }
}
