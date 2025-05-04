package com.example.mapper;

import com.example.dto.response.UserResponse;
import org.mapstruct.Mapper;
import com.example.entity.User;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "email", target = "email")
    UserResponse toUserResponse(User user);

    List<UserResponse> toUserResponseList(List<User> users);
}
