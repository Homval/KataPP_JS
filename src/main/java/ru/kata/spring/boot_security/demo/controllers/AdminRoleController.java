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
import java.util.Set;

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
        return "/admin/admin";
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
        return "/admin/add_user";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") User user) {
        userService.createUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String editUser(@RequestParam(name = "id") long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.getRoles());
        return "/admin/edit_user";
    }

    @PostMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }
}