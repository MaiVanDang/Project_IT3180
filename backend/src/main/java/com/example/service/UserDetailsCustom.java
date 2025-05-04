package com.example.service;

import com.example.exception.UserInfoException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;


@Component("userDetailsService")
public class UserDetailsCustom implements UserDetailsService {

    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.example.entity.User user = this.userService.getUserByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Username/password is not valid");
        }
        if (user.getIsActive() == 0) {
            try {
                throw new UserInfoException("User is not active");
            } catch (UserInfoException e) {
                throw new RuntimeException(e);
            }
        }
        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))); //hash code authority
    }
}

