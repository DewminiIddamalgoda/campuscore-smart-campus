package com.groupxx.smartcampus.enums;

public enum Faculty {
    COMPUTING("IT", "Computing"),
    ENGINEERING("EN", "Engineering"),
    BUSINESS("BS", "Business"),
    HUMANITIES("HM", "Humanities");

    private final String prefix;
    private final String displayName;

    Faculty(String prefix, String displayName) {
        this.prefix = prefix;
        this.displayName = displayName;
    }

    public String getPrefix() {
        return prefix;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Faculty fromDisplayName(String value) {
        if (value == null) {
            return null;
        }

        for (Faculty faculty : values()) {
            if (faculty.displayName.equalsIgnoreCase(value.trim())) {
                return faculty;
            }
        }

        return null;
    }
}
