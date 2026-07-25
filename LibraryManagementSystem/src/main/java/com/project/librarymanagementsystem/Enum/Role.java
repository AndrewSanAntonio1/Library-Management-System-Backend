package com.project.librarymanagementsystem.Enum;

public enum Role {
    ADMIN("ADMIN"),
    LIBRARIAN("LIBRARIAN"),
    MEMBER("MEMBER");

    private final String display;
    Role(String display) {
        this.display = display;
    }
}
