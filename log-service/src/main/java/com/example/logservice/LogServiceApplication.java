package com.example.logservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.FeignClient;



@SpringBootApplication
public class LogServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogServiceApplication.class, args);
    }

}
