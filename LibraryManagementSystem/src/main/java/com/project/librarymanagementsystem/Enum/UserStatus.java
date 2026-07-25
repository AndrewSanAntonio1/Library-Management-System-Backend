package com.project.librarymanagementsystem.Enum;

public enum UserStatus {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE"),
    SUSPENDED("SUSPENDED");

    private final String display;
    UserStatus(String display) {
        this.display = display;
    }
}
