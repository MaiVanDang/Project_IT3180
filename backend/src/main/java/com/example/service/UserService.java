package com.example.service;

import com.example.dto.request.UserCreateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.UserResponse;
import com.example.entity.User;
import com.example.exception.UserInfoException;
import com.example.mapper.UserMapper;
import com.example.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieve all users from database
     */
    public List<User> fetchAllUser() {
        List<User> userList = new ArrayList<>();
        userList.addAll(this.userRepository.findAll());
        return userList;
    }

    /**
     * Convert and fetch all users as UserResponse
     */
    public List<UserResponse> fetchAllUserResponse() {
        var users = this.fetchAllUser();
        return Optional.ofNullable(users)
                .map(this.userMapper::toUserResponseList)
                .orElse(new ArrayList<>());
    }

    /**
     * Find user by their unique identifier
     */
    public User fetchUserById(final long id) throws UserInfoException {
        var userOptional = this.userRepository.findById(id);
        var user = userOptional.orElseThrow(() -> 
            new UserInfoException(String.format("User with id %d is not found", id)));
            
        if (user.getIsActive() == 0) {
            throw new UserInfoException(String.format("User with id %d is not active", id));
        }
        return user;
    }

    /**
     * Retrieve user by email address
     */
    public User getUserByEmail(final String email) {
        return Optional.ofNullable(this.userRepository.findByEmail(email))
                .orElse(null);
    }

    /**
     * Soft delete user by setting isActive to 0
     */
    public ApiResponse<String> deleteUser(final long id) throws UserInfoException {
        var currentUser = this.fetchUserById(id);
        if (currentUser != null) {
            currentUser.setIsActive(0);
            this.userRepository.save(currentUser);
        } else {
            throw new UserInfoException(String.format("User with id %d is not found", id));
        }
        
        var response = new ApiResponse<String>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("delete user success");
        response.setData(null);
        return response;
    }

    /**
     * Update existing user information
     */
    public User updateUser(final User reqUser) throws UserInfoException {
        var currentUser = this.fetchUserById(reqUser.getId());
        
        if (currentUser != null) {
            currentUser.setEmail(reqUser.getEmail());
            currentUser.setName(reqUser.getName());
            var encodedPassword = this.passwordEncoder.encode(reqUser.getPassword());
            currentUser.setPassword(encodedPassword);
            return this.userRepository.save(currentUser);
        }
        
        throw new UserInfoException(String.format("User with id %d is not found", reqUser.getId()));
    }

    /**
     * Verify if email already exists in system
     */
    public boolean isEmailExist(final String email) {
        return Optional.ofNullable(this.userRepository.findByEmail(email)).isPresent();
    }

    /**
     * Create new user or reactivate existing one
     */
    public User createUser(final UserCreateRequest userCreateRequest) throws UserInfoException {
        if (this.isEmailExist(userCreateRequest.getEmail())) {
            var existingUser = this.getUserByEmail(userCreateRequest.getEmail());
            
            if (existingUser.getIsActive() == 1) {
                throw new UserInfoException(String.format("User with email %s already exists", userCreateRequest.getEmail()));
            }
            
            existingUser.setIsActive(1);
            return this.userRepository.save(existingUser);
        }

        var newUser = new User();
        newUser.setName(userCreateRequest.getName());
        newUser.setPassword(this.passwordEncoder.encode(userCreateRequest.getPassword()));
        newUser.setEmail(userCreateRequest.getEmail());
        newUser.setAuthType("normal");
        
        return this.userRepository.save(newUser);
    }

    /**
     * Update user's refresh token
     */
    public void updateUserToken(final String token, final String email) {
        Optional.ofNullable(this.getUserByEmail(email))
                .ifPresent(currentUser -> {
                    currentUser.setRefreshToken(token);
                    this.userRepository.save(currentUser);
                });
    }

    /**
     * Find user by refresh token and email combination
     */
    public User getUserByRefreshTokenAndEmail(final String token, final String email) {
        return Optional.ofNullable(this.userRepository.findByRefreshTokenAndEmail(token, email))
                .orElse(null);
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    public UserResponse UserToUserResponse(final User user) {
        return Optional.ofNullable(user)
                .map(this.userMapper::toUserResponse)
                .orElse(null);
    }
}