package com.server.AuthorizationServer.autorun;

import java.util.logging.Logger;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.server.AuthorizationServer.repository.UserRepository;
import com.server.AuthorizationServer.models.User;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Logger logger = Logger.getLogger(DataInitializer.class.getName());

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create default users
            User bill = new User("bill", passwordEncoder.encode("password"), "USER");
            User admin = new User("admin", passwordEncoder.encode("admin123"), "USER,ADMIN");

            userRepository.save(bill);
            userRepository.save(admin);

            logger.info("Sample users created:");
            logger.info("Username: bill, Password: password");
            logger.info("Username: admin, Password: admin123");
        }
    }

}
