package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class CommunicationDetails {
    private String communicationMode;
    private String emailFlag;
    private String mobileDeclarationFlag;
    private String emailDeclarationFlag;
}
