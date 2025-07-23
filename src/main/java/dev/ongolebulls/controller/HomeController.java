package dev.ongolebulls.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // Loads index.html from templates/
    }

    @GetMapping("/about/overview")
    public String overview() {
        return "about/company-overview"; // Loads about/company-overview.html
    }

    @GetMapping("/hni-services")
    public String hniServices() {
        return "hni-services"; // Loads hni-services.html
    }

    @GetMapping("/investment-banking")
    public String investmentBanking() {
        return "investment-banking"; // Loads investment-banking.html
    }

    @GetMapping("/investment-management")
    public String investmentManagement() {
        return "investment-management"; // Loads investment-management.html
    }

    @GetMapping("/investment-platforms")
    public String investmentPlatforms() {
        return "investment-platforms"; // Loads investment-platforms.html
    }

    @GetMapping("/sip")
    public String sipPage() {
        return "sip"; // Loads sip.html
    }

    @GetMapping("/stock-markets-bonds")
    public String stockMarketsBonds() {
        return "stock-markets-bonds"; // Loads stock-markets-bonds.html
    }

    @GetMapping("/wealth-creation-planning")
    public String wealthCreationPlanning() {
        return "wealth-creation-planning"; // Loads wealth-creation-planning.html
    }

    @GetMapping("/wealth-management")
    public String wealthManagement() {
        return "wealth-management"; // Loads wealth-management.html
    }



    @GetMapping("/workflow")
    public String workflow() {
        return "workflow"; // Loads workflow.html
    }


   /* @GetMapping("/contact")
    public String showContactPage() {
        return "contact"; // Resolves to "templates/contact.html"
    }*/
//   /* @GetMapping("/blogs")
//    public String blogPage() {
//        return "blog"; // Loads resources/blog.html from templates/
//    }
//*/

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // Loads login.html from templates/
    }

}
