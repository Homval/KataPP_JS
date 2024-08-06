package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.RoleServiceInterface;
import ru.kata.spring.boot_security.demo.services.UserServiceInterface;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminRoleController {

    private final UserServiceInterface userService;
    private final RoleServiceInterface roleService;

    @Autowired
    public AdminRoleController(UserServiceInterface userService, RoleServiceInterface roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String userList(Principal principal, Model model) {
        User admin = userService.findByUsername(principal.getName());
        List<Role> roles = roleService.getRoles();
        List<User> users = userService.findAllUsers();
        model.addAttribute("users", users);
        model.addAttribute("admin", admin);
        model.addAttribute("roles", roles);
        model.addAttribute("newUser", new User());
        return "/admin";
    }

    @GetMapping("/delete")
    public String deleteUser(@ModelAttribute("user") User user) {
        userService.delete(user);
        return "redirect:/admin";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") User user) {
        userService.createUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }
}