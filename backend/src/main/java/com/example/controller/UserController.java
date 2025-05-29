package com.example.controller;

import com.example.dto.request.UserCreateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.UserResponse;
import com.example.exception.UserInfoException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.entity.User;
import com.example.service.UserService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "User Controller")
public class UserController {
    private final UserService userService;

    //fetch all users
    @Operation(summary = "Get list of users", description = "Get list of users")
    @GetMapping("/")
    public ResponseEntity<List<UserResponse>> getAllUser() {
        List<UserResponse> userResponses = this.userService.fetchAllUserResponse();
        return ResponseEntity.status(HttpStatus.OK).body(userResponses);
    }

    //fetch user by id
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") long id) throws Exception {
        User fetchUser = this.userService.fetchUserById(id);
        UserResponse userResponse = this.userService.UserToUserResponse(fetchUser);
        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    //Create new user
    @PostMapping("/register")
    public ResponseEntity<User> createNewUser(@Valid @RequestBody UserCreateRequest apiUser) throws Exception {
        User user = this.userService.createUser(apiUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    //Delete user by id
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable("id") long id) throws Exception {
        ApiResponse<String> response = this.userService.deleteUser(id);
        return ResponseEntity.ok(response);
    }

    //Update user
    @PutMapping()
    public ResponseEntity<User> updateUser(@RequestBody User user) throws Exception {
        User apiUser = this.userService.updateUser(user);
        return ResponseEntity.ok(apiUser);
    }

}
