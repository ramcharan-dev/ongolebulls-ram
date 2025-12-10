package dev.ongolebulls.service;


import dev.ongolebulls.model.Client;
import dev.ongolebulls.repository.ClientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepo clientRepo;

    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }

    public Optional<Client> getClient(Long id) {
        return clientRepo.findById(id);
    }

    public Client saveClient(Client client) {
        return clientRepo.save(client);
    }

    public void deleteClient(Long id) {
        clientRepo.deleteById(id);
    }
}

