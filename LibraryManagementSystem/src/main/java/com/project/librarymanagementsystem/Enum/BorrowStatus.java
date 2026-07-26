package com.project.librarymanagementsystem.Enum;

public enum BorrowStatus {
    BORROWED("BORROWED"),
    RETURNED("RETURNED"),
    OVERDUE("OVERDUE");

    private final String display;

    BorrowStatus(String display) {
        this.display = display;
    }

    public String getDisplay() {
        return display;
    }
}
