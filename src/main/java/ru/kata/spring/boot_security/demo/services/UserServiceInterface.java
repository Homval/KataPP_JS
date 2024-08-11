package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.entities.User;

import java.util.List;

public interface UserServiceInterface extends UserDetailsService {

    User findByUsername(String username);

    List<User> findAllUsers();

    User save(User user);

    User findById(long id);

    User createUser(User user);

    void delete(User user);

    void deleteById(long id);
}
