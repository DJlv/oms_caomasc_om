package com.example.commonframework.feign.inface;

import org.springframework.cloud.openfeign.FeignClient;


@FeignClient(name = "auth-service")
public interface AuthService {

}