package dev.ongolebulls.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PersonalDetailsUpdateDto {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^(\\+91[\\s-]?)?[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    private String gender;
    
    private String address;
    
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
    
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    private boolean isForSelf;
    private String relativeFullName;
    private String relativeRelation;

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public boolean isForSelf() { return isForSelf; }
    public void setForSelf(boolean forSelf) { isForSelf = forSelf; }

    public String getRelativeFullName() { return relativeFullName; }
    public void setRelativeFullName(String relativeFullName) { this.relativeFullName = relativeFullName; }

    public String getRelativeRelation() { return relativeRelation; }
    public void setRelativeRelation(String relativeRelation) { this.relativeRelation = relativeRelation; }
}

