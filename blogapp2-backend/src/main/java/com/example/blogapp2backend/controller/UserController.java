package com.example.blogapp2backend.controller;

import com.example.blogapp2backend.entity.User;
import com.example.blogapp2backend.service.UserService;
import com.fasterxml.jackson.databind.annotation.JsonAppend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final com.example.blogapp2backend.mapper.UserMapper userMapper;

    public UserController(UserService userService, com.example.blogapp2backend.mapper.UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<com.example.blogapp2backend.dto.response.user.PublicUserResponse> getAllUsers() {
        return userService.findAll().stream()
                .map(userMapper::toPublicResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public com.example.blogapp2backend.dto.response.user.PublicUserResponse getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return userMapper.toPublicResponse(user);
    }
}