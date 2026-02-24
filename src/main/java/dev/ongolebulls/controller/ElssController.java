package dev.ongolebulls.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ElssController {

    @GetMapping("/elss-tax-saving")
    public String elssTaxSaving() {
        return "elss-tax-saving";
    }
}
