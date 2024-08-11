package ru.kata.spring.boot_security.demo.exceptionHandler;

public class UserDataInfo {

    private String info;

    public UserDataInfo(String info) {
        this.info = info;
    }

    public UserDataInfo() {
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
