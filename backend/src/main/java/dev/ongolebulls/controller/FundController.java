package dev.ongolebulls.controller;


import dev.ongolebulls.model.Fund;
import dev.ongolebulls.service.FundService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class FundController {
    private final FundService fundService;



    @PostMapping("/funds/filter")
    @ResponseBody
    public List<Fund> filterFunds(@RequestBody FilterRequest filterRequest) {
        return fundService.filterFunds(
                filterRequest.getRisks(),
                filterRequest.getHorizons(),
                filterRequest.getGoals(),
                filterRequest.getAssets()
        );
    }
    @GetMapping("/mutual-funds")
    public String getFunds(Model model) {
        List<Fund> funds = fundService.getAllFunds();
        model.addAttribute("funds", funds);
        return "mutual-funds";
    }

}

class FilterRequest {
    private List<String> risks;
    private List<String> horizons;
    private List<String> goals;
    private List<String> assets;

    public List<String> getRisks() { return risks; }
    public void setRisks(List<String> risks) { this.risks = risks; }

    public List<String> getHorizons() { return horizons; }
    public void setHorizons(List<String> horizons) { this.horizons = horizons; }

    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }

    public List<String> getAssets() { return assets; }
    public void setAssets(List<String> assets) { this.assets = assets; }
}
