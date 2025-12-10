package dev.ongolebulls.controller;

import dev.ongolebulls.model.Client;
import dev.ongolebulls.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    // Get all clients
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    // Get client by id
    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Long id) {
        return clientService.getClient(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client Not Found"));
    }

    // Create new client
    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.saveClient(client);
    }

    // Update client
    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client update) {
        Client client = clientService.getClient(id).orElseThrow(() -> new RuntimeException("Client Not Found"));

        // Update all fields
        client.setAadhaar(update.getAadhaar());
        client.setAddress(update.getAddress());
        client.setCity(update.getCity());
        client.setAnnualIncome(update.getAnnualIncome());
        client.setBankAccountDetails(update.getBankAccountDetails());
        client.setEmail(update.getEmail());
        client.setEmailVerified(update.getEmailVerified());
        client.setFullName(update.getFullName());
        client.setInvestmentExperience(update.getInvestmentExperience());
        client.setNomineeName(update.getNomineeName());
        client.setNomineeRelation(update.getNomineeRelation());
        client.setOccupation(update.getOccupation());
        client.setPanCard(update.getPanCard());
        client.setPassword(update.getPassword());
        client.setPhone(update.getPhone());
        client.setPinCode(update.getPinCode());
        client.setPreferredInvestments(update.getPreferredInvestments());
        client.setResetToken(update.getResetToken());
        client.setRiskProfile(update.getRiskProfile());
        client.setState(update.getState());

        return clientService.saveClient(client);
    }

    // Delete client
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}

