package com.example.config;

import jakarta.annotation.PostConstruct;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

@Component
public class LicenseChecker {
    private static final String VALID_HASHED_LICENSE = "65963a83e560a521b375e7d1e4e20dc912ff30a968f710db80f416287b4492bb";

    @PostConstruct
    public void checkLicense() {
        String inputKey = System.getenv("MY_APP_LICENSE_KEY");

        if (inputKey == null || inputKey.isBlank()) {
            System.err.println("License key is missing.");
            throw new RuntimeException("Unauthorized: License key is required.");
        }

        String hashedInput = DigestUtils.sha256Hex(inputKey);

        if (!hashedInput.equals(VALID_HASHED_LICENSE)) {
            System.err.println("License check failed. Invalid license key.");
            throw new RuntimeException("Unauthorized: Invalid license key.");
        }

        System.out.println("License check passed. Application is authorized.");
    }
}
