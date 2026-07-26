package com.project.librarymanagementsystem.Enum;

public enum FineStatus {
    PENDING("PENDING"),
    PAID("PAID"),
    WAIVED("WAIVED");

    private final String display;

    FineStatus(String display) {
        this.display = display;
    }

    public String getDisplay() {
        return display;
    }
}
