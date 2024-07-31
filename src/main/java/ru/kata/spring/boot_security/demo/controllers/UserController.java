package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;

@Controller
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserController(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;

    }

    @GetMapping("/")
    public String userList() {
        return "index";
    }

    @GetMapping("/admin")
    public String userList(Model model) {
        List<User> users = userService.findAllUsers();
        model.addAttribute("users", users);
        return "admin";
    }

    @GetMapping("/delete")
    public String deleteUser(@ModelAttribute("user") User user) {
        userService.delete(user);
        return "redirect:/admin";
    }

    @GetMapping("/add")
    public String createUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getRoles());
        return "admin/add_user";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.createUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String editUser(@RequestParam(name = "id") long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.getRoles());
        return "admin/edit_user";
    }

    @PostMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/user")
    public String showUser(Principal principal, Model model) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }
}