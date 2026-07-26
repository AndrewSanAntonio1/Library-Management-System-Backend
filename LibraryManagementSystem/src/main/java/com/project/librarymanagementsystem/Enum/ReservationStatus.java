package com.project.librarymanagementsystem.Enum;

public enum ReservationStatus {
    ACTIVE("ACTIVE"),
    FULFILLED("FULFILLED"),
    CANCELLED("CANCELLED"),
    EXPIRED("EXPIRED");

    private final String display;

    ReservationStatus(String display) {
        this.display = display;
    }

    public String getDisplay() {
        return display;
    }
}
